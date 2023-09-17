import { databaseName, pool } from "./db";
import sequelize from "../util/db/sequelize";
import { Umzug, SequelizeStorage } from "umzug";

// reuse the name across all test db config files
global.databaseName = databaseName;

const setUp = async () => {
	let sameDBQuery = { rows: [] }

	sameDBQuery = await pool.query(
		// https://www.postgresql.org/docs/8.4/manage-ag-overview.html
		`SELECT datname FROM pg_database WHERE datname='${databaseName}'`
	);

	if (sameDBQuery.rows.length === 0) {
		console.log("Making new test database called", databaseName);
		await pool.query(`CREATE DATABASE "${databaseName}"`);
	}

	// apply all current migrations
	const umzug = new Umzug({
		migrations: {
			glob: ["../migrations/*.js", { cwd: __dirname }],
			resolve: ({ name, path, context }) => {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const migration = require(path);
				return {
					name,
					up: async () => migration.up(context, sequelize.Sequelize),
					down: async () => migration.down(context, sequelize.Sequelize),
				};
			},
		},
		context: sequelize.getQueryInterface(),
		storage: new SequelizeStorage({ sequelize: sequelize }),
		logger: undefined,
	});

	await umzug.up();

	// need to close the connection bc
	// INSERT query is still being executed in "SequelizeMeta"
	// although all migrations have been applied
	await sequelize.close()
}

export default setUp
