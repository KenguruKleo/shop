import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Category, CategoryRelations} from './category.model';

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
  categoryId: number;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  categories?: CategoryRelations;
}

export type ProductWithRelations = Product & ProductRelations;
