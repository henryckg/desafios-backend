import { Router } from "express";
import { registerController, loginController, currentController, githubCallbackController, logoutController, restorePassword } from "../controllers/sessions.controller.js";
import passport from "passport";
import { checkAdmin } from "../middlewares/auth.js";

const sessionRouter = Router()

sessionRouter.post(
    '/register', 
    passport.authenticate('register', {failureRedirect: '/failregister'}), 
    registerController
)
sessionRouter.post(
    '/login',
    checkAdmin, 
    passport.authenticate('login', {failureRedirect: '/faillogin'}),
    loginController
)
sessionRouter.get('/current', currentController)
sessionRouter.get(
    '/github', 
    passport.authenticate('github', {scope:['user:email']}), 
    async(req, res) => {})
sessionRouter.get(
    '/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/login'}), 
    githubCallbackController
)  
sessionRouter.post('/logout', logoutController)
sessionRouter.post("/restore-password", restorePassword);

export default sessionRouter