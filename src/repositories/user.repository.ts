import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {Role, User, UserRelations, UserWithoutCredentials} from '../models';
import {DbDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {RoleRepository} from "./role.repository";

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('RoleRepository') protected roleRepositoryGetter: Getter<RoleRepository>,
  ) {
    super(User, dataSource);

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter,);
    this.registerInclusionResolver('role', this.role.inclusionResolver);
  }
}


export class UserWithoutCredentialsRepository extends DefaultCrudRepository<
    UserWithoutCredentials,
    string,
    {}
    > {
  constructor(
      @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserWithoutCredentials, dataSource);
  }
}
