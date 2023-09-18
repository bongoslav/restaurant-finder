import { pool } from "./db";
import dotenv from 'dotenv';
dotenv.config();
import { databaseName } from "./db";

const tearDown = async () => {
	if (process.env.DELETE_TEST_DB.toLowerCase() === "true") {
		console.log("Dropping test database", databaseName);
		await pool.query(`DROP DATABASE ${databaseName}`);
	}

	await pool.end();
}

export default tearDown
