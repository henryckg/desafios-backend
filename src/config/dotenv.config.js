import dotenv from 'dotenv'

export const getVariables = () => {
    dotenv.config()

    return {
        PORT: process.env.PORT,
        mongoUrl: process.env.MONGO_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD,
        secretKey: process.env.SECRET_KEY,
        githubClientID: process.env.GITHUB_CLIENT_ID,
        githubClientPassword: process.env.GITHUB_CLIENT_PASSWORD
    }

}
