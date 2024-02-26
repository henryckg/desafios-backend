import dev from "../config/dotenv.config.js"

export const checkAuth = (req, res, next) => {
    if(!req.session?.user){
        return res.redirect('/login')
    }
    next()
}

export const checkExistingUser = (req, res, next) => {
    if(req.session?.user){
        return res.redirect('/products')
    }   
    next()
}

export const checkAdmin = (req, res, next) => {
    const {email, password} = req.body;
    if(email === dev.adminEmail && password === dev.adminPassword){
            req.session.user = {
            first_name: 'Admin',
            last_name: 'Coder',
            email,
            role: 'admin'
            }
            res.redirect('/products')    
    } else {
        next()
    }
}