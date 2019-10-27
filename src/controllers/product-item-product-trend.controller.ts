import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProductItem,
  ProductTrend,
} from '../models';
import {ProductItemRepository} from '../repositories';

export class ProductItemProductTrendController {
  constructor(
    @repository(ProductItemRepository)
    public productItemRepository: ProductItemRepository,
  ) { }

  @get('/product-items/{id}/product-trend', {
    responses: {
      '200': {
        description: 'ProductTrend belonging to ProductItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductTrend)},
          },
        },
      },
    },
  })
  async getProductTrend(
    @param.path.number('id') id: typeof ProductItem.prototype.id,
  ): Promise<ProductTrend> {
    return this.productItemRepository.productTrend(id);
  }
}
