import {belongsTo, Entity, model, property, hasMany} from '@loopback/repository';
import {ProductCategory} from "./product-category.model";
import {ProductTrend} from './product-trend.model';
import {ProductItemModification} from './product-item-modification.model';

@model({settings: {strict: false}})
export class ProductItem extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
  })
  codeBar?: string;

  @property({
    type: 'string',
  })
  codeVED?: string;

  @property({
    type: 'string',
  })
  codeCatalog?: string;

  @property({
    type: 'string',
  })
  imageURL?: string;

  @belongsTo(() => ProductCategory)
  productCategoryId: number;

  @belongsTo(() => ProductTrend)
  productTrendId: number;

  @hasMany(() => ProductItemModification)
  productItemModifications: ProductItemModification[];

  constructor(data?: Partial<ProductItem>) {
    super(data);
  }
}

export interface ProductItemRelations {
  // describe navigational properties here
}

export type ProductItemWithRelations = ProductItem & ProductItemRelations;
