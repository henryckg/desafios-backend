import dotenv from 'dotenv'

export const getVariables = (options) => {
    const environment = options.opts().mode;
    dotenv.config({
        path: environment === 'production' ? './.env.production' : './.env.development'
    })

    return {
        PORT: process.env.PORT,
        mongoUrl: process.env.MONGO_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD,
        secretKey: process.env.SECRET_KEY,
        githubClientID: process.env.GITHUB_CLIENT_ID,
        githubClientPassword: process.env.GITHUB_CLIENT_PASSWORD,
        googlePass: process.env.GOOGLE_PASSWORD,
        NODE_ENV: process.env.NODE_ENV
    }
}
