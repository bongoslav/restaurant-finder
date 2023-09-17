import { pool } from "./db";
import dotenv from 'dotenv';
dotenv.config();

const tearDown = async () => {
	if (process.env.DELETE_TEST_DB.toLowerCase() === "true") {
		console.log("Dropping test database", global.databaseName);
		await pool.query(`DROP DATABASE ${global.databaseName}`);
	}

	await pool.end();
}

export default tearDown
