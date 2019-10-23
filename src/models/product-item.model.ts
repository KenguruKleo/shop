import {belongsTo, Entity, model, property} from '@loopback/repository';
import {ProductTrend} from "./product-trend.model";
import {ProductCategory} from "./product-category.model";

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

  @belongsTo(() => ProductCategory)
  categoryId?: number;

  @belongsTo(() => ProductTrend)
  trendId?: number;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
  })
  codeVED?: string;

  @property({
    type: 'string',
  })
  codeCatalog?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ProductItem>) {
    super(data);
  }
}

export interface ProductItemRelations {
  // describe navigational properties here
}

export type ProductItemWithRelations = ProductItem & ProductItemRelations;
