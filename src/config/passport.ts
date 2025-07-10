import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model';
import Account from '../models/account.model';
import { findOneByUsernameOrEmail } from '../services/user.service';

passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOneByUsernameOrEmail('',profile.emails?.[0].value as string)
        const findAccount = await Account.findOne({ provider: 'google', providerId: profile.id })
        if (!findAccount) {
            if (!user) {
                const newUser = await User.create({
                    username: profile.emails?.[0].value,
                    email: profile.emails?.[0].value,
                    name: profile.displayName,
                    avatarUrl: profile.photos?.[0].value,
                    role: 'user',
                })
                const account = await Account.create({
                    userId: newUser._id,
                    provider: 'google',
                    providerId: profile.id,
                    isActived: true,
                    password: '123'
                })
                const payload = {
                    userId: newUser._id.toString(),
                    accountId: account._id.toString(),
                    username: newUser.username,
                    email: newUser.email,
                    avatar: newUser.avatarUrl,
                    role: newUser.role
                }
                return done(null, payload);
            }
            const account = await Account.create({
                userId: user?._id.toString(),
                provider: 'google',
                providerId: profile.id,
                isActived: true,
                password: '123'
            })
            const payload = {
                userId: user._id.toString(),
                accountId: account._id.toString(),
                username: user.username,
                email: user.email,
                avatar: user.avatarUrl,
                role: user.role
            }
            return done(null, payload);
        }
        const account = await Account.findOne({providerId: profile.id as string}) as any
        const payload = {
            userId: user?._id.toString(),
            accountId: account._id.toString(),
            username: user?.username,
            email: user?.email,
            avatar: user?.avatarUrl,
            role: user?.role
        }
        return done(null, payload);
    } catch (err) {
        console.log(err)
        return done(err, undefined);
    }
}))

export default passport