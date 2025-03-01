const { Pool } = require('pg');

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'food_ordering_system',  // 修改为你的数据库名
  password: '12345',      // 修改为你的数据库密码
  port: 5432,
});

// 创建表格的 SQL 语句
const createTableQuery = `
  DROP TABLE IF EXISTS users, restaurants, foods;

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

  -- 创建餐厅表
  CREATE TABLE restaurants (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(255)
  );

  -- 插入示例数据
  INSERT INTO restaurants (name, description, image) VALUES
  ('Pizza Hut', 'Delicious pizza with various toppings', 'https://example.com/sampleImage1.jpg'),
  ('Sushi Express', 'Fresh sushi and sashimi', 'https://example.com/sampleImage2.jpg'),
  ('Burger King', 'Tasty burgers and crispy fries', 'https://example.com/sampleImage3.jpg');



  CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id),  -- 关联餐厅的外键
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255)  -- 存储图片 URL
  );
  -- 插入新的食品数据
  INSERT INTO public.foods (id, restaurant_id, name, description, price, image) VALUES
  (110, 1, 'BBQ Ribs', 'Tender ribs coated in a smoky BBQ sauce', 98, 'https://example.com/sampleImageBBQ.jpg'),
  (111, 1, 'Vegetable Stir-fry', 'A healthy mix of fresh vegetables stir-fried with soy sauce', 38, 'https://example.com/sampleImageVegStirFry.jpg'),
  (112, 1, 'Beef Burrito', 'Spicy beef wrapped in a soft tortilla with fresh salsa', 68, 'https://example.com/sampleImageBurrito.jpg'),
  (113, 1, 'Pad Thai', 'Classic Thai noodle dish with peanuts, lime, and chicken', 78, 'https://example.com/sampleImagePadThai.jpg'),
  (114, 1, 'Chicken Caesar Wrap', 'Grilled chicken, romaine lettuce, and Caesar dressing wrapped in a soft tortilla', 58, 'https://example.com/sampleImageChickenWrap.jpg'),
  (115, 1, 'Lamb Kebabs', 'Juicy lamb skewers grilled with a blend of spices', 108, 'https://example.com/sampleImageLambKebabs.jpg'),
  (116, 1, 'Fish and Chips', 'Crispy battered fish served with golden fries', 58, 'https://example.com/sampleImageFishChips.jpg'),
  (117, 1, 'Vegetable Pizza', 'A pizza topped with an assortment of fresh vegetables', 68, 'https://example.com/sampleImageVegPizza.jpg'),
  (118, 1, 'Peking Duck', 'Crispy duck served with pancakes, hoisin sauce, and spring onions', 198, 'https://example.com/sampleImagePekingDuck.jpg');


  ALTER TABLE restaurants ADD COLUMN owner_id INT REFERENCES users(id);
  
  UPDATE restaurants 
  SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor1') 
  WHERE name = 'Pizza Hut';


  UPDATE restaurants 
  SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor2') 
  WHERE name = 'Sushi Express';


  UPDATE restaurants 
  SET owner_id = (SELECT id FROM users WHERE login_id = 'vendor3') 
  WHERE name = 'Burger King';
  CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
      user_id INT REFERENCES users(id) ON DELETE SET NULL,  -- 允许订单保留，即使用户被删除
      total_price DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id) ON DELETE CASCADE,
      food_id INT REFERENCES foods(id) ON DELETE CASCADE,
      quantity INT NOT NULL
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
