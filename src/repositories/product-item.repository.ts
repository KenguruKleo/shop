import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {ProductItem, ProductItemRelations, ProductCategory, ProductTrend} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductCategoryRepository} from './product-category.repository';
import {ProductTrendRepository} from './product-trend.repository';

export class ProductItemRepository extends DefaultCrudRepository<
  ProductItem,
  typeof ProductItem.prototype.id,
  ProductItemRelations
> {

  public readonly productCategory: BelongsToAccessor<ProductCategory, typeof ProductItem.prototype.id>;

  public readonly productTrend: BelongsToAccessor<ProductTrend, typeof ProductItem.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductCategoryRepository') protected productCategoryRepositoryGetter: Getter<ProductCategoryRepository>,
    @repository.getter('ProductTrendRepository') protected productTrendRepositoryGetter: Getter<ProductTrendRepository>,
  ) {
    super(ProductItem, dataSource);
    this.productTrend = this.createBelongsToAccessorFor('productTrend', productTrendRepositoryGetter,);
    this.productCategory = this.createBelongsToAccessorFor('productCategory', productCategoryRepositoryGetter,);

    this.registerInclusionResolver('productCategory', this.productCategory.inclusionResolver);
    this.registerInclusionResolver('productTrend', this.productTrend.inclusionResolver);
  }
}
