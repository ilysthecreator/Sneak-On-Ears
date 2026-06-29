-- Create the database
CREATE DATABASE IF NOT EXISTS sneak_on_ears;
USE sneak_on_ears;

-- Drop tables if they exist to allow clean re-import
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS saved_pairs;
DROP TABLE IF EXISTS sneakers;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    calories_burned INT NOT NULL DEFAULT 0,
    play_time_hours INT NOT NULL DEFAULT 0,
    shipping_address_name VARCHAR(255) DEFAULT NULL,
    shipping_address_detail VARCHAR(255) DEFAULT NULL,
    payment_method_visa VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sneakers Table
CREATE TABLE sneakers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description TEXT NOT NULL,
    image LONGTEXT NOT NULL,
    badge VARCHAR(255) DEFAULT NULL,
    color VARCHAR(255) NOT NULL,
    sizes JSON NOT NULL, -- Stored as a JSON array of numbers
    gallery JSON NOT NULL -- Stored as a JSON array of image strings
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Saved Pairs Table (Many-to-Many)
CREATE TABLE saved_pairs (
    user_id INT NOT NULL,
    sneaker_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, sneaker_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_sneaker FOREIGN KEY (sneaker_id) REFERENCES sneakers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Cart Items Table
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sneaker_id VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_cart_sneaker FOREIGN KEY (sneaker_id) REFERENCES sneakers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Articles Table
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image LONGTEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Basketball',
    author VARCHAR(100) NOT NULL DEFAULT 'Sneak On Ears',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Orders Table
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount INT NOT NULL,
    shipping_name VARCHAR(255) NOT NULL,
    shipping_detail VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Order Items Table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    sneaker_id VARCHAR(255),
    sneaker_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    size INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_sneaker FOREIGN KEY (sneaker_id) REFERENCES sneakers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data: Default Admin User
INSERT INTO users (email, password, username, role, calories_burned, play_time_hours, shipping_address_name, shipping_address_detail, payment_method_visa)
VALUES (
    'admin@sneak.com',
    'admin123',
    'Admin Chief',
    'admin',
    0,
    0,
    'Admin Head',
    'Admin HQ, Sneak Room 1',
    'Visa ending in 9999'
);

-- Seed Data: Sneakers
INSERT INTO sneakers (id, name, price, description, image, badge, color, sizes, gallery)
VALUES (
    'air-flight-x',
    'GIANNIS IMMORTALITY 4',
    3300000,
    'Built for the asphalt. Engineered for the air. The Giannis Immortality 4 combines brutalist design logic with premium streetwear materials for uncompromising court performance and unmatched response.',
    '/src/assets/giannis-immortality-white.png',
    'NEW DROP',
    'Summit White',
    '[7, 8, 9, 10, 11, 12]',
    '["/src/assets/giannis-immortality-white.png", "https://lh3.googleusercontent.com/aida-public/AB6AXuArDV_V1tgULAmlXObs30QiY7Oj1Q_SnnlkY91JJp5yHM5KFWLe461Xz0FcRrfQVjKKfDHCkAETVas89NohsOO63OjXX7HqIUBmg2X-rGUJJ_sNihtJFMJJj3pohITafQcW8_zPscLMWAWg1ppCLtFGKS3gHekBcgB__7tkz4NFT3oHRwXITB9VsmQHnsojcaRkyAxDgGRgNijB2sHjkzDRHOYkpXt7ckC5C-mcVLJt1FDnBHiobrssvQisqHu5SYaI4VqbYRNCTY0", "https://lh3.googleusercontent.com/aida-public/AB6AXuAg8ciBPk8dMTwlKXcgQilqvtCuldGi9Bd0oBaQ3nweaeAg2zOTZf08E0QyqImpPPmHPwEG8Z9s1Msl_Q-f_BU8KbFC02GM5lwnOpK8jUB-6eiZkwwdeyC_CWU0RE3zCFaZqff9cbh_8I4DgRxdli07Bat5t_iUvNfkRrxxaq7Kd8vuEmw3yLEROzoCrpDGnf1VpZVmcUEDeIy5zjAX8eSCn5N1iyd2dl0UO6YxatLZ5kBe_AMjmeKV7Icq5dZwgtw0LK78Vzrugqk"]'
),
(
    'giannis-freak-7',
    'GIANNIS FREAK 7 EP',
    1650000,
    'A striking performance shoe designed to amplify your court speed and quick cuts, featuring active response Zoom Air cushioning and a lightweight, breathable structured upper with neon orange accent Swooshes.',
    '/src/assets/4.png',
    'NEW',
    'Light Grey / Orange',
    '[8, 9, 9.5, 10, 11]',
    '["/src/assets/4.png"]'
),
(
    'sabrina-3-what-the',
    'SABRINA 3 \'WHAT THE?\' EP',
    2100000,
    'A spectacular mismatched dual-shoe design for elite ballers. Featuring asymmetrical color blocking, responsive lateral lockdown, and dynamic traction. Masterfully crafted to stand out on the court.',
    '/src/assets/2.png',
    'HOT',
    'Mismatched Teal / Violet',
    '[7, 8, 9, 10, 11, 12]',
    '["/src/assets/2.png"]'
),
(
    'nike-ja-2',
    'NIKE JA 2 \'MISMAPPED\'',
    3150000,
    'A striking, asymmetrical masterpiece showcasing an explosive contrast between neon yellow and bright electric pink. Features active ZoomX responsive court cushioning and premium micro-textured traction overlay.',
    '/src/assets/nike-ja3.png',
    'EXCLUSIVE',
    'Mismatched Pink / Neon',
    '[8, 9, 10, 11]',
    '["/src/assets/nike-ja3.png"]'
),
(
    'sabrina-3',
    'SABRINA 3 EP',
    1650000,
    'Dressed in a rich, warm peach and coral hue with an iconic micro-textured black Swoosh. This low-profile signature sneaker offers exceptional lateral lockdown and explosive energy return for lightning-fast guards.',
    '/src/assets/3.png',
    'EXCLUSIVE',
    'Miracle Peach / Coral',
    '[7, 8, 9, 10, 11, 12]',
    '["/src/assets/3.png"]'
);

-- Seed Data: Articles
INSERT INTO articles (title, content, image, category, author) VALUES 
('Rise of the Brutalist Courts: Outdoor Streetball Culture', 
 'Outdoor streetball courts around the world are undergoing an aesthetic revolution. From the stark asphalt of New York City to the vibrant color-blocked courts in Paris, basketball environments are shaping fashion, shoe designs, and community bonding. We explore the architectural shift towards heavy concrete design, bold lines, and raw materials that define the modern outdoor player\'s playground. Brutalist layouts don\'t just offer a place to shoot; they make a statement about design resilience, combining bright geometric lines with rugged raw textures.', 
 '/src/assets/4.png', 'Culture', 'Marcus Court'),
('The Psychology of Sneaker Colorways on the Court', 
 'Why do mismatched shoes like the Sabrina 3 or Nike Ja 2 dominate the visual space in professional games? Psychology suggests that vibrant, contrasting colors not only boost player confidence but can also serve as visual anchors for team passing and defensive tracking. We break down the color wheel of basketball drops and what they communicate to your opponents during high-intensity matchups.', 
 '/src/assets/2.png', 'Gear Analysis', 'Coach Henderson'),
('High-Performance Training: Dynamic Lateral Agility for Guards', 
 'Speed is nothing without control. For guards relying on quick crossover cuts and explosive drive steps, building lateral hip mobility and ankle stability is paramount. In this piece, trainers from the Sneak Academy share a 4-week workout outline designed to improve your court reaction times and protect your joints during high-impact landings.', 
 '/src/assets/3.png', 'Training', 'Dr. Sarah Carter');
