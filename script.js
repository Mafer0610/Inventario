// Inicialización de variables globales
let products = [];
let nextId = 1;
let editMode = false;

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productId = document.getElementById('productId');
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productStock = document.getElementById('productStock');
const productPrice = document.getElementById('productPrice');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const productTableBody = document.getElementById('productTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortBy = document.getElementById('sortBy');
const sortAscBtn = document.getElementById('sortAscBtn');
const sortDescBtn = document.getElementById('sortDescBtn');
const showFormBtn = document.getElementById('showFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const formContainer = document.getElementById('formContainer');

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromLocalStorage();
    renderProductTable();
    
    // Event Listeners
    productForm.addEventListener('submit', saveProduct);
    cancelBtn.addEventListener('click', hideForm);
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    sortAscBtn.addEventListener('click', function() { sortProducts('asc'); });
    sortDescBtn.addEventListener('click', function() { sortProducts('desc'); });
    showFormBtn.addEventListener('click', showForm);
    closeFormBtn.addEventListener('click', hideForm);
});

// Mostrar formulario
function showForm() {
    formContainer.style.display = 'block';
    productName.focus();
    
    // Scroll hacia el formulario
    formContainer.scrollIntoView({ behavior: 'smooth' });
}

// Ocultar formulario
function hideForm() {
    formContainer.style.display = 'none';
    productForm.reset();
    editMode = false;
    saveBtn.textContent = 'Guardar Producto';
}

// Cargar productos desde localStorage
function loadProductsFromLocalStorage() {
    const storedProducts = localStorage.getItem('inventoryProducts');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        // Encontrar el próximo ID disponible
        if (products.length > 0) {
            const maxId = Math.max(...products.map(product => product.id));
            nextId = maxId + 1;
        }
    } else {
        // Datos de muestra si no hay productos guardados
        products = [
            { id: 1, name: 'Laptop HP', category: 'Electrónicos', stock: 10, price: 899.99 },
            { id: 2, name: 'Escritorio de oficina', category: 'Oficina', stock: 5, price: 249.50 },
            { id: 3, name: 'Camiseta deportiva', category: 'Ropa', stock: 50, price: 24.99 }
        ];
        nextId = 4;
        saveProductsToLocalStorage();
    }
}

// Guardar productos en localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
}

// Renderizar la tabla de productos
function renderProductTable(productsToShow = products) {
    productTableBody.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos para mostrar</td></tr>';
        return;
    }
    
    productsToShow.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Editar</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Eliminar</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Guardar o actualizar un producto
function saveProduct(e) {
    e.preventDefault();
    
    const product = {
        name: productName.value,
        category: productCategory.value,
        stock: parseInt(productStock.value),
        price: parseFloat(productPrice.value)
    };
    
    if (editMode) {
        // Actualizar producto existente
        const id = parseInt(productId.value);
        product.id = id;
        
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = product;
        }
    } else {
        // Agregar nuevo producto
        product.id = nextId++;
        products.push(product);
    }
    
    saveProductsToLocalStorage();
    renderProductTable();
    hideForm();
}

// Editar un producto
function editProduct(id) {
    const product = products.find(product => product.id === id);
    if (!product) return;
    
    productId.value = product.id;
    productName.value = product.name;
    productCategory.value = product.category;
    productStock.value = product.stock;
    productPrice.value = product.price;
    
    saveBtn.textContent = 'Actualizar Producto';
    editMode = true;
    
    showForm();
}

// Eliminar un producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products = products.filter(product => product.id !== id);
        saveProductsToLocalStorage();
        renderProductTable();
    }
}

// Buscar productos
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProductTable();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.id.toString().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderProductTable(filteredProducts);
}

// Ordenar productos
function sortProducts(direction) {
    const field = sortBy.value;
    const sortedProducts = [...products];
    
    sortedProducts.sort((a, b) => {
        let comparison = 0;
        
        switch(field) {
            case 'id':
                comparison = a.id - b.id;
                break;
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'stock':
                comparison = a.stock - b.stock;
                break;
            case 'price':
                comparison = a.price - b.price;
                break;
        }
        
        return direction === 'asc' ? comparison : -comparison;
    });
    
    renderProductTable(sortedProducts);
}