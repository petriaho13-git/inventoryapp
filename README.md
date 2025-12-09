# Inventory Management System

A modern web application for managing IT product inventory. Users can browse products, add new products, update quantities, and delete products through an intuitive interface.

## Features

- 📦 **Browse Products**: View all inventory items in a clean, organized table
- ➕ **Add Products**: Add new products with name, category, price, quantity, and description
- ✏️ **Update Quantities**: Easily modify product quantities
- 🗑️ **Delete Products**: Remove products from inventory
- 🔍 **Search & Filter**: Search products and filter by category
- 🎨 **Modern UI**: Clean, responsive design with Bootstrap 5
- 💾 **Pre-populated Database**: 20 IT products ready to use

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite (local file-based database)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5 with Bootstrap Icons

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd inventoryapp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

The application will automatically create a SQLite database (`inventory.db`) and populate it with 20 IT products on first run.

## Usage

### Browsing Products
- View all products in the main table
- Products are organized by category (Computers, Monitors, Accessories)
- Quantity badges show stock levels (green = in stock, yellow = low stock, red = out of stock)

### Adding a Product
1. Click the "Add Product" button
2. Fill in the product details:
   - Product Name (required)
   - Category (required)
   - Description (optional)
   - Price (required)
   - Quantity (required)
3. Click "Add Product" to save

### Updating Quantity
1. Click the "Edit Qty" button next to any product
2. Enter the new quantity
3. Click "Update" to save

### Deleting a Product
1. Click the "Delete" button next to any product
2. Confirm the deletion in the popup dialog

### Search and Filter
- Use the search box to find products by name, description, or category
- Use the category dropdown to filter by specific categories
- Filters can be combined for refined results

## Project Structure

```
inventoryapp/
├── server.js           # Express server and API endpoints
├── package.json        # Project dependencies
├── inventory.db        # SQLite database (created automatically)
├── public/
│   ├── index.html      # Main HTML page
│   ├── style.css       # Custom styles
│   └── app.js          # Frontend JavaScript
└── README.md           # This file
```

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Add a new product
- `PUT /api/products/:id` - Update product quantity
- `DELETE /api/products/:id` - Delete a product

## Pre-populated Products

The database includes 20 IT products across three categories:
- **Computers**: Laptops and desktops from Dell, HP, Lenovo, Apple
- **Monitors**: Various display sizes from Dell, LG, Samsung, ASUS
- **Accessories**: Keyboards, mice, headsets, storage devices, and more

## License

ISC
