import {DefaultCrudRepository} from '@loopback/repository';
import {ProductTrend, ProductTrendRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductTrendRepository extends DefaultCrudRepository<
  ProductTrend,
  typeof ProductTrend.prototype.id,
  ProductTrendRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ProductTrend, dataSource);
  }
}
