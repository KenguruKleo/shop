import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ProductItem,
  ProductItemModification,
} from '../models';
import {ProductItemRepository} from '../repositories';

export class ProductItemProductItemModificationController {
  constructor(
    @repository(ProductItemRepository) protected productItemRepository: ProductItemRepository,
  ) { }

  @get('/product-items/{id}/product-item-modifications', {
    responses: {
      '200': {
        description: 'Array of ProductItemModification\'s belonging to ProductItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductItemModification)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProductItemModification>,
  ): Promise<ProductItemModification[]> {
    return this.productItemRepository.productItemModifications(id).find(filter);
  }

  @post('/product-items/{id}/product-item-modifications', {
    responses: {
      '200': {
        description: 'ProductItem model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductItemModification)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof ProductItem.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItemModification, {
            title: 'NewProductItemModificationInProductItem',
            exclude: ['id'],
            optional: ['productItemId']
          }),
        },
      },
    }) productItemModification: Omit<ProductItemModification, 'id'>,
  ): Promise<ProductItemModification> {
    return this.productItemRepository.productItemModifications(id).create(productItemModification);
  }

  @patch('/product-items/{id}/product-item-modifications', {
    responses: {
      '200': {
        description: 'ProductItem.ProductItemModification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductItemModification, {partial: true}),
        },
      },
    })
    productItemModification: Partial<ProductItemModification>,
    @param.query.object('where', getWhereSchemaFor(ProductItemModification)) where?: Where<ProductItemModification>,
  ): Promise<Count> {
    return this.productItemRepository.productItemModifications(id).patch(productItemModification, where);
  }

  @del('/product-items/{id}/product-item-modifications', {
    responses: {
      '200': {
        description: 'ProductItem.ProductItemModification DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProductItemModification)) where?: Where<ProductItemModification>,
  ): Promise<Count> {
    return this.productItemRepository.productItemModifications(id).delete(where);
  }
}
