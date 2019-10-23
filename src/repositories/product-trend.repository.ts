import {DefaultCrudRepository} from '@loopback/repository';
import {ProductTrend, ProductTrendRelations} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductTrendRepository extends DefaultCrudRepository<
  ProductTrend,
  typeof ProductTrend.prototype.id,
  ProductTrendRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(ProductTrend, dataSource);
  }
}
