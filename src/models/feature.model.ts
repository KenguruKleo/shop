import {Entity, model, property} from '@loopback/repository';

@model()
export class Feature extends Entity {
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


  constructor(data?: Partial<Feature>) {
    super(data);
  }
}

export interface FeatureRelations {
  // describe navigational properties here
}

export type FeatureWithRelations = Feature & FeatureRelations;
