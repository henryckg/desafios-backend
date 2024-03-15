import UserDTO from "../dtos/user.dto.js"
import { usersService } from "../repositories/index.js"
import { createHash } from "../utils/bcrypt.js"

export const registerController = async (req, res) => {
    res.status(201).send({message: 'User registered'})
}

export const loginController = async (req, res) => {
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
}

export const currentController = async (req, res) => {
    if(!req.session.user){
        return res.status(401).send({error: 'Unauthorized'})
    }
    const user = new UserDTO(req.session.user)
    res.send(user.getCurrentUser())
}

export const githubCallbackController = async (req, res) => {
    req.user.password = ''
    req.session.user = req.user;
    res.redirect('/products')
}

export const logoutController = async (req, res) => {
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
}

export const restorePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersService.getUserByEmail(email);
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
}