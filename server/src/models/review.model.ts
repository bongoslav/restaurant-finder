import {
  DataType,
  AllowNull,
  Column,
  Table,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import Restaurant from './restaurant.model';

interface IReview {
  id?: number;
  restaurant_id: number;
  name: string;
  review: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'reviews' })
export default class Review extends Model<IReview> implements IReview {
  declare id: number;

  @Column(DataType.INTEGER)
  declare restaurant_id: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare review: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare rating: number;

  // Define the association with the Restaurant model
  @BelongsTo(() => Restaurant, "restaurant_id")
  declare Restaurant: Restaurant;
}
