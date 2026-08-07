const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const runSeed = async () => {
  console.log('[Seed Script] Connecting to MySQL server...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    const sqlPath = path.join(__dirname, '../../database/schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log(`[Seed Script] Executing schema.sql script from ${sqlPath}...`);
    await connection.query(sqlContent);
    console.log('[Seed Script] Database successfully created and seeded!');
  } catch (error) {
    console.error('[Seed Script Error]', error);
  } finally {
    await connection.end();
  }
};

runSeed();
