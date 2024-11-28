import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACKURL,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { id, displayName, emails, name } = profile;
      const user = {
        googleId: id,
        email: emails[0].value,
        displayName,
        firstName: name?.givenName,
        accessToken,
      };
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
}
