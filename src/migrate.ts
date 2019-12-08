import {Role, User} from "./models";

require('dotenv').config();

import {ShopApplication} from './application';
import {BcryptHasher} from "./services/hash.password.bcryptjs";
import {RoleRepository, UserRepository} from "./repositories";
import {PermissionKey} from "./authorization";
import {v1 as uuid} from 'uuid';

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
    // if some permission is absent - update role
    if (Object.values(PermissionKey).some(permission => adminRole.permissions.indexOf(permission) === -1)) {
      adminRole.permissions = Object.values(PermissionKey);
      await roleRepo.save(adminRole);
      console.log('update permissions for admin role');
    }
  } catch(e) {
    // if not found - create
    await roleRepo.create(adminRole);
    console.log('create admin role');
  }

  try {
    await roleRepo.findById('guest');
  } catch {
    // if not found - create
    const guestRole = new Role({
      id: "guest",
      permissions: [
        PermissionKey.ViewOwnUser,
        PermissionKey.UpdateOwnUser,
      ]
    });
    await roleRepo.create(guestRole);
    console.log('create guest role');
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
      id: uuid()
    });
    const createdUser = await userRepo.create(newUser);
    console.log('Created default admin', createdUser);
  }

  // // create the new user and remove credential info from result
  // const savedUser = <UserWithoutCredentials>await this.userRepository.create(newUser);

  await app.migrateSchema({ existingSchema, models: [ 'Product'] });
  await app.migrateSchema({ existingSchema, models: [ 'Category'] });

  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});
