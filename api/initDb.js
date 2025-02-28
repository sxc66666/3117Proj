const { Pool } = require('pg');

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test_auth',  // 修改为你的数据库名
  password: '12345',      // 修改为你的数据库密码
  port: 5432,
});

// 创建表格的 SQL 语句
const createTableQuery = `
  DROP TABLE IF EXISTS users;

  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    login_id VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    nick_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
  );
`;

// 异步执行创建表格
async function createTable() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected to database');
    await client.query(createTableQuery);
    console.log('Table created successfully!');
    client.release();
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await pool.end();  // 关闭数据库连接
  }
}

// 执行表格创建
createTable();
