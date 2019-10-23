import {DefaultCrudRepository} from '@loopback/repository';
import {ProductCategory, ProductCategoryRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductCategoryRepository extends DefaultCrudRepository<
  ProductCategory,
  typeof ProductCategory.prototype.id,
  ProductCategoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductCategory, dataSource);
  }
}
