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
} from 'sequelize-typescript';
import Review from './review.model';

export interface IRestaurant {
  id?: number;
  name: string;
  location: string;
  price_range: number;
  photos: string[];
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
  @Column(DataType.ARRAY(DataType.STRING))
  declare photos: string[];

  @HasMany(() => Review, "restaurant_id")
  declare Reviews: Review[];

  @BeforeValidate
  static setDefaultPhotos(instance: Restaurant): void {
    if (!instance.photos) {
      instance.photos = [
        'https://res.cloudinary.com/dq2l8rm9k/image/upload/v1694446356/hoytjqnw7kqdzqmr794o.png'
      ]
    }
  }
}

