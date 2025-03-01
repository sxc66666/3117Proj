const { Pool } = require('pg');

// 使用 PostgreSQL 数据库连接池
const pool = new Pool({
  user: 'postgres',          // PostgreSQL 默认用户名
  host: 'localhost',         // 数据库主机
  database: 'food_ordering_system', // 你的数据库名称
  password: '12345',         // PostgreSQL 默认密码
  port: 5432,                // PostgreSQL 默认端口
});

module.exports = pool;
