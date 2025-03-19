export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

export const POST: APIRoute = async ({ request }) => {
  console.log("aki etrno" );
  const data = await request.json();
  console.log(data);

  const BREVO_API_KEY = "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"

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
  sendSmtpEmail.sender = { "name": "Brajin", "email": "bhanna@somosexperiences.com" };
  sendSmtpEmail.to = [
    { "email": "aherranz@somosexperiences.com", "name": "Alex" }
  ];
  sendSmtpEmail.params = { "name": data.name, "email": data.email, "message": data.message, "phone": data.phone, "company": data.company };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });

  return new Response(
    JSON.stringify({
      message: "Success!"
    }),
    { status: 200 }
  );
};