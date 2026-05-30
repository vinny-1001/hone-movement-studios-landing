// Cloudflare Pages Function — POST /api/inquiry
// Creates/updates a contact in Brevo with the inquiry details as attributes.
// Set up an automation in Brevo to email your inbox when a contact is added
// to the inquiry list (or matches the SOURCE = "landing-page" attribute).
//
// Required env vars (Pages → Settings → Environment variables):
//   BREVO_API_KEY   — from https://app.brevo.com/settings/keys/api
//   BREVO_LIST_ID   — numeric ID of the list to add contacts to (e.g. 7)
//
// Optional:
//   BREVO_SENDER_EMAIL  — if set, also sends a notification email to NOTIFY_EMAIL
//   NOTIFY_EMAIL        — your inbox for instant alerts

interface Env {
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  BREVO_NEWSLETTER_LIST_ID?: string;
  BREVO_SENDER_EMAIL?: string;
  NOTIFY_EMAIL?: string;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const firstName = String(form.get("firstName") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const studio = String(form.get("studio") || "").trim();
    const when = String(form.get("when") || "").trim();
    const newsletter = form.get("newsletter") === "yes";

    if (!firstName || !contact || !studio || !when) {
      return json({ error: "Missing fields" }, 400);
    }

    if (!env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY not set");
      return json({ error: "Server not configured" }, 500);
    }

    if (!isEmail(contact)) {
      return json({ error: "Invalid email" }, 400);
    }
    const email = contact.toLowerCase();

    const inquiryListId = Number(env.BREVO_LIST_ID || 46);
    const newsletterListId = env.BREVO_NEWSLETTER_LIST_ID
      ? Number(env.BREVO_NEWSLETTER_LIST_ID)
      : undefined;
    const listIds = [inquiryListId];
    if (newsletter && newsletterListId) listIds.push(newsletterListId);

    const contactBody: Record<string, unknown> = {
      email,
      updateEnabled: true,
      attributes: {
        FIRSTNAME: firstName,
        STUDIO: studio,
        WHEN_NEEDED: when,
        SOURCE: "landing-page",
        NEWSLETTER_OPT_IN: newsletter,
      },
      listIds,
    };

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(contactBody),
    });

    if (!brevoRes.ok) {
      const body = await brevoRes.text();
      console.error("Brevo contact failed", brevoRes.status, body);
      return json({ error: "Failed to record inquiry" }, 502);
    }

    // Optional: also fire a notification email so the team sees it instantly.
    if (env.BREVO_SENDER_EMAIL && env.NOTIFY_EMAIL) {
      const text = [
        `New studio inquiry from the landing page.`,
        ``,
        `Name:    ${firstName}`,
        `Contact: ${contact}`,
        `Studio:  ${studio}`,
        `When:    ${when}`,
      ].join("\n");

      const mailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { email: env.BREVO_SENDER_EMAIL, name: "Hone Landing" },
          to: [{ email: env.NOTIFY_EMAIL }],
          replyTo: { email: contact },
          subject: `New inquiry — ${studio} — ${firstName}`,
          textContent: text,
        }),
      });
      if (!mailRes.ok) {
        const body = await mailRes.text();
        console.error("Brevo email failed", mailRes.status, body);
        // Don't fail the request — the contact is already created.
      }
    }

    return json({ ok: true }, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Bad request" }, 400);
  }
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
