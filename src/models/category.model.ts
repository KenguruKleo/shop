import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Product, ProductRelations} from './product.model';

@model()
export class Category extends Entity {
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

  @hasMany(() => Category, {keyTo: 'parentId'})
  categories?: Category[];

  @belongsTo(() => Category)
  parentId?: number;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  categories?: CategoryWithRelations[];
  parent?: CategoryWithRelations;
  products?: ProductRelations[];
}

export type CategoryWithRelations = Category & CategoryRelations;
