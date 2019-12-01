import {DefaultCrudRepository} from '@loopback/repository';
import {User, UserRelations, UserWithoutCredentials} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(User, dataSource);
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
