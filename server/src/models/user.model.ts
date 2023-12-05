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
  Default,
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
  tokenVersion: number;
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

  @AllowNull(true)
  @Default(0)
  @Column(DataType.NUMBER)
  tokenVersion: number;

  @HasMany(() => Restaurant, { foreignKey: "ownerId" })
  restaurants: Restaurant[]

  @HasMany(() => Review, { foreignKey: "authorId" })
  reviews: Review[]
}
