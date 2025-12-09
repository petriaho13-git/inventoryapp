const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create table and seed data
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        price REAL NOT NULL,
        description TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            // Check if data already exists
            db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
                if (err) {
                    console.error('Error checking data:', err.message);
                } else if (row.count === 0) {
                    seedDatabase();
                }
            });
        }
    });
}

// Seed database with 20 IT products
function seedDatabase() {
    const products = [
        { name: 'Dell XPS 13 Laptop', category: 'Computers', quantity: 15, price: 1299.99, description: '13.3" ultrabook with Intel i7 processor' },
        { name: 'MacBook Pro 14"', category: 'Computers', quantity: 8, price: 1999.99, description: 'Apple M2 Pro chip, 16GB RAM' },
        { name: 'HP EliteBook 840', category: 'Computers', quantity: 12, price: 1099.99, description: 'Business laptop with 14" display' },
        { name: 'Lenovo ThinkPad X1', category: 'Computers', quantity: 10, price: 1399.99, description: 'Premium business laptop' },
        { name: 'Dell Optiplex Desktop', category: 'Computers', quantity: 20, price: 799.99, description: 'Small form factor desktop PC' },
        { name: 'Dell UltraSharp 27" Monitor', category: 'Monitors', quantity: 25, price: 449.99, description: '4K IPS display' },
        { name: 'LG 34" Ultrawide Monitor', category: 'Monitors', quantity: 10, price: 599.99, description: 'Curved ultrawide display' },
        { name: 'Samsung 24" Monitor', category: 'Monitors', quantity: 30, price: 199.99, description: 'Full HD LED monitor' },
        { name: 'ASUS ProArt Display', category: 'Monitors', quantity: 8, price: 899.99, description: '27" professional color display' },
        { name: 'Logitech MX Master 3', category: 'Accessories', quantity: 40, price: 99.99, description: 'Wireless ergonomic mouse' },
        { name: 'Logitech MX Keys', category: 'Accessories', quantity: 35, price: 119.99, description: 'Wireless illuminated keyboard' },
        { name: 'Jabra Evolve2 Headset', category: 'Accessories', quantity: 50, price: 179.99, description: 'Professional USB headset' },
        { name: 'Anker USB-C Hub', category: 'Accessories', quantity: 60, price: 49.99, description: '7-in-1 USB hub with HDMI' },
        { name: 'Corsair Flash Drive 128GB', category: 'Accessories', quantity: 100, price: 24.99, description: 'High-speed USB 3.0 flash drive' },
        { name: 'WD 2TB External HDD', category: 'Accessories', quantity: 25, price: 79.99, description: 'Portable external hard drive' },
        { name: 'Samsung 1TB SSD', category: 'Accessories', quantity: 30, price: 139.99, description: 'Portable external SSD' },
        { name: 'Belkin Surge Protector', category: 'Accessories', quantity: 45, price: 29.99, description: '6-outlet surge protector' },
        { name: 'HP LaserJet Printer', category: 'Accessories', quantity: 12, price: 299.99, description: 'Wireless monochrome laser printer' },
        { name: 'Kensington Docking Station', category: 'Accessories', quantity: 18, price: 249.99, description: 'Thunderbolt 3 docking station' },
        { name: 'APC UPS Battery Backup', category: 'Accessories', quantity: 15, price: 149.99, description: '1000VA battery backup system' }
    ];

    const stmt = db.prepare('INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)');
    
    products.forEach(product => {
        stmt.run(product.name, product.category, product.quantity, product.price, product.description);
    });
    
    stmt.finalize(() => {
        console.log('Database seeded with 20 IT products');
    });
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY category, name', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json(row);
        }
    });
});

// Add new product
app.post('/api/products', (req, res) => {
    const { name, category, quantity, price, description } = req.body;
    
    if (!name || !category || quantity === undefined || !price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    db.run(
        'INSERT INTO products (name, category, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
        [name, category, quantity, price, description || ''],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID, name, category, quantity, price, description });
            }
        }
    );
});

// Update product quantity
app.put('/api/products/:id', (req, res) => {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
        return res.status(400).json({ error: 'Quantity is required' });
    }
    
    db.run(
        'UPDATE products SET quantity = ? WHERE id = ?',
        [quantity, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Product not found' });
            } else {
                res.json({ message: 'Product updated successfully' });
            }
        }
    );
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
