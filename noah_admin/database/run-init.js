const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function runInit() {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
        await client.query(sql);
        console.log('Database tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runInit();
