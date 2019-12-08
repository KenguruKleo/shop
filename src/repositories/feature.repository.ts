import {DefaultCrudRepository} from '@loopback/repository';
import {Feature, FeatureRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class FeatureRepository extends DefaultCrudRepository<
  Feature,
  typeof Feature.prototype.id,
  FeatureRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Feature, dataSource);
  }
}
