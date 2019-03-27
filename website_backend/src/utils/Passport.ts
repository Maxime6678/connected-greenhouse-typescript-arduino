import passport from 'passport'
import * as passportLocal from 'passport-local'
import sha256 from 'sha256'

const LocalStrategy = passportLocal.Strategy

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username: String, password: any, cb: (error: any, user?: any, options?: passportLocal.IVerifyOptions) => void) => {
    if (sha256(password) != process.env.PANEL_PASSWORD) return cb(null, false, { message: 'Password incorrect!' })
    return cb(null, { password: password }, { message: 'Logged In Successfully' })
}))

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})