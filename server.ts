import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sneak_on_ears',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then(async (conn) => {
    console.log('Successfully connected to MySQL database.');
    conn.release();
    
    // Initialize articles table
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS articles (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          image LONGTEXT NOT NULL,
          category VARCHAR(100) NOT NULL DEFAULT 'Basketball',
          author VARCHAR(100) NOT NULL DEFAULT 'Sneak On Ears',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      const [rows]: any = await pool.query('SELECT COUNT(*) as count FROM articles');
      if (rows[0].count === 0) {
        await pool.query(`
          INSERT INTO articles (title, content, image, category, author) VALUES 
          ('Rise of the Brutalist Courts: Outdoor Streetball Culture', 
           'Outdoor streetball courts around the world are undergoing an aesthetic revolution. From the stark asphalt of New York City to the vibrant color-blocked courts in Paris, basketball environments are shaping fashion, shoe designs, and community bonding. We explore the architectural shift towards heavy concrete design, bold lines, and raw materials that define the modern outdoor player\\'s playground. Brutalist layouts don\\'t just offer a place to shoot; they make a statement about design resilience, combining bright geometric lines with rugged raw textures.', 
           '/src/assets/4.png', 'Culture', 'Marcus Court'),
          ('The Psychology of Sneaker Colorways on the Court', 
           'Why do mismatched shoes like the Sabrina 3 or Nike Ja 2 dominate the visual space in professional games? Psychology suggests that vibrant, contrasting colors not only boost player confidence but can also serve as visual anchors for team passing and defensive tracking. We break down the color wheel of basketball drops and what they communicate to your opponents during high-intensity matchups.', 
           '/src/assets/2.png', 'Gear Analysis', 'Coach Henderson'),
          ('High-Performance Training: Dynamic Lateral Agility for Guards', 
           'Speed is nothing without control. For guards relying on quick crossover cuts and explosive drive steps, building lateral hip mobility and ankle stability is paramount. In this piece, trainers from the Sneak Academy share a 4-week workout outline designed to improve your court reaction times and protect your joints during high-impact landings.', 
           '/src/assets/3.png', 'Training', 'Dr. Sarah Carter')
        `);
        console.log('Seeded default articles successfully.');
      }
    } catch (err: any) {
      console.error('Error initializing articles database table:', err.message);
    }
  })
  .catch((err) => {
    console.error('Error connecting to MySQL database:', err.message);
  });

// Safe JSON parser helper for MySQL JSON columns
const parseJsonColumn = (colVal: any): any[] => {
  if (!colVal) return [];
  if (typeof colVal === 'string') {
    try {
      return JSON.parse(colVal);
    } catch {
      return [];
    }
  }
  return colVal;
};

// 1. Get Sneakers Catalog
app.get('/api/sneakers', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM sneakers');
    const sneakers = rows.map((row: any) => ({
      ...row,
      sizes: parseJsonColumn(row.sizes),
      gallery: parseJsonColumn(row.gallery),
    }));
    res.json(sneakers);
  } catch (error: any) {
    console.error('Error getting sneakers:', error);
    res.status(500).json({ error: error.message });
  }
});

