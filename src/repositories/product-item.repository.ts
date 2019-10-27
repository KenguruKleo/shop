import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {ProductItem, ProductItemRelations, ProductCategory, ProductTrend, ProductItemModification} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductCategoryRepository} from './product-category.repository';
import {ProductTrendRepository} from './product-trend.repository';
import {ProductItemModificationRepository} from './product-item-modification.repository';

export class ProductItemRepository extends DefaultCrudRepository<
  ProductItem,
  typeof ProductItem.prototype.id,
  ProductItemRelations
> {

  public readonly productCategory: BelongsToAccessor<ProductCategory, typeof ProductItem.prototype.id>;

  public readonly productTrend: BelongsToAccessor<ProductTrend, typeof ProductItem.prototype.id>;

  public readonly productItemModifications: HasManyRepositoryFactory<ProductItemModification, typeof ProductItem.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductCategoryRepository') protected productCategoryRepositoryGetter: Getter<ProductCategoryRepository>,
    @repository.getter('ProductTrendRepository') protected productTrendRepositoryGetter: Getter<ProductTrendRepository>,
    @repository.getter('ProductItemModificationRepository') protected productItemModificationRepositoryGetter: Getter<ProductItemModificationRepository>,
  ) {
    super(ProductItem, dataSource);
    this.productItemModifications = this.createHasManyRepositoryFactoryFor('productItemModifications', productItemModificationRepositoryGetter,);
    this.registerInclusionResolver('productItemModifications', this.productItemModifications.inclusionResolver);
    this.productTrend = this.createBelongsToAccessorFor('productTrend', productTrendRepositoryGetter,);
    this.registerInclusionResolver('productTrend', this.productTrend.inclusionResolver);
    this.productCategory = this.createBelongsToAccessorFor('productCategory', productCategoryRepositoryGetter,);
    this.registerInclusionResolver('productCategory', this.productCategory.inclusionResolver);
  }
}
