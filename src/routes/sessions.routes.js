import { Router } from "express";
import { userModel } from '../dao/models/user.model.js';

const sessionRouter = Router()

sessionRouter.post('/register', async (req, res) => {
    const {first_name, last_name, email, password} = req.body
    try {
        await userModel.create({
            first_name,
            last_name,
            email,
            password,
        })
        res.status(201).send({message: 'User created successfully'})
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

sessionRouter.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        if(email === 'adminCoder@coder.com'){
            if(password === 'adminCod3r123'){
                req.session.user = {
                first_name: 'Admin',
                last_name: 'Coder',
                email,
                password,
                role: 'admin'
                }
            } else {
                return res.status(401).send({message: 'Invalid password'})
            }
        } else {
            const user = await userModel.findOne({email})
            if(!user){
                return res.status(404).send({message: 'Invalid email'})
            }
            if(user.password !== password){
                return res.status(401).send({message: 'Invalid password'})
            }
            req.session.user = user
        }
        res.redirect('/products')
    } catch (error) {
        console.error(error)
        res.status(400).send({error})
    }
})

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

export default sessionRouter