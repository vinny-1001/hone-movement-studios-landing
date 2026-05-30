// Cloudflare Pages Function — POST /api/inquiry
// Forwards the inquiry by email via MailChannels (free for Cloudflare Pages).
// Configure DESTINATION_EMAIL and FROM_EMAIL as plain text env vars in the
// Pages project. FROM_EMAIL must be on a domain whose DNS includes a
// MailChannels SPF/DKIM/_mailchannels TXT record (see Cloudflare docs).

interface Env {
  DESTINATION_EMAIL?: string;
  FROM_EMAIL?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const firstName = String(form.get("firstName") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const studio = String(form.get("studio") || "").trim();
    const when = String(form.get("when") || "").trim();

    if (!firstName || !contact || !studio || !when) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const to = env.DESTINATION_EMAIL || "hello@hone.london";
    const from = env.FROM_EMAIL || "noreply@hone.london";

    const subject = `New inquiry — ${studio} — ${firstName}`;
    const text = [
      `New studio inquiry from the landing page.`,
      ``,
      `Name:    ${firstName}`,
      `Contact: ${contact}`,
      `Studio:  ${studio}`,
      `When:    ${when}`,
    ].join("\n");

    const mc = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: from, name: "Hone Landing" },
        reply_to: { email: contact.includes("@") ? contact : from },
        subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });

    if (!mc.ok) {
      const body = await mc.text();
      console.error("MailChannels failed", mc.status, body);
      return new Response(JSON.stringify({ error: "Mail send failed" }), {
        status: 502,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
};
