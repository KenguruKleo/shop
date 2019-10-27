import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ProductItemModification, ProductItemModificationRelations, ProductItem} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductItemRepository} from './product-item.repository';

export class ProductItemModificationRepository extends DefaultCrudRepository<
  ProductItemModification,
  typeof ProductItemModification.prototype.id,
  ProductItemModificationRelations
> {

  public readonly productItem: BelongsToAccessor<ProductItem, typeof ProductItemModification.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProductItemRepository') protected productItemRepositoryGetter: Getter<ProductItemRepository>,
  ) {
    super(ProductItemModification, dataSource);
    this.productItem = this.createBelongsToAccessorFor('productItem', productItemRepositoryGetter,);
    this.registerInclusionResolver('productItem', this.productItem.inclusionResolver);
  }
}
