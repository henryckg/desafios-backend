import { Router } from "express";
import UsersMongo from "../dao/mongo/users.mongo.js";
import passport from "passport";
import { checkAdmin } from "../middlewares/auth.js";
import { createHash } from "../utils/bcrypt.js";

const sessionRouter = Router()
const usersService = new UsersMongo()

sessionRouter.post(
    '/register', 
    passport.authenticate('register', {failureRedirect: '/failregister'}), 
    async (req, res) => {
        res.status(201).send({message: 'User registered'})
    }
)

sessionRouter.post(
    '/login',
    checkAdmin, 
    passport.authenticate('login', {failureRedirect: '/faillogin'}),
    async (req, res) => {
        if(!req.user){
            return res.status(401).send({message: 'Error with credentials'})
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        res.redirect('/products')
})

sessionRouter.get('/current', (req, res) => {
    if(!req.session.user){
        return res.status(401).send({error: 'Unauthorized'})
    }
    res.send(req.session.user)
})

sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async(req, res) => {})

sessionRouter.get(
    '/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}), 
    async (req, res) => {
        req.user.password = ''
        req.session.user = req.user;
        res.redirect('/products')
    }
)  

sessionRouter.post('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err){
                return res.status(500).send({message: 'Logout Failed'})
            }
            res.send({redirect: 'http://localhost:8080/login'})
        })
    } catch (error) {
        res.status(400).send({error})
    }
})

sessionRouter.post("/restore-password", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersService.getUserByEmail({email});
        if (!user) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        user.password = createHash(password);
        await user.save();
        res.send({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status(400).send({ error });
    }
});

export default sessionRouter