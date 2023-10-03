import {
  AllowNull,
  Column,
  DataType,
  HasMany,
  Max,
  Min,
  Table,
  Model,
  BeforeValidate,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import Review from './review.model';
import User from './user.model';

export interface IRestaurant {
  id?: number;
  name: string;
  location: string;
  priceRange: number;
  photos: string[];
  ownerId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'restaurants' })
export default class Restaurant extends Model<IRestaurant> implements IRestaurant {
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string

  @AllowNull(false)
  @Column(DataType.STRING)
  location: string

  @AllowNull(false)
  @Min(1)
  @Max(5)
  @Column(DataType.INTEGER)
  priceRange: number;

  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING))
  photos: string[];

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  ownerId: number;

  @HasMany(() => Review, { foreignKey: "restaurantId" })
  Reviews: Review[];

  @BelongsTo(() => User, { foreignKey: "ownerId" })
  User: User;

  @BeforeValidate
  static setDefaultPhotos(instance: Restaurant): void {
    if (!instance.photos) {
      instance.photos = [
        'https://res.cloudinary.com/dq2l8rm9k/image/upload/v1694446356/hoytjqnw7kqdzqmr794o.png'
      ]
    }
  }
}

