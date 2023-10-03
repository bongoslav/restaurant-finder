import { Sequelize } from 'sequelize-typescript';
import Restaurant from '../../models/restaurant.model';
import Review from '../../models/review.model';
import User from '../../models/user.model';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: true,
  }
});

sequelize.addModels([
  Restaurant,
  Review,
  User
])

export default sequelize;
