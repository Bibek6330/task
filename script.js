document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    let isEditMode = false;
    let editIndex = null;

    // Subcategory options based on category selection
    const subcategoryOptions = {
        Electronics: ["Mobiles", "Laptops", "Headphones"],
        Clothing: ["Shirts", "Pants", "Jackets"],
        "Home Appliances": ["Washing Machine", "Refrigerator", "Microwave"]
    };

    // Step navigation functionality
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('[id^="nextStep"]');
    const prevButtons = document.querySelectorAll('[id^="prevStep"]');

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        const stepElement = document.getElementById(`step${stepNumber}`);
        if (stepElement) {
            stepElement.classList.add('active');
            currentStep = stepNumber;
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            showStep(currentStep - 1);
        });
    });

    // Dynamic subcategory change
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');

    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        const subcategories = subcategoryOptions[category] || [];
        
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    });

    // Set subcategory options on page load if there's a selected category
    if (categorySelect.value) {
        categorySelect.dispatchEvent(new Event('change'));
    }

    // Form validation for each step
    function validateStep(stepNumber) {
        let valid = true;
        const step = document.getElementById(`step${stepNumber}`);
        const requiredFields = step.querySelectorAll('[required]');
        const errorMessages = step.querySelectorAll('.invalid-feedback');

        // Remove any existing error messages
        errorMessages.forEach(msg => msg.remove());

        requiredFields.forEach(field => {
            if (!field.value) {
                field.classList.add('is-invalid');
                const errorMessage = document.createElement('div');
                errorMessage.classList.add('invalid-feedback');
                errorMessage.textContent = 'This field is required';
                field.parentElement.appendChild(errorMessage);
                valid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Add validation for "Short Description" max length (150 characters)
        const shortDescriptionField = document.getElementById('shortDescription');
        if (shortDescriptionField && shortDescriptionField.value.length > 150) {
            shortDescriptionField.classList.add('is-invalid');
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('invalid-feedback');
            errorMessage.textContent = 'Short Description cannot exceed 150 characters.';
            shortDescriptionField.parentElement.appendChild(errorMessage);
            valid = false;
        } else {
            shortDescriptionField.classList.remove('is-invalid');
        }

        return valid;
    }

    // Final Price Calculation
    const basePriceInput = document.getElementById('basePrice');
    const discountInput = document.getElementById('discount');
    const shippingFeeInput = document.getElementById('shippingFee');
    const finalPriceInput = document.getElementById('finalPrice');

    function calculateFinalPrice() {
        const basePrice = parseFloat(basePriceInput.value) || 0;
        const discount = parseFloat(discountInput.value) || 0;
        const shippingFee = parseFloat(shippingFeeInput.value) || 0;
        
        const finalPrice = basePrice - (basePrice * discount / 100) + shippingFee;
        finalPriceInput.value = finalPrice.toFixed(2);
    }

    basePriceInput.addEventListener('input', calculateFinalPrice);
    discountInput.addEventListener('input', calculateFinalPrice);
    shippingFeeInput.addEventListener('input', calculateFinalPrice);

    // Check for duplicate SKU
    function isSkuDuplicate(sku) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        // If in edit mode, exclude the current product's SKU
        if (isEditMode && editIndex !== null) {
            return products.some((product, index) => product.sku === sku && index !== editIndex);
        }
        return products.some(product => product.sku === sku);
    }

    // Saving product data to localStorage and displaying in table
    const productForm = document.getElementById('productForm');
    const productsTableBody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    const clearDataButton = document.getElementById('clearData');
    const returnHomeButton = document.getElementById('returnHome');

    function saveProductData() {
        const sku = document.getElementById('sku').value.trim();

        // Check if SKU is already in use
        if (isSkuDuplicate(sku)) {
            alert('Error: This SKU code is already used. Please use a different SKU.');
            return; // Exit the function without saving if duplicate is found
        }

        const productData = {
            productName: document.getElementById('productName').value.trim(),
            sku: sku,
            brand: document.getElementById('brand').value.trim(),
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value,
            shortDescription: document.getElementById('shortDescription').value.trim(),
            fullDescription: document.getElementById('fullDescription').value.trim(),
            metaTitle: document.getElementById('metaTitle').value.trim(),
            metaKeywords: document.getElementById('metaKeywords').value.trim(),
            metaDescription: document.getElementById('metaDescription').value.trim(),
            basePrice: parseFloat(document.getElementById('basePrice').value) || 0,
            discount: parseFloat(document.getElementById('discount').value) || 0,
            shippingFee: parseFloat(document.getElementById('shippingFee').value) || 0,
            finalPrice: parseFloat(document.getElementById('finalPrice').value) || 0,
            totalStock: parseInt(document.getElementById('totalStock').value) || 0,
        };
        
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        if (isEditMode && editIndex !== null) {
            // Update existing product
            products[editIndex] = productData;
            isEditMode = false;
            editIndex = null;
        } else {
            // Add new product
            products.push(productData);
        }

        localStorage.setItem('products', JSON.stringify(products));
        renderProductsTable();
        resetForm();
        showStep(1);
    }

    function renderProductsTable() {
        productsTableBody.innerHTML = ''; // Clear table before re-rendering
        let products = JSON.parse(localStorage.getItem('products')) || [];

        products.forEach((product, index) => {
            const row = productsTableBody.insertRow();
            row.innerHTML = `
                <td>${product.productName}</td>
                <td>${product.sku}</td>
                <td>${product.category}</td>
                <td>${product.basePrice.toFixed(2)}</td>
                <td>${product.finalPrice.toFixed(2)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Delete</button>
                </td>
            `;
        });
    }

    function editProduct(index) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[index];

        if (!product) {
            alert('Product not found!');
            return;
        }

        // Populate form with product data
        document.getElementById('productName').value = product.productName;
        document.getElementById('sku').value = product.sku;
        document.getElementById('brand').value = product.brand;
        document.getElementById('category').value = product.category;
        document.getElementById('subcategory').value = product.subcategory;
        document.getElementById('shortDescription').value = product.shortDescription;
        document.getElementById('fullDescription').value = product.fullDescription;
        document.getElementById('metaTitle').value = product.metaTitle;
        document.getElementById('metaKeywords').value = product.metaKeywords;
        document.getElementById('metaDescription').value = product.metaDescription;
        document.getElementById('basePrice').value = product.basePrice;
        document.getElementById('discount').value = product.discount;
        document.getElementById('shippingFee').value = product.shippingFee;
        document.getElementById('finalPrice').value = product.finalPrice;
        document.getElementById('totalStock').value = product.totalStock;

        calculateFinalPrice();

        // Set edit mode
        isEditMode = true;
        editIndex = index;

        // Change the submit button to "Update Product"
        const submitButton = document.getElementById('submitForm');
        submitButton.textContent = "Update Product";
    }

    function deleteProduct(index) {
        // Get products from local storage
        let products = JSON.parse(localStorage.getItem('products')) || [];
    
        // Confirm deletion
        if (confirm('Are you sure you want to delete this product?')) {
            // Remove the product from the array using the index
            products.splice(index, 1);
        
            // Update local storage with the modified array
            localStorage.setItem('products', JSON.stringify(products));
        
            // Re-render the product table
            renderProductsTable();
        }
    }

    // Clear all data with confirmation
    clearDataButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all products?')) {
            localStorage.removeItem('products');
            renderProductsTable();
        }
    });

    // Return to Home (reset form and go back to first step)
    returnHomeButton.addEventListener('click', () => {
        resetForm();
        showStep(1);
    });

    // Submit form functionality
    const submitButton = document.getElementById('submitForm');
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateStep(currentStep)) {
            saveProductData();
            showStep(5); // Show saved products step after submission
        }
    });

    // Reset the form fields
    function resetForm() {
        productForm.reset();
        calculateFinalPrice();
        submitButton.textContent = "Save Product";
        isEditMode = false;
        editIndex = null;
    }

    // Make editProduct and deleteProduct globally accessible
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;

    // Initialize the first step
    showStep(currentStep);

    // Initial render of products from localStorage
    renderProductsTable();
});
