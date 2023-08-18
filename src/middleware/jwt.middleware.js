import jwt from 'jsonwebtoken';
import passport from 'passport';

//importación de libreria de dating
import { DateTime } from 'luxon';
import environment from '../config/environment.js';

const generateToken = (user) => {
	return jwt.sign({ user }, environment.jwtPrivateKey, { expiresIn: '1h' });
};

const middlewarePassportJWT = async (req, res, next) => {
	passport.authenticate('current', { session: false }, (err, usr, info) => {
		const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
		if (err) {
			return next(err);
		}
		if (!usr) {
			return res.status(401).json({ status: 'error', message: 'user/password incorrect' });
		}

		req.logger.info(`${dateTime} - Login - User: ${usr.user.first_name} ${usr.user.last_name} ${usr.user.email}`);
		req.user = usr;

		next();
	})(req, res, next);
};

export { generateToken, middlewarePassportJWT };