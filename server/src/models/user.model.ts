import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
} from 'sequelize-typescript';
import Restaurant from './restaurant.model';
import Review from './review.model';

interface IUser {
  id: number;
  email: string;
  password: string;
  username: string;
  name: string;
  restaurants: Restaurant[];
  reviews: Review[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'users' })
export default class User extends Model<IUser> implements IUser {
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  password: string

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  username: string

  @AllowNull(false)
  @Column(DataType.STRING(50))
  name: string;

  @HasMany(() => Restaurant, { foreignKey: "ownerId" })
  restaurants: Restaurant[]

  @HasMany(() => Review, { foreignKey: "authorId" })
  reviews: Review[]
}
