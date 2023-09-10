import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Max,
  Min,
  Table,
  Model,
} from 'sequelize-typescript';
import Review from './review.model';

export interface IRestaurant {
  id?: number;
  name: string;
  location: string;
  price_range: number;
  cover_photo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'restaurants' })
export default class Restaurant extends Model<IRestaurant> implements IRestaurant {
  declare id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string

  @AllowNull(false)
  @Column(DataType.STRING)
  declare location: string

  @AllowNull(false)
  @Min(1)
  @Max(5)
  @Column(DataType.INTEGER)
  declare price_range: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare cover_photo: string;

  @HasMany(() => Review, "restaurant_id")
  declare Reviews: Review[];
}

