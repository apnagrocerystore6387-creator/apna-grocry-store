CREATE DATABASE IF NOT EXISTS ags_grocery_store;
USE ags_grocery_store;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  phone VARCHAR(25) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(100) NULL,
  description TEXT NULL,
  purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  mrp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  gst DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  barcode VARCHAR(100) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
  image_url VARCHAR(300) NULL,
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(50) NULL,
  address TEXT NULL,
  points INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(150) NULL,
  email VARCHAR(150) NULL,
  phone VARCHAR(50) NULL,
  address TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_number VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('pending', 'packed', 'out_for_delivery', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  points_earned INT NOT NULL DEFAULT 0,
  delivery_address TEXT NULL,
  delivery_instructions TEXT NULL,
  payment_status ENUM('unpaid', 'paid', 'partial') NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT NOT NULL,
  purchase_number VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('draft', 'ordered', 'received', 'cancelled') NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  transaction_type ENUM('purchase', 'sale', 'adjustment', 'return') NOT NULL,
  quantity INT NOT NULL,
  reference VARCHAR(150) NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);

INSERT IGNORE INTO roles (name, description)
VALUES
  ('admin', 'Full access to the ERP system'),
  ('manager', 'Manage products, orders, and inventory'),
  ('staff', 'Access limited to sales and stock updates');

INSERT IGNORE INTO users (username, name, email, password, role_id)
VALUES ('ags6387', 'Store Admin', 'admin@ags.com', '$2a$10$okYfD9fOSB7hDEsMsEvQt.rWONA52MdAxcQwYOQ0iyucDVHgY2ZTO', 1);

INSERT IGNORE INTO product_categories (name, description)
VALUES ('Produce', 'Fresh fruits and vegetables'), ('Dairy', 'Milk, cheese, and eggs'), ('Pantry', 'Dry goods, canned goods, and staples');

INSERT IGNORE INTO products (category_id, sku, name, description, price, cost_price, stock, reorder_level)
VALUES
  (1, 'PRD-001', 'Organic Apples', 'Fresh organic apples, sold per kg.', 3.50, 2.20, 120, 20),
  (2, 'PRD-002', 'Whole Milk', '1 liter whole milk in a sealed carton.', 1.25, 0.80, 80, 15),
  (3, 'PRD-003', 'Rice 5kg', 'Premium long-grain rice bag.', 7.99, 5.50, 40, 10);
