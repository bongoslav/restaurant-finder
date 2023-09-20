import { pool } from "./db";
import dotenv from 'dotenv';
dotenv.config();

const tearDown = async () => {
	if (process.env.DELETE_TEST_DB.toLowerCase() === "true") {
		console.log("Dropping test database", process.env.DB_NAME);
		// :/ forcing only for the tests
		await pool.query(`DROP DATABASE ${process.env.DB_NAME} WITH (FORCE)`);
	}

	await pool.end();
}

export default tearDown
