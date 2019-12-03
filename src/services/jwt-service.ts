import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {TokenServiceBindings} from '../keys';
import {MyUserProfile} from "../models";

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
	constructor(
		@inject(TokenServiceBindings.TOKEN_SECRET)
		private jwtSecret: string,
		@inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
		private jwtExpiresIn: string,
	) {}

	async verifyToken(token: string): Promise<MyUserProfile> {
		if (!token) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : 'token' is null`,
			);
		}

		let userProfile: MyUserProfile;

		try {
			// decode user profile from token
			const decodedToken = await verifyAsync(token, this.jwtSecret);
			// don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
			userProfile = Object.assign(
				{
					[securityId]: '',
					name: '',
					id: '',
					permissions: [],
					role: { permissions: [] }
				},
				{
					[securityId]: decodedToken.id,
					name: decodedToken.name,
					id: decodedToken.id,
					permissions: decodedToken.permissions,
					role: JSON.parse(decodedToken.role),
				},
			);
		} catch (error) {
			throw new HttpErrors.Unauthorized(
				`Error verifying token : ${error.message}`,
			);
		}
		return userProfile;
	}

	async generateToken(userProfile: MyUserProfile): Promise<string> {
		if (!userProfile) {
			throw new HttpErrors.Unauthorized(
				'Error generating token : userProfile is null',
			);
		}
		const userInfoForToken = {
			id: userProfile[securityId],
			name: userProfile.name,
			email: userProfile.email,
			permissions: userProfile.permissions,
			role: JSON.stringify(userProfile.role),
		};
		// Generate a JSON Web Token
		let token: string;
		try {
			token = await signAsync(userInfoForToken, this.jwtSecret, {
				expiresIn: Number(this.jwtExpiresIn),
			});
		} catch (error) {
			throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
		}

		return token;
	}
}
