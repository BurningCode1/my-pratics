import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  response.status(200).json({
    updated_at: updatedAt,
    dependencias: {
      database: {
        version: databaseVersionValue,
      },
    },
  });
}
