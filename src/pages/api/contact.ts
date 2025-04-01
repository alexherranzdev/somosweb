export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
  const BREVO_SENDER = import.meta.env.BREVO_SENDER ?? 'digital@somosexperiences.com';
  const CONCTACT_EMAIL = import.meta.env.CONCTACT_EMAIL ?? 'digital@somosexperiences.com';
  if (!BREVO_API_KEY) {
    return new Response(JSON.stringify({ error: 'BREVO_API_KEY not configured' }), { status: 500 });
  }

  let apiInstance = new TransactionalEmailsApi();
  apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
  let sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = "New Contact Form Submission from SOMOS Web";
  let htmlContent = "<html><body>";
  htmlContent += "<h1>New Contact Form Submission from SOMOS Web</h1>";
  htmlContent += "<p>Name: " + data.name + "</p>";
  htmlContent += "<p>Email: " + data.email + "</p>";
  if (data.phone) {
    htmlContent += "<p>Phone: " + data.phone + "</p>";
  }
  htmlContent += "<p>Company: " + data.company + "</p>";
  htmlContent += "<p>Message: " + data.message + "</p>";
  htmlContent += "</body></html>";
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { "name": "SOMOS Experiences", "email": BREVO_SENDER };
  sendSmtpEmail.to = [
    { "email": CONCTACT_EMAIL, "name": "SOMOS Experiences" }
  ];
  sendSmtpEmail.params = { "name": data.name, "email": data.email, "message": data.message, "phone": data.phone, "company": data.company };

  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then(function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
      console.error(error);
    });

  return new Response(
    JSON.stringify({
      success: true,
      message: "Success!"
    }),
    { status: 200 }
  );
};