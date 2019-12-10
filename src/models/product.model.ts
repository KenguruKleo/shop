import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Category, CategoryWithRelations} from './category.model';
import {Feature, FeatureWithRelations} from "./feature.model";

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  @belongsTo(() => Category)
  categoryId?: number;

  @property({
    type: 'array',
    itemType: 'number',
  })
  featureIds?: Array<number>;

  @hasMany(() => Feature, {name: 'features'})
  features?: Feature[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  categories?: CategoryWithRelations;
  //features?: FeatureWithRelations[];
}

export type ProductWithRelations = Product & ProductRelations;
