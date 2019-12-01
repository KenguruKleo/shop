import { cloneDeep } from 'lodash';
import {
	Entity,
	model,
	MODEL_WITH_PROPERTIES_KEY,
	//MODEL_PROPERTIES_KEY,
	//ModelDefinition,
	property
} from '@loopback/repository';
import { MetadataInspector } from '@loopback/metadata';

@model({
	settings: {
		indexes: {
			uniqueEmail: {
				keys: {
					email: 1,
				},
				options: {
					unique: true,
				},
			},
		},
		hiddenProperties: ['password'],
	},
})
export class User extends Entity {
	@property({
		type: 'string',
		id: true,
	})
	id: string;

	@property({
		type: 'string',
		required: true,
	})
	email: string;

	@property({
		type: 'string',
		required: true,
	})
	password: string;

	@property({
		type: 'string',
	})
	firstName?: string;

	@property({
		type: 'string',
	})
	lastName?: string;

	constructor(data?: Partial<User>) {
		super(data);
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userDefinition = cloneDeep(User.definition);
delete userDefinition.properties['password'];

@model(userDefinition)
export class UserWithoutCredentials extends Entity {
	constructor(data?: Partial<UserWithoutCredentials>) {
		super(data);
	}
}
MetadataInspector.defineMetadata(MODEL_WITH_PROPERTIES_KEY.key, userDefinition, UserWithoutCredentials);


export interface UserRelations {
	// describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
