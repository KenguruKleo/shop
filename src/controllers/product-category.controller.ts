import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Product,
  Category,
} from '../models';
import {ProductRepository} from '../repositories';
import {authorize} from "../authorization";

export class ProductCategoryController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @authorize(['*'])
  @get('/products/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Product.prototype.id,
  ): Promise<Category> {
    return this.productRepository.category(id);
  }
}
