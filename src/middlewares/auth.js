import {getVariables} from "../config/dotenv.config.js"

const {adminEmail, adminPassword} = getVariables()

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
    if(email === adminEmail && password === adminPassword){
            req.session.user = {
            first_name: 'Admin',
            last_name: 'Coder',
            email,
            role: 'admin'
            }
            res.redirect('/realtimeproducts')    
    } else {
        next()
    }
}

export const handlePolicies = (policies) => (req, res, next) => {
    if(policies.find(p => p === 'PUBLIC')) return next()
    const user = req.session.user
    if(!user){
        return res.status(401).send({error: 'Unauthorized'})
    }
    if(!policies.includes(user.role.toUpperCase())){
        return res.status(403).send({error: 'Forbidden'})
    }
    next()
    }