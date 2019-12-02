import {Entity, model, property} from '@loopback/repository';
import {PermissionKey} from "../authorization";

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    required: true,
    id: true,
  })
  id: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  permissions: PermissionKey[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;
