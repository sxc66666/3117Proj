const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// 使用 PostgreSQL 数据库连接池
const pool = new Pool({
  user: process.env.DB_USER,          // PostgreSQL 默认用户名
  host: process.env.DB_HOST,         // 数据库主机
  database: process.env.DB_DATABASE, // 你的数据库名称
  password: process.env.DB_PASSWORD,         // PostgreSQL 默认密码
  port: process.env.DB_PORT,                // PostgreSQL 默认端口
});

module.exports = pool;
