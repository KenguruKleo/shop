import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  InclusionResolver,
  Entity,
  Inclusion,
  Filter
} from '@loopback/repository';
import {
  Product,
  ProductRelations,
  Category,
  Feature,
  FeatureRelations,
  FeatureWithRelations,
  CategoryRelations
} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';
import {FeatureRepository} from "./feature.repository";

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Product.prototype.id>;
  public readonly featuresInclusionResolver: InclusionResolver<Product, FeatureWithRelations>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('FeatureRepository') protected featureRepositoryGetter: Getter<FeatureRepository>,
  ) {
    super(Product, dataSource);

    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter);
    this.registerInclusionResolver('category', this.category.inclusionResolver);

    // @ts-ignore
    this.featuresInclusionResolver = async function featuresInclusionResolver<Product, Feature>(
        entities: Product[],
        inclusion: Inclusion,
    ): Promise<(FeatureWithRelations | undefined)[][]> {
      const featureRepo = await featureRepositoryGetter();
      const feature = await featureRepo.findById(1);
      return [[feature], [feature], [feature]];
    };
    this.registerInclusionResolver('features', this.featuresInclusionResolver);
  }


  async find(filter?: Filter<Product>, options?: {}): Promise<(Product & ProductRelations)[]> {
    const res = await super.find(filter, options);
    console.log(res);
    return res;
  }
}
