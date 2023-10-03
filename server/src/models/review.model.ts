import {
  DataType,
  AllowNull,
  Column,
  Table,
  BelongsTo,
  Model,
  ForeignKey,
} from 'sequelize-typescript';
import Restaurant from './restaurant.model';
import User from './user.model';

interface IReview {
  id?: number;
  restaurantId: number;
  name: string;
  review: string;
  rating: number;
  authorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'reviews' })
export default class Review extends Model<IReview> implements IReview {
  id: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  restaurantId: number;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  review: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  rating: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  authorId: number;

  @BelongsTo(() => Restaurant, { foreignKey: "restaurantId" })
  Restaurant: Restaurant;

  @BelongsTo(() => User, { foreignKey: "authorId" })
  User: User;
}
