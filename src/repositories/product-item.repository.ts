import {DefaultCrudRepository} from '@loopback/repository';
import {ProductItem, ProductItemRelations} from '../models';
import {DatabaseDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductItemRepository extends DefaultCrudRepository<
  ProductItem,
  typeof ProductItem.prototype.id,
  ProductItemRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(ProductItem, dataSource);
  }
}
