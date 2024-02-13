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
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
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