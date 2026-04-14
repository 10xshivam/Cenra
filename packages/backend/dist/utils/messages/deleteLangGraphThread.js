"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLangGraphThread = deleteLangGraphThread;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.THREADS_DB_URL,
});
async function deleteLangGraphThread(threadId) {
    if (!threadId) {
        throw new Error("threadId is required to delete LangGraph thread");
    }
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
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
