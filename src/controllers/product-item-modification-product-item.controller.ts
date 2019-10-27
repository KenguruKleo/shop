import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ProductItemModification,
  ProductItem,
} from '../models';
import {ProductItemModificationRepository} from '../repositories';

export class ProductItemModificationProductItemController {
  constructor(
    @repository(ProductItemModificationRepository)
    public productItemModificationRepository: ProductItemModificationRepository,
  ) { }

  @get('/product-item-modifications/{id}/product-item', {
    responses: {
      '200': {
        description: 'ProductItem belonging to ProductItemModification',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductItem)},
          },
        },
      },
    },
  })
  async getProductItem(
    @param.path.number('id') id: typeof ProductItemModification.prototype.id,
  ): Promise<ProductItem> {
    return this.productItemModificationRepository.productItem(id);
  }
}
