import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {securityId, SecurityBindings} from '@loopback/security';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {inject} from "@loopback/context";

import {User, Credentials, UserWithoutCredentials} from '../models';
import {UserRepository, UserWithoutCredentialsRepository} from '../repositories';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from "../keys";
import {PasswordHasher} from "../services/hash.password.bcryptjs";
import {authenticate, TokenService, UserService} from "@loopback/authentication";
import {validateCredentials} from "../services/validator";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {MyUserProfile} from "../models";
import {authorize, PermissionKey} from "../authorization";

const uuidv1 = require('uuid/v1');

export class UserController {
  constructor(
      @repository(UserRepository) public userRepository: UserRepository,
      @repository(UserWithoutCredentialsRepository) public userWithoutCredentialsRepository: UserWithoutCredentialsRepository,
      @inject(PasswordHasherBindings.PASSWORD_HASHER)
      public passwordHasher: PasswordHasher,
      @inject(TokenServiceBindings.TOKEN_SERVICE)
      public jwtService: TokenService,
      @inject(UserServiceBindings.USER_SERVICE)
      public userService: UserService<User, Credentials>,
  ) {}

  @post('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserWithoutCredentials)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.CreateAnyUser])
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<UserWithoutCredentials> {
    // ensure a valid email value and password value
    const { email, password } = user;
    const credentials = new Credentials({ email, password });
    validateCredentials(credentials);

    // encrypt the password
    const newUser: User = {
      ...user,
      password: await this.passwordHasher.hashPassword(user.password),
      id: uuidv1(),
    };

    // create the new user and remove credential info from result
    const savedUser = <UserWithoutCredentials>await this.userRepository.create(newUser);

    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async login(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(Credentials, {
              title: 'Credentials',
            }),
          },
        },
      }) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a MyUserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user) as MyUserProfile;

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/users/me', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: { 'application/json': { schema: getModelSchemaRef(UserWithoutCredentials) } },
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.ViewOwnUser])
  async printCurrentUser(
      @inject(SecurityBindings.USER) currentUserProfile: MyUserProfile,
  ): Promise<UserWithoutCredentials> {
    return this.userWithoutCredentialsRepository.findById(currentUserProfile[securityId])
  }

  @get('/users/count', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User without credentials repository model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.ViewAnyUser])
  async count(
    @param.query.object('where', getWhereSchemaFor(UserWithoutCredentials)) where?: Where<UserWithoutCredentials>,
  ): Promise<Count> {
    return this.userWithoutCredentialsRepository.count(where);
  }

  @get('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of User without credentials repository model instances',
        content: { 'application/json': { schema: {type: 'array', items: getModelSchemaRef(UserWithoutCredentials)} } },
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.ViewAnyUser])
  async find(
    @param.query.object('filter', getFilterSchemaFor(UserWithoutCredentials)) filter?: Filter<UserWithoutCredentials>,
  ): Promise<UserWithoutCredentials[]> {
    return this.userWithoutCredentialsRepository.find(filter);
  }

  @patch('/users', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: UserWithoutCredentials}},
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.UpdateAnyUser])
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWithoutCredentials, {partial: true}),
        },
      },
    })
    user: UserWithoutCredentials,
    @param.query.object('where', getWhereSchemaFor(UserWithoutCredentials)) where?: Where<UserWithoutCredentials>,
  ): Promise<Count> {
    return this.userWithoutCredentialsRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User without credentials repository model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserWithoutCredentials)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.ViewAnyUser])
  async findById(@param.path.string('id') id: string): Promise<UserWithoutCredentials> {
    return this.userWithoutCredentialsRepository.findById(id);
  }

  @patch('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User without credentials repository model PATCH success',
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.UpdateAnyUser])
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserWithoutCredentials, {partial: true}),
        },
      },
    })
    user: UserWithoutCredentials,
  ): Promise<void> {
    await this.userWithoutCredentialsRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User without credentials repository model PUT success',
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.UpdateAnyUser])
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: UserWithoutCredentials,
  ): Promise<void> {
    await this.userWithoutCredentialsRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'User without credentials repository model DELETE success',
      },
    },
  })
  @authenticate('jwt')
  @authorize([PermissionKey.DeleteAnyUser])
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userWithoutCredentialsRepository.deleteById(id);
  }
}
