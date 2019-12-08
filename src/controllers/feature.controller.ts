import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
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
import {Feature} from '../models';
import {FeatureRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {authorize, PermissionKey} from "../authorization";

export class FeatureController {
  constructor(
    @repository(FeatureRepository)
    public featureRepository : FeatureRepository,
  ) {}

  @authenticate('jwt')
  @authorize([PermissionKey.ManageFeatures])
  @post('/features', {
    responses: {
      '200': {
        description: 'Feature model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feature)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {
            title: 'NewFeature',
            exclude: ['id'],
          }),
        },
      },
    })
    feature: Omit<Feature, 'id'>,
  ): Promise<Feature> {
    return this.featureRepository.create(feature);
  }

  @authorize(['*'])
  @get('/features/count', {
    responses: {
      '200': {
        description: 'Feature model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Feature)) where?: Where<Feature>,
  ): Promise<Count> {
    return this.featureRepository.count(where);
  }

  @authorize(['*'])
  @get('/features', {
    responses: {
      '200': {
        description: 'Array of Feature model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Feature)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Feature)) filter?: Filter<Feature>,
  ): Promise<Feature[]> {
    return this.featureRepository.find(filter);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageFeatures])
  @patch('/features', {
    responses: {
      '200': {
        description: 'Feature PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    feature: Feature,
    @param.query.object('where', getWhereSchemaFor(Feature)) where?: Where<Feature>,
  ): Promise<Count> {
    return this.featureRepository.updateAll(feature, where);
  }

  @authorize(['*'])
  @get('/features/{id}', {
    responses: {
      '200': {
        description: 'Feature model instance',
        content: {'application/json': {schema: getModelSchemaRef(Feature)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Feature> {
    return this.featureRepository.findById(id);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageFeatures])
  @patch('/features/{id}', {
    responses: {
      '204': {
        description: 'Feature PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Feature, {partial: true}),
        },
      },
    })
    feature: Feature,
  ): Promise<void> {
    await this.featureRepository.updateById(id, feature);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageFeatures])
  @put('/features/{id}', {
    responses: {
      '204': {
        description: 'Feature PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() feature: Feature,
  ): Promise<void> {
    await this.featureRepository.replaceById(id, feature);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageFeatures])
  @del('/features/{id}', {
    responses: {
      '204': {
        description: 'Feature DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.featureRepository.deleteById(id);
  }
}
