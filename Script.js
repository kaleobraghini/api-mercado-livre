const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'price_monitor'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');

  connection.query("CREATE DATABASE IF NOT EXISTS price_monitor", (err) => {
    if (err) throw err;
    console.log("Banco de dados criado ou já existente.");
  });

  const createTables = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      platform ENUM('Amazon', 'Mercado Livre', 'Shopee') NOT NULL,
      product_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL,
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_watchlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      desired_price DECIMAL(10,2) NOT NULL,
      notify BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tracking_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      tracking_code VARCHAR(50) UNIQUE NOT NULL,
      carrier VARCHAR(50) NOT NULL,
      status TEXT NOT NULL,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tracking_updates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      status TEXT NOT NULL,
      location TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES tracking_orders(id) ON DELETE CASCADE
    );
  `;

  connection.query(createTables, (err) => {
    if (err) throw err;
    console.log("Tabelas criadas ou já existentes.");
    connection.end();
  });
});