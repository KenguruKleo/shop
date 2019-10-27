import {Entity, model, property, belongsTo} from '@loopback/repository';
import {ProductItem} from './product-item.model';

@model()
export class ProductItemModification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
  })
  codeCatalog?: string;

  @belongsTo(() => ProductItem)
  productItemId: number;

  constructor(data?: Partial<ProductItemModification>) {
    super(data);
  }
}

export interface ProductItemModificationRelations {
  // describe navigational properties here
}

export type ProductItemModificationWithRelations = ProductItemModification & ProductItemModificationRelations;
