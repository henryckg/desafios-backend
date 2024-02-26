import dotenv from 'dotenv'

dotenv.config()

export default {
    PORT: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientPassword: process.env.GITHUB_CLIENT_PASSWORD
}