"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passportLocal = __importStar(require("passport-local"));
const sha256_1 = __importDefault(require("sha256"));
const LocalStrategy = passportLocal.Strategy;
passport_1.default.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, (username, password, cb) => {
    if (sha256_1.default(password) != process.env.PANEL_PASSWORD)
        return cb(null, false, { message: 'Password incorrect!' });
    return cb(null, { password: password }, { message: 'Logged In Successfully' });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
