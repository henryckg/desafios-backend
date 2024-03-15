import passport from "passport";
import local from 'passport-local'
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { Strategy as GithubStrategy} from "passport-github2";
import {getVariables} from './dotenv.config.js'
import {usersService} from "../repositories/index.js"

const {githubClientID, githubClientPassword} = getVariables()
const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, 
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            try {
                const user = await usersService.getUserByEmail(username)
                if(user){
                    console.log('User already exists')
                    return done(null, false)
                }
                const newUser = await usersService.saveUser({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                })
                return done(null, newUser)
            } catch (error) {
                return done('Error to obtain user: ' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async (username, password, done) => {            
        try {
                const user = await usersService.getUserByEmail(username)
                if(!user){
                    console.log("User doesn't exists")
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('github', new GithubStrategy(
        {
            clientID: githubClientID,
            clientSecret: githubClientPassword,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await usersService.getUserByEmail(profile._json.email)
                if(!user){
                    const newUser = {
                        first_name: profile._json.name.split(' ')[0],
                        last_name: profile._json.name.split(' ')[1],
                        email: profile._json.email,
                        password: 'GithubGenerated',
                        role: 'user'
                    }
                    const result = await usersService.saveUser(newUser)
                    return done(null, result)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersService.getUserById({_id: id})
        done(null, user)
    })
}

export default initializePassport