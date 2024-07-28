import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseName = process.env.POSTGRES_DB;

  const databaseMaxConectionResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConectionValue =
    databaseMaxConectionResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1 ;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencias: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConectionValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
