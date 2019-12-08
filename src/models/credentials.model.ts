import {Model, model, property} from '@loopback/repository';
import {UserProfile} from "@loopback/security";
import {UserPermission} from "../authorization";
import {Role} from "./role.model";

@model()
export class Credentials extends Model {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 8,
    },
  })
  password: string;


  constructor(data?: Partial<Credentials>) {
    super(data);
  }
}

export interface CredentialsRelations {
  // describe navigational properties here
}

export type CredentialsWithRelations = Credentials & CredentialsRelations;

export interface MyUserProfile extends UserProfile {
  permissions: UserPermission[];
  role: Role;
}
