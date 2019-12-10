import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  BelongsToAccessor,
} from '@loopback/repository';
import {Category, CategoryRelations, Product} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ProductRepository} from './product.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly parent: BelongsToAccessor<Category, typeof Category.prototype.id>;
  public readonly categories: HasManyRepositoryFactory<Category, typeof Category.prototype.id>;
  public readonly products: HasManyRepositoryFactory<Product, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Category, dataSource);

    this.categories = this.createHasManyRepositoryFactoryFor('categories', Getter.fromValue(this));
    this.registerInclusionResolver('categories', this.categories.inclusionResolver);

    this.parent = this.createBelongsToAccessorFor('parent', Getter.fromValue(this)); // for recursive relationship
    this.registerInclusionResolver('parent', this.parent.inclusionResolver);

    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
