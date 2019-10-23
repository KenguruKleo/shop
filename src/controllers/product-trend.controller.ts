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
import {ProductTrend} from '../models';
import {ProductTrendRepository} from '../repositories';

export class ProductTrendController {
  constructor(
    @repository(ProductTrendRepository)
    public productTrendRepository : ProductTrendRepository,
  ) {}

  @post('/product-trends', {
    responses: {
      '200': {
        description: 'ProductTrend model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductTrend)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductTrend, {
            title: 'NewProductTrend',
            exclude: ['id'],
          }),
        },
      },
    })
    productTrend: Omit<ProductTrend, 'id'>,
  ): Promise<ProductTrend> {
    return this.productTrendRepository.create(productTrend);
  }

  @get('/product-trends/count', {
    responses: {
      '200': {
        description: 'ProductTrend model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ProductTrend)) where?: Where<ProductTrend>,
  ): Promise<Count> {
    return this.productTrendRepository.count(where);
  }

  @get('/product-trends', {
    responses: {
      '200': {
        description: 'Array of ProductTrend model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProductTrend)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ProductTrend)) filter?: Filter<ProductTrend>,
  ): Promise<ProductTrend[]> {
    return this.productTrendRepository.find(filter);
  }

  @patch('/product-trends', {
    responses: {
      '200': {
        description: 'ProductTrend PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductTrend, {partial: true}),
        },
      },
    })
    productTrend: ProductTrend,
    @param.query.object('where', getWhereSchemaFor(ProductTrend)) where?: Where<ProductTrend>,
  ): Promise<Count> {
    return this.productTrendRepository.updateAll(productTrend, where);
  }

  @get('/product-trends/{id}', {
    responses: {
      '200': {
        description: 'ProductTrend model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProductTrend)}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ProductTrend> {
    return this.productTrendRepository.findById(id);
  }

  @patch('/product-trends/{id}', {
    responses: {
      '204': {
        description: 'ProductTrend PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProductTrend, {partial: true}),
        },
      },
    })
    productTrend: ProductTrend,
  ): Promise<void> {
    await this.productTrendRepository.updateById(id, productTrend);
  }

  @put('/product-trends/{id}', {
    responses: {
      '204': {
        description: 'ProductTrend PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() productTrend: ProductTrend,
  ): Promise<void> {
    await this.productTrendRepository.replaceById(id, productTrend);
  }

  @del('/product-trends/{id}', {
    responses: {
      '204': {
        description: 'ProductTrend DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productTrendRepository.deleteById(id);
  }
}
