import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { IUser, User } from '../models/user';

const JWT_STRATEGY_OPTS = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(JWT_STRATEGY_OPTS, (jwtPayload: { sub: string }, done: any) => {
    // User tries to sign in, passport will look for a matching user
    User.findOne({ _id: jwtPayload.sub })
      .then((user: IUser | null) => {
        done(null, (user && user.userName) || false);
      })
      .catch((err) => done(err, false));
  })
);

const JWTVerifier = passport.authenticate('jwt', { session: false });

export { passport, JWTVerifier };
