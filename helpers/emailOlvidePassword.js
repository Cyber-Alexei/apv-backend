import nodemailer from 'nodemailer';
const emailRecuperarPassword = async (datosEmail) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });  
    // Enviar E-mail
    const {email, nombre, token} = datosEmail;
    const info = await transporter.sendMail({
        from: "APV - Veterinaria",
        to: email,
        subject: "Reestablece tu password en APV",
        text: "Reestablece tu password en APV",
        html: `
            <p>Hola ${nombre}</p>
            <br>
            <p>Has solicitado recientemente reestablecer tu password, 
            para esto da clic en el siguiente enlace:  
            <a href="
            ${process.env.FRONTEND_URL}/recuperar-password/${token}
            ">Reestablecer password</a>
            </p>
            <br>
            <p>Si no has creado esta cuenta, puedes ignorar este mensaje</p>
        `
    })
}
export default emailRecuperarPassword;