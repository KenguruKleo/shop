import {cloneDeep} from 'lodash';
import {belongsTo, Entity, model, MODEL_WITH_PROPERTIES_KEY, property} from '@loopback/repository';
import {MetadataInspector} from '@loopback/metadata';

import {UserPermission} from "../authorization";
import {Role} from "./role.model";

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

	@property.array(String)
	permissions: UserPermission[];

	@belongsTo(() => Role, {name: 'role'})
	roleName: string;

	constructor(data?: Partial<User>) {
		super(data);
	}
}

const userDefinition = cloneDeep(User.definition);
delete userDefinition.properties['password'];
delete userDefinition.properties['permissions'];
delete userDefinition.properties['roleName'];

@model(userDefinition)
export class UserWithoutCredentials extends Entity {
	constructor(data?: Partial<UserWithoutCredentials>) {
		super(data);
	}
}
MetadataInspector.defineMetadata(MODEL_WITH_PROPERTIES_KEY.key, userDefinition, UserWithoutCredentials);


export interface UserRelations {
	// describe navigational properties here
	role: Role;
}

export type UserWithRelations = User & UserRelations;