// 1b. Create New Sneaker (Admin only)
app.post('/api/sneakers', async (req, res) => {
  const { id, name, price, description, image, badge, color, sizes, gallery } = req.body;
  if (!id || !name || !price || !description || !image || !color || !sizes || !gallery) {
    return res.status(400).json({ error: 'All fields (id, name, price, description, image, color, sizes, gallery) are required.' });
  }

  try {
    const [existing]: any = await pool.query('SELECT id FROM sneakers WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Sneaker ID already exists.' });
    }

    await pool.query(
      'INSERT INTO sneakers (id, name, price, description, image, badge, color, sizes, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id.trim().toLowerCase(),
        name.trim(),
        parseInt(price),
        description.trim(),
        image.trim(),
        badge ? badge.trim() : null,
        color.trim(),
        JSON.stringify(sizes),
        JSON.stringify(gallery)
      ]
    );

    res.status(210).json({ success: true });
  } catch (error: any) {
    console.error('Error creating sneaker:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Authentication: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  console.log(`[AUTH] Login attempt for email: "${email}" -> Normalized: "${cleanEmail}"`);

  try {
    const [rows]: any = await pool.query(
      'SELECT id, email, username, role FROM users WHERE email = ? AND password = ?',
      [cleanEmail, password]
    );

    if (rows.length === 0) {
      console.warn(`[AUTH] Login failed for email: "${cleanEmail}" (invalid credentials)`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`[AUTH] Login success for email: "${cleanEmail}" (User ID: ${rows[0].id}, Role: ${rows[0].role})`);
    res.json({ user: rows[0] });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Authentication: Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();
  console.log(`[AUTH] Signup attempt for email: "${email}" -> Normalized: "${cleanEmail}", Username: "${cleanUsername}"`);

  try {
    // Check if email already exists
    const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      console.warn(`[AUTH] Signup failed: Email "${cleanEmail}" is already registered`);
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Insert user
    const [result]: any = await pool.query(
      'INSERT INTO users (email, password, username, role) VALUES (?, ?, ?, ?)',
      [cleanEmail, password, cleanUsername, 'customer']
    );

    console.log(`[AUTH] Signup success for email: "${cleanEmail}" (Created User ID: ${result.insertId})`);

    res.status(210).json({
      user: {
        id: result.insertId,
        email: cleanEmail,
        username: cleanUsername,
        role: 'customer',
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Get User Profile
app.get('/api/profile', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId parameter is required' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT id, email, username, role, calories_burned, play_time_hours, shipping_address_name, shipping_address_detail, payment_method_visa FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Update User Profile (e.g. name, address, stats)
app.put('/api/profile', async (req, res) => {
  const { userId, username, calories_burned, play_time_hours, shipping_address_name, shipping_address_detail, payment_method_visa } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    await pool.query(
      `UPDATE users SET 
        username = COALESCE(?, username),
        calories_burned = COALESCE(?, calories_burned),
        play_time_hours = COALESCE(?, play_time_hours),
        shipping_address_name = COALESCE(?, shipping_address_name),
        shipping_address_detail = COALESCE(?, shipping_address_detail),
        payment_method_visa = COALESCE(?, payment_method_visa)
      WHERE id = ?`,
      [username, calories_burned, play_time_hours, shipping_address_name, shipping_address_detail, payment_method_visa, userId]
    );

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Get Saved Pairs
app.get('/api/saved', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT s.* FROM sneakers s 
       JOIN saved_pairs sp ON s.id = sp.sneaker_id 
       WHERE sp.user_id = ?`,
      [userId]
    );

    const sneakers = rows.map((row: any) => ({
      ...row,
      sizes: parseJsonColumn(row.sizes),
      gallery: parseJsonColumn(row.gallery),
    }));

    res.json(sneakers);
  } catch (error: any) {
    console.error('Error getting saved pairs:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. Toggle Saved Pair
app.post('/api/saved', async (req, res) => {
  const { userId, sneakerId } = req.body;
  if (!userId || !sneakerId) {
    return res.status(400).json({ error: 'userId and sneakerId are required' });
  }

  try {
    const [existing]: any = await pool.query(
      'SELECT 1 FROM saved_pairs WHERE user_id = ? AND sneaker_id = ?',
      [userId, sneakerId]
    );

    let saved = false;
    if (existing.length > 0) {
      await pool.query(
        'DELETE FROM saved_pairs WHERE user_id = ? AND sneaker_id = ?',
        [userId, sneakerId]
      );
    } else {
      await pool.query(
        'INSERT INTO saved_pairs (user_id, sneaker_id) VALUES (?, ?)',
        [userId, sneakerId]
      );
      saved = true;
    }

    res.json({ saved });
  } catch (error: any) {
    console.error('Error toggling saved pair:', error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Get Cart Items
app.get('/api/cart', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const [rows]: any = await pool.query(
      `SELECT c.size, c.quantity, s.* FROM cart_items c 
       JOIN sneakers s ON c.sneaker_id = s.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    const cart = rows.map((row: any) => ({
      sneaker: {
        id: row.id,
        name: row.name,
        price: row.price,
        description: row.description,
        image: row.image,
        badge: row.badge,
        color: row.color,
        sizes: parseJsonColumn(row.sizes),
        gallery: parseJsonColumn(row.gallery),
      },
      size: row.size,
      quantity: row.quantity,
      selectedColor: row.color,
    }));

    res.json(cart);
  } catch (error: any) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// 9. Sync Cart (Saves current client cart to DB)
app.post('/api/cart', async (req, res) => {
  const { userId, cart } = req.body;
  if (!userId || !Array.isArray(cart)) {
    return res.status(400).json({ error: 'userId and cart array are required' });
  }

  try {
    // Start transaction for atomic operations
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Delete existing items
      await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      // 2. Insert current items
      if (cart.length > 0) {
        const insertPromises = cart.map((item: any) => {
          return connection.query(
            'INSERT INTO cart_items (user_id, sneaker_id, size, quantity) VALUES (?, ?, ?, ?)',
            [userId, item.sneaker.id, item.size, item.quantity]
          );
        });
        await Promise.all(insertPromises);
      }

      await connection.commit();
      res.json({ success: true });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// 1c. Delete Sneaker (Admin only)
app.delete('/api/sneakers/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Sneaker ID is required.' });
  }

  try {
    const [result]: any = await pool.query('DELETE FROM sneakers WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sneaker not found.' });
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting sneaker:', error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [[sneakersCount]]: any = await pool.query('SELECT COUNT(*) as count FROM sneakers');
    const [[usersCount]]: any = await pool.query('SELECT COUNT(*) as count FROM users');
    const [[cartItemsCount]]: any = await pool.query('SELECT SUM(quantity) as count FROM cart_items');
    const [[savedPairsCount]]: any = await pool.query('SELECT COUNT(*) as count FROM saved_pairs');
    const [[articlesCount]]: any = await pool.query('SELECT COUNT(*) as count FROM articles');

    res.json({
      sneakers: sneakersCount?.count || 0,
      users: usersCount?.count || 0,
      cartItems: cartItemsCount?.count || 0,
      savedPairs: savedPairsCount?.count || 0,
      articles: articlesCount?.count || 0,
    });
  } catch (error: any) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// 11. Admin Users list
app.get('/api/admin/users', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT id, email, username, role FROM users');
    res.json(rows);
  } catch (error: any) {
    console.error('Error getting admin users:', error);
    res.status(500).json({ error: error.message });
  }
});

// 12. Get All Articles
app.get('/api/articles', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json(rows);
  } catch (error: any) {
    console.error('Error getting articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// 13. Get Single Article Details
app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    res.json(rows[0]);
  } catch (error: any) {
    console.error('Error getting article details:', error);
    res.status(500).json({ error: error.message });
  }
});

// 14. Create New Article (Admin only)
app.post('/api/articles', async (req, res) => {
  const { title, content, image, category, author } = req.body;
  if (!title || !content || !image) {
    return res.status(400).json({ error: 'Title, content, and cover image path are required.' });
  }

  try {
    await pool.query(
      'INSERT INTO articles (title, content, image, category, author) VALUES (?, ?, ?, ?, ?)',
      [
        title.trim(),
        content.trim(),
        image.trim(),
        category ? category.trim() : 'Basketball',
        author ? author.trim() : 'Sneak On Ears'
      ]
    );
    res.status(210).json({ success: true });
  } catch (error: any) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 15. Delete Article (Admin only)
app.delete('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: error.message });
  }
});

// 16. Create Midtrans Transaction Snap Token & Persist Order
app.post('/api/payment/checkout', async (req, res) => {
  const { userId, totalAmount } = req.body;
  if (!userId || !totalAmount) {
    return res.status(400).json({ error: 'userId and totalAmount are required.' });
  }

  try {
    // Fetch user details to pass to Midtrans and to record shipping info
    const [userRows]: any = await pool.query(
      'SELECT username, email, shipping_address_name, shipping_address_detail FROM users WHERE id = ?', 
      [userId]
    );
    const user = userRows[0] || { 
      username: 'Customer', 
      email: '',
      shipping_address_name: '',
      shipping_address_detail: ''
    };

    // Fetch current user cart items to persist in order_items
    const [cartRows]: any = await pool.query(
      `SELECT c.size, c.quantity, s.id as sneaker_id, s.name as sneaker_name, s.price FROM cart_items c 
       JOIN sneakers s ON c.sneaker_id = s.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartRows.length === 0) {
      return res.status(400).json({ error: 'Cannot checkout with an empty cart.' });
    }

    const orderId = `SNEAK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Begin database transaction to log order securely
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
      await connection.query(
        `INSERT INTO orders (id, user_id, total_amount, shipping_name, shipping_detail, status) 
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          orderId,
          userId,
          Math.round(totalAmount),
          user.shipping_address_name || user.username || 'Customer',
          user.shipping_address_detail || 'No shipping address provided'
        ]
      );

      for (const item of cartRows) {
        await connection.query(
          `INSERT INTO order_items (order_id, sneaker_id, sneaker_name, price, size, quantity) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.sneaker_id,
            item.sneaker_name,
            item.price,
            item.size,
            item.quantity
          ]
        );
      }

      await connection.commit();
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    
    // Check if Server Key is a placeholder or empty
    const isMock = !serverKey || serverKey.includes('placeholder') || serverKey.trim() === '';

    if (isMock) {
      // Return a mock token for frontend simulation
      return res.json({
        token: `MOCK-SNAP-${orderId}`,
        redirect_url: '#mock-payment',
        isMock: true,
        orderId
      });
    }

    // Call real Midtrans Sandbox API
    const authString = Buffer.from(`${serverKey}:`).toString('base64');
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: Math.round(totalAmount)
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: user.username,
          email: user.email
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Midtrans API response error, falling back to mock payment:', errorData);
      return res.json({
        token: `MOCK-SNAP-${orderId}`,
        redirect_url: '#mock-payment',
        isMock: true,
        orderId
      });
    }

    const snapData = await response.json();
    res.json({
      token: snapData.token,
      redirect_url: snapData.redirect_url,
      isMock: false,
      orderId
    });
  } catch (error: any) {
    console.error('Error creating checkout transaction:', error);
    // Graceful fallback to mock payment instead of crashing
    const orderId = `SNEAK-ERR-${Date.now()}`;
    res.json({
      token: `MOCK-SNAP-${orderId}`,
      redirect_url: '#mock-payment',
      isMock: true,
      orderId
    });
  }
});

// 17. Confirm Payment Success (Mark Paid & Clear Cart)
app.post('/api/payment/success', async (req, res) => {
  const { orderId, userId } = req.body;
  if (!orderId || !userId) {
    return res.status(400).json({ error: 'orderId and userId are required.' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Update order status to paid
      await connection.query(
        "UPDATE orders SET status = 'paid' WHERE id = ?",
        [orderId]
      );

      // 2. Clear user cart
      await connection.query(
        "DELETE FROM cart_items WHERE user_id = ?",
        [userId]
      );

      await connection.commit();
      res.json({ success: true });
    } catch (txErr) {
      await connection.rollback();
      throw txErr;
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Error confirming payment success:', error);
    res.status(500).json({ error: error.message });
  }
});

// 18. Get User Order History
app.get('/api/profile/orders', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required.' });
  }

  try {
    const [orders]: any = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o: any) => o.id);
    const [items]: any = await pool.query(
      `SELECT oi.*, s.image FROM order_items oi 
       LEFT JOIN sneakers s ON oi.sneaker_id = s.id 
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: items.filter((item: any) => item.order_id === order.id)
    }));

    res.json(ordersWithItems);
  } catch (error: any) {
    console.error('Error fetching profile orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// 19. Get Admin Orders List (All transactions)
app.get('/api/admin/orders', async (req, res) => {
  try {
    const [orders]: any = await pool.query(
      `SELECT o.*, u.username, u.email FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map((o: any) => o.id);
    const [items]: any = await pool.query(
      `SELECT oi.*, s.image FROM order_items oi 
       LEFT JOIN sneakers s ON oi.sneaker_id = s.id 
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: items.filter((item: any) => item.order_id === order.id)
    }));

    res.json(ordersWithItems);
  } catch (error: any) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// 20. Update Order Status (Admin only)
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

// 21. Delete Order (Admin only)
app.delete('/api/admin/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query(
      'DELETE FROM orders WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

// 22. Update User Role (Admin only)
app.put('/api/admin/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role || (role !== 'admin' && role !== 'customer')) {
    return res.status(400).json({ error: 'Valid role (admin/customer) is required.' });
  }

  try {
    const [result]: any = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: error.message });
  }
});

// 23. Delete User (Admin only)
app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
