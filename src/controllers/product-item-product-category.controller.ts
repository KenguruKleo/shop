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
  ProductCategory,
} from '../models';
import {ProductItemRepository} from '../repositories';

export class ProductItemProductCategoryController {
  constructor(
    @repository(ProductItemRepository)
    public productItemRepository: ProductItemRepository,
  ) { }

  @get('/product-items/{id}/product-category', {
    responses: {
      '200': {
        description: 'ProductCategory belonging to ProductItem',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductCategory)},
          },
        },
      },
    },
  })
  async getProductCategory(
    @param.path.number('id') id: typeof ProductItem.prototype.id,
  ): Promise<ProductCategory> {
    return this.productItemRepository.productCategory(id);
  }
}
