import {Role, User} from "./models";

require('dotenv').config();

import {ShopApplication} from './application';
import {BcryptHasher} from "./services/hash.password.bcryptjs";
import {RoleRepository, UserRepository} from "./repositories";
import {PermissionKey} from "./authorization";
const uuidv1 = require('uuid/v1');

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new ShopApplication();
  await app.boot();

  await app.migrateSchema({ existingSchema, models: [ 'Role'] });
  await app.migrateSchema({ existingSchema, models: [ 'User'] });

  // create default roles
  const roleRepo = await app.getRepository(RoleRepository);

  let adminRole = new Role({
    id: "admin",
    permissions: Object.values(PermissionKey), // allow all permissions
  });
  try {
    adminRole = await roleRepo.findById('admin');
  } catch(e) {
    await roleRepo.create(adminRole);
  }

  try {
    await roleRepo.findById('guest');
  } catch {
    const guestRole = new Role({
      id: "guest",
      permissions: [
        PermissionKey.ViewOwnUser,
        PermissionKey.UpdateOwnUser,
      ]
    });
    await roleRepo.create(guestRole);
  }

  // create first default admin if it not exist yet
  const userRepo = await app.getRepository(UserRepository);
  const { count: countUsers } = await userRepo.count();

  if (countUsers === 0) {
    const newUser: User = new User({
      email: "admin@admin.com",
      roleName: 'admin',
      permissions: [],
      firstName: 'admin',
      lastName: 'admin',
      password: await (new BcryptHasher(10)).hashPassword('adminadmin'),
      id: uuidv1()
    });
    const createdUser = await userRepo.create(newUser);
    console.log('Created default admin', createdUser);
  }

  // // create the new user and remove credential info from result
  // const savedUser = <UserWithoutCredentials>await this.userRepository.create(newUser);

  // await app.migrateSchema({ existingSchema, models: [ 'ProductCategory'] });
  // await app.migrateSchema({ existingSchema, models: [ 'ProductTrend'] });
  // await app.migrateSchema({ existingSchema, models: [ 'ProductItem'] });
  // await app.migrateSchema({ existingSchema, models: [ 'ProductItemModification'] });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
