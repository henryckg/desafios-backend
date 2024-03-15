import nodemailer from 'nodemailer'
import {getVariables} from '../config/dotenv.config.js';

const {googlePass} = getVariables()

export const sendMail = async (email, ticket) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: "guaramatohenryck@gmail.com",
            pass: googlePass
        }
    })
    
    try {
        const result = transport.sendMail({
            from: 'Henryck Guaramato <guaramatohenryck@gmail.com>',
            to: email,
            subject: 'Your order is done!',
            html: `
                <div>
                    <h1>We just received your order</h1>
                    <p>The ticket number is: <b>${ticket}</b></p>
                </div>
            `
        })
    } catch (error) {
        console.log(error)
    }
}
