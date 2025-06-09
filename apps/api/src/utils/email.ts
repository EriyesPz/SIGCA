import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendOtpEmail(to: string, otp: string) {
  const info = await transporter.sendMail({
    from: `"SIGCA Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Tu código OTP para iniciar sesión',
    html: `
      <h3>Tu código de acceso es:</h3>
      <p style="font-size: 24px; font-weight: bold;">${otp}</p>
      <p>Este código expirará en 5 minutos.</p>
    `
  });

  console.log('Correo enviado: %s', info.messageId);
}
