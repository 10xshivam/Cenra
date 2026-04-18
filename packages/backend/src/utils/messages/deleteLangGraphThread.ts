import { Pool } from "pg";
import { lookup } from "node:dns/promises";

export async function deleteLangGraphThread(threadId: string) {
  if (!threadId) {
    throw new Error("threadId is required to delete LangGraph thread");
  }

  const url = new URL(process.env.THREADS_DB_URL || "");
  const { address } = await lookup(url.hostname, { family: 4 });

  const pool = new Pool({
    user: url.username,
    password: url.password,
    host: address,
    port: parseInt(url.port || "5432"),
    database: url.pathname.slice(1),
    ssl: { rejectUnauthorized: false, servername: url.hostname },
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`DELETE FROM checkpoint_writes WHERE thread_id = $1`, [
      threadId,
    ]);

    await client.query(`DELETE FROM checkpoint_blobs WHERE thread_id = $1`, [
      threadId,
    ]);

    await client.query(`DELETE FROM checkpoints WHERE thread_id = $1`, [
      threadId,
    ]);

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
