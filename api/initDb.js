const { Pool } = require("pg");

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "food_ordering_system", // 修改为你的数据库名
  password: "12345", // 修改为你的数据库密码
  port: 5432,
});

// 创建表格的 SQL 语句
const createTableQuery = `
  -- 删除表（按外键依赖顺序）
  DROP TABLE IF EXISTS order_items CASCADE;
  DROP TABLE IF EXISTS orders CASCADE;
  DROP TABLE IF EXISTS foods CASCADE;
  DROP TABLE IF EXISTS restaurants CASCADE;
  DROP TABLE IF EXISTS users CASCADE;

  -- 创建用户表
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login_id VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- 直接存储明文密码（仅限测试）
    email VARCHAR(255) NOT NULL,
    nick_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('restaurant', 'consumer')),
    profile_image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
  );

  -- 预先插入商家用户（避免后续 UPDATE）
  INSERT INTO users (login_id, password, email, nick_name, type) VALUES
  ('vendor1', 'test1234', 'vendor1@mail.com', 'PizzaOwner', 'restaurant'),
  ('vendor2', 'test1234', 'vendor2@mail.com', 'SushiOwner', 'restaurant'),
  ('vendor3', 'test1234', 'vendor3@mail.com', 'BurgerOwner', 'restaurant');

  -- 创建餐厅表（直接关联 owner_id）
  CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    owner_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL -- 直接绑定商家用户
  );

  -- 预先插入餐厅数据，并正确绑定 owner_id
  INSERT INTO restaurants (name, description, image, owner_id) VALUES
  ('Pizza Hut', 'Delicious pizza with various toppings', 'https://example.com/sampleImage1.jpg',
   (SELECT id FROM users WHERE login_id = 'vendor1')),
  ('Sushi Express', 'Fresh sushi and sashimi', 'https://example.com/sampleImage2.jpg',
   (SELECT id FROM users WHERE login_id = 'vendor2')),
  ('Burger King', 'Tasty burgers and crispy fries', 'https://example.com/sampleImage3.jpg',
   (SELECT id FROM users WHERE login_id = 'vendor3'));

  -- 创建食物表（绑定餐厅）
  CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL, -- 删除餐厅时删除食物
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0), -- 价格不能小于 0
    image VARCHAR(255)
  );

  -- 预先插入食品数据
  INSERT INTO foods (restaurant_id, name, description, price, image) VALUES
  ((SELECT id FROM restaurants WHERE name = 'Pizza Hut'), 'BBQ Ribs', 'Tender ribs coated in a smoky BBQ sauce', 98, 'https://example.com/sampleImageBBQ.jpg'),
  ((SELECT id FROM restaurants WHERE name = 'Pizza Hut'), 'Vegetable Pizza', 'A pizza topped with fresh vegetables', 68, 'https://example.com/sampleImageVegPizza.jpg'),
  ((SELECT id FROM restaurants WHERE name = 'Sushi Express'), 'Salmon Sushi', 'Fresh salmon sushi rolls', 48, 'https://example.com/sampleImageSushi.jpg'),
  ((SELECT id FROM restaurants WHERE name = 'Sushi Express'), 'Tuna Sashimi', 'Premium tuna sashimi slices', 88, 'https://example.com/sampleImageSashimi.jpg'),
  ((SELECT id FROM restaurants WHERE name = 'Burger King'), 'Cheeseburger', 'Juicy cheeseburger with crispy fries', 58, 'https://example.com/sampleImageBurger.jpg'),
  ((SELECT id FROM restaurants WHERE name = 'Burger King'), 'Chicken Wrap', 'Grilled chicken wrap with fresh lettuce', 52, 'https://example.com/sampleImageWrap.jpg');

  -- 创建订单表
  CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL, -- 允许订单保留，即使用户被删除
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- 创建订单项表
  CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    food_id INT REFERENCES foods(id) ON DELETE CASCADE NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
  );
`;

// 执行创建表的异步函数
async function createTable() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();
    console.log("Connected to database");
    await client.query(createTableQuery);
    console.log("Table created successfully!");
    client.release();
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await pool.end(); // 关闭数据库连接
  }
}

// 执行表格创建
createTable();
