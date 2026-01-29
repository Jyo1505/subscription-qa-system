const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendInvoice = async (to, invoice) => {
  const html = `
    <h2>Subscription Invoice</h2>
    <p>Thank you for your purchase.</p>
    <hr/>
    <p><b>Plan:</b> ${invoice.plan}</p>
    <p><b>Amount:</b> ₹${invoice.amount}</p>
    <p><b>Transaction ID:</b> ${invoice.txnId}</p>
    <p><b>Valid till:</b> ${invoice.expiry}</p>
    <p><b>Date:</b> ${invoice.date}</p>
    <hr/>
    <p>StackOverflow Clone</p>
  `;

  await transporter.sendMail({
    from: `"StackOverflow Clone" <${process.env.EMAIL}>`,
    to,
    subject: "Subscription Invoice",
    html
  });
};
