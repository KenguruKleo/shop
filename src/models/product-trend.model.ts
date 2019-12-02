import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class ProductTrend extends Entity {
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

  constructor(data?: Partial<ProductTrend>) {
    super(data);
  }
}

export interface ProductTrendRelations {
  // describe navigational properties here
}

export type ProductTrendWithRelations = ProductTrend & ProductTrendRelations;
