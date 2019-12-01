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
import {ProductItemModification} from '../models';
import {ProductItemModificationRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";

export class ProductItemModificationController {
  constructor(
    @repository(ProductItemModificationRepository)
    public productItemModificationRepository : ProductItemModificationRepository,
  ) {}

  @post('/product-item-modifications', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ProductItemModification model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductItemModification)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItemModification, {
            title: 'NewProductItemModification',
            exclude: ['id'],
          }),
        },
      },
    })
    productItemModification: Omit<ProductItemModification, 'id'>,
  ): Promise<ProductItemModification> {
    return this.productItemModificationRepository.create(productItemModification);
  }

  @get('/product-item-modifications/count', {
    responses: {
      '200': {
        description: 'ProductItemModification model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ProductItemModification)) where?: Where<ProductItemModification>,
  ): Promise<Count> {
    return this.productItemModificationRepository.count(where);
  }

  @get('/product-item-modifications', {
    responses: {
      '200': {
        description: 'Array of ProductItemModification model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductItemModification)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ProductItemModification)) filter?: Filter<ProductItemModification>,
  ): Promise<ProductItemModification[]> {
    return this.productItemModificationRepository.find(filter);
  }

  @patch('/product-item-modifications', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ProductItemModification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItemModification, {partial: true}),
        },
      },
    })
    productItemModification: ProductItemModification,
    @param.query.object('where', getWhereSchemaFor(ProductItemModification)) where?: Where<ProductItemModification>,
  ): Promise<Count> {
    return this.productItemModificationRepository.updateAll(productItemModification, where);
  }

  @get('/product-item-modifications/{id}', {
    responses: {
      '200': {
        description: 'ProductItemModification model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductItemModification)}},
      },
    },
  })
  async findById(
      @param.path.number('id') id: number,
      @param.query.object('filter', getFilterSchemaFor(ProductItemModification)) filter?: Filter<ProductItemModification>,
  ): Promise<ProductItemModification> {
    return this.productItemModificationRepository.findById(id, filter);
  }

  @patch('/product-item-modifications/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItemModification PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItemModification, {partial: true}),
        },
      },
    })
    productItemModification: ProductItemModification,
  ): Promise<void> {
    await this.productItemModificationRepository.updateById(id, productItemModification);
  }

  @put('/product-item-modifications/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItemModification PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productItemModification: ProductItemModification,
  ): Promise<void> {
    await this.productItemModificationRepository.replaceById(id, productItemModification);
  }

  @del('/product-item-modifications/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItemModification DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productItemModificationRepository.deleteById(id);
  }
}
