import {HttpErrors} from '@loopback/rest';
import {RoleRepository, UserRepository} from '../repositories';
import {User, Credentials, UserWithRelations} from '../models';
import {UserService} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {repository} from '@loopback/repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/context';
import {MyUserProfile} from "../models";

export class MyUserService implements UserService<User, Credentials> {
	constructor(
		@repository(UserRepository) public userRepository: UserRepository,
		@repository(RoleRepository) public roleRepository: RoleRepository,
		@inject(PasswordHasherBindings.PASSWORD_HASHER)
		public passwordHasher: PasswordHasher,
	) {}

	async verifyCredentials(credentials: Credentials): Promise<UserWithRelations> {
		const foundUser = await this.userRepository.findOne({
			where: {email: credentials.email},
			include: [
				{relation: 'role'}
			]
		});

		if (!foundUser) {
			throw new HttpErrors.NotFound(
				`User with email ${credentials.email} not found.`,
			);
		}
		const passwordMatched = await this.passwordHasher.comparePassword(
			credentials.password,
			foundUser.password,
		);

		if (!passwordMatched) {
			throw new HttpErrors.Unauthorized('The credentials are not correct.');
		}

		return foundUser;
	}

	convertToUserProfile(user: UserWithRelations): MyUserProfile {
		// since first name and lastName are optional, no error is thrown if not provided
		let userName = '';
		if (user.firstName) userName = `${user.firstName}`;
		if (user.lastName)
			userName = user.firstName
				? `${userName} ${user.lastName}`
				: `${user.lastName}`;
		return {
			[securityId]: user.id,
			name: userName,
			permissions: user.permissions,
			role: user.role,
		};
	}
}
