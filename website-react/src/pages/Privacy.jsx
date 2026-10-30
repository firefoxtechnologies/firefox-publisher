import LegalPage from "../components/LegalPage.jsx";

const SECTIONS = [
  ["Who we are", [
    "Firefox Publisher (\"we\", \"us\") is a book publishing and design service based in Hoboken, New Jersey, and a child company of Firefox Technologies. This policy explains what information we collect through firefoxpublisher.com, why, and what choices you have.",
  ]],
  ["What we collect", [
    "Information you give us:",
    ["Contact form: your name, email address, phone number, the service you are interested in and your message.", "Email and phone: whatever you send or tell us when you contact us directly.", "Live chat: the messages you type into the chat window and any contact details you share there."],
    "Information collected automatically:",
    ["Basic technical data, such as your IP address, browser type and pages requested, which our hosting provider processes to deliver and protect the site.", "Fonts are loaded from Google Fonts, so Google receives your IP address when a page loads."],
    "Stored on your own device only:",
    ["The free book cover maker can save your current design in your browser so you can come back to it.", "The audiobook player can remember your playback position and speed.", "This information stays in your browser. We do not receive it."],
  ]],
  ["How we use your information", [
    ["To reply to your message, answer questions and prepare a quote or project scope.", "To deliver the services you ask for and keep records of our work with you.", "To keep the site secure and prevent spam and abuse.", "To meet legal and accounting obligations."],
    "We do not sell your personal information, and we do not use it for advertising by third parties.",
  ]],
  ["Who we share it with", [
    "We share information only with service providers that help us run the site and talk to you, and only as needed:",
    ["Cloudflare, which hosts the website and handles the email that delivers contact form messages to us.", "Tawk.to, which provides the live chat window.", "Google Fonts, which supplies the site's typefaces."],
    "We may also disclose information if the law requires it or to protect our rights and the safety of others.",
  ]],
  ["Cookies and tracking", [
    "The live chat provider may set its own cookies or similar storage to run the chat and remember a conversation. We do not currently run advertising or analytics trackers on this site. If that changes, we will update this page.",
    "You can block or delete cookies in your browser settings. The site will still work, though the chat may not remember earlier conversations.",
  ]],
  ["How long we keep it", [
    "We keep contact messages and project records for as long as we need them to respond to you, deliver your project and meet our legal obligations. You can ask us to delete your information at any time (see below).",
  ]],
  ["Your choices and rights", [
    "You can ask us to tell you what we hold about you, correct it, or delete it, and you can ask us to stop contacting you. Email us and we will respond within a reasonable time. Depending on where you live (for example California or other US states with privacy laws, or the UK and EU), you may have additional rights, and we will honor them as the law requires.",
  ]],
  ["Security", [
    "We use reasonable technical and organizational measures to protect your information. No website or email is completely secure, so please do not send passwords or payment card numbers through the contact form or chat.",
  ]],
  ["Children", [
    "This site is meant for adults. We do not knowingly collect personal information from children under 13. If you believe a child has sent us information, contact us and we will delete it.",
  ]],
  ["Links to other sites", [
    "The site links to other websites, such as our parent company, social media pages and Standard Ebooks. We are not responsible for their privacy practices.",
  ]],
  ["Changes to this policy", [
    "We may update this policy from time to time. The date at the top shows when it last changed.",
  ]],
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      metaTitle="Privacy Policy | Firefox Publisher"
      description="How Firefox Publisher collects, uses and protects your information when you use our website, contact form and live chat."
      path="privacy-policy"
      intro="What we collect when you use our website, why we collect it and the choices you have."
      sections={SECTIONS}
    />
  );
}
