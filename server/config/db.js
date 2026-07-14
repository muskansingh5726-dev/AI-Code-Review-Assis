import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ai_code_review",
    password: "muski420",
    port: 5432,
});

export default pool;