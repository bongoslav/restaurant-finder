import { Pool } from "pg";

export const databaseName = "test_" + Date.now()
process.env.DB_NAME = databaseName

export const pool = new Pool({
  // always the default created db is "postgres"
  // using it to create a test db
  database: "postgres",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
});
