import {v1 as uuid} from 'uuid';
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
import {Product} from '../models';
import {ProductRepository} from '../repositories';
import {authorize, PermissionKey} from "../authorization";
import {authenticate} from "@loopback/authentication";

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository : ProductRepository,
  ) {}

  @authenticate('jwt')
  @authorize([PermissionKey.ManageProducts])
  @post('/products', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
          }),
        },
      },
    })
    product: Product,
  ): Promise<Product> {
    return this.productRepository.create({
      ...product,
      id: product.id || uuid()
    });
  }

  @authorize(['*'])
  @get('/products/count', {
    responses: {
      '200': {
        description: 'Product model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.count(where);
  }

  @authorize(['*'])
  @get('/products', {
    responses: {
      '200': {
        description: 'Array of Product model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Product)) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageProducts])
  @patch('/products', {
    responses: {
      '200': {
        description: 'Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @authorize(['*'])
  @get('/products/{id}', {
    responses: {
      '200': {
        description: 'Product model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Product> {
    return this.productRepository.findById(id);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageProducts])
  @patch('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageProducts])
  @put('/products/{id}', {
    responses: {
      '204': {
        description: 'Product PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @authenticate('jwt')
  @authorize([PermissionKey.ManageProducts])
  @del('/products/{id}', {
    responses: {
      '204': {
        description: 'Product DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }
}
