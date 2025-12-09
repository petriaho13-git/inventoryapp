let allProducts = [];
let addProductModalInstance;
let editQuantityModalInstance;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap modals
    addProductModalInstance = new bootstrap.Modal(document.getElementById('addProductModal'));
    editQuantityModalInstance = new bootstrap.Modal(document.getElementById('editQuantityModal'));
    
    // Load products
    loadProducts();
    
    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
});

// Load all products from API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products', 'danger');
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem;"></i>
                    <p class="mt-2">No products found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td class="fw-bold">${escapeHtml(product.name)}</td>
            <td><span class="badge bg-primary">${escapeHtml(product.category)}</span></td>
            <td>${escapeHtml(product.description || 'N/A')}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span class="quantity-display ${getQuantityClass(product.quantity)}">
                    ${product.quantity}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="openEditQuantity(${product.id}, '${escapeHtml(product.name)}', ${product.quantity})">
                        <i class="bi bi-pencil"></i> Edit Qty
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id}, '${escapeHtml(product.name)}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Get quantity badge class based on stock level
function getQuantityClass(quantity) {
    if (quantity === 0) return 'badge bg-danger';
    if (quantity < 10) return 'badge bg-warning text-dark';
    return 'badge bg-success';
}

// Filter products based on search and category
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    let filtered = allProducts;
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            (p.description && p.description.toLowerCase().includes(searchTerm)) ||
            p.category.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
}

// Add new product
async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const description = document.getElementById('productDescription').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    if (!name || !category || isNaN(price) || isNaN(quantity)) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, category, description, price, quantity })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add product');
        }
        
        // Reset form and close modal
        document.getElementById('addProductForm').reset();
        addProductModalInstance.hide();
        
        // Reload products
        await loadProducts();
        showAlert('Product added successfully', 'success');
    } catch (error) {
        console.error('Error adding product:', error);
        showAlert('Error adding product', 'danger');
    }
}

// Open edit quantity modal
function openEditQuantity(id, name, currentQuantity) {
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').textContent = name;
    document.getElementById('newQuantity').value = currentQuantity;
    editQuantityModalInstance.show();
}

// Update product quantity
async function updateQuantity() {
    const id = document.getElementById('editProductId').value;
    const quantity = parseInt(document.getElementById('newQuantity').value);
    
    if (isNaN(quantity) || quantity < 0) {
        showAlert('Please enter a valid quantity', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update quantity');
        }
        
        editQuantityModalInstance.hide();
        await loadProducts();
        showAlert('Quantity updated successfully', 'success');
    } catch (error) {
        console.error('Error updating quantity:', error);
        showAlert('Error updating quantity', 'danger');
    }
}

// Delete product
async function deleteProduct(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        await loadProducts();
        showAlert('Product deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error deleting product', 'danger');
    }
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
