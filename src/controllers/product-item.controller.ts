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
import {ProductItem} from '../models';
import {ProductItemRepository} from '../repositories';
import {authenticate} from "@loopback/authentication";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {authorize} from "../authorization";

export class ProductItemController {
  constructor(
    @repository(ProductItemRepository)
    public productItemRepository : ProductItemRepository,
  ) {}

  @post('/product-items', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ProductItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductItem)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItem, {
            title: 'NewProductItem',
            exclude: ['id'],
          }),
        },
      },
    })
    productItem: Omit<ProductItem, 'id'>,
  ): Promise<ProductItem> {
    return this.productItemRepository.create(productItem);
  }

  @get('/product-items/count', {
    responses: {
      '200': {
        description: 'ProductItem model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ProductItem)) where?: Where<ProductItem>,
  ): Promise<Count> {
    return this.productItemRepository.count(where);
  }

  @get('/product-items', {
    responses: {
      '200': {
        description: 'Array of ProductItem model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductItem)},
          },
        },
      },
    },
  })
  @authorize(['*'])
  async find(
    @param.query.object('filter', getFilterSchemaFor(ProductItem)) filter?: Filter<ProductItem>,
  ): Promise<ProductItem[]> {
    return this.productItemRepository.find(filter);
  }

  @patch('/product-items', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'ProductItem PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  @authenticate('jwt')
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItem, {partial: true}),
        },
      },
    })
    productItem: ProductItem,
    @param.query.object('where', getWhereSchemaFor(ProductItem)) where?: Where<ProductItem>,
  ): Promise<Count> {
    return this.productItemRepository.updateAll(productItem, where);
  }

  @get('/product-items/{id}', {
    responses: {
      '200': {
        description: 'ProductItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductItem)}},
      },
    },
  })
  async findById(
      @param.path.number('id') id: number,
      @param.query.object('filter', getFilterSchemaFor(ProductItem)) filter?: Filter<ProductItem>,
  ): Promise<ProductItem> {
    return this.productItemRepository.findById(id, filter);
  }

  @patch('/product-items/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItem PATCH success',
      },
    },
  })
  @authenticate('jwt')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItem, {partial: true}),
        },
      },
    })
    productItem: ProductItem,
  ): Promise<void> {
    await this.productItemRepository.updateById(id, productItem);
  }

  @put('/product-items/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItem PUT success',
      },
    },
  })
  @authenticate('jwt')
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productItem: ProductItem,
  ): Promise<void> {
    await this.productItemRepository.replaceById(id, productItem);
  }

  @del('/product-items/{id}', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: 'ProductItem DELETE success',
      },
    },
  })
  @authenticate('jwt')
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productItemRepository.deleteById(id);
  }
}
