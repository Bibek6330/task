# 📦 Multi-Product Entry Form

A modern, multi-step product entry form built with **HTML**, **CSS**, **Bootstrap 5**, and **JavaScript**. Designed to capture detailed product information in a user-friendly, step-by-step format, saving it to **Local Storage** and displaying it dynamically in a table with **edit** functionality.

---

## 🌟 Features

- **🔄 Multi-Step Form**: Organized in distinct steps for intuitive navigation.
- **🧩 Dynamic Fields**: Relevant fields appear based on user selections.
- **💾 Local Storage**: Saves product data directly to the browser.
- **📊 Dynamic Table**: Displays product entries with in-line editing.
- **🛠️ Edit & Update**: Real-time updates to local storage with editing capabilities.

---

## 📋 Form Steps

### **Step 1: Basic Product Details**
   - **Product Name**: *Required* text input.
   - **SKU**: Unique identifier for inventory.
   - **Brand Name**: Optional text input.
   - **Category**: Dropdown (e.g., Electronics, Clothing).
   - **Subcategory**: Dependent on Category (e.g., "Mobiles" under Electronics).

### **Step 2: Descriptions and Metadata**
   - **Short Description**: Brief overview, max 150 characters, *required*.
   - **Full Description**: Detailed product description (optional).
   - **Meta Title**: For search results display.
   - **Meta Keywords**: Tags or comma-separated input.
   - **Meta Description**: SEO-friendly description.

### **Step 3: Media Uploads**
   - **Main Image**: Single image file (required).
   - **Gallery Images**: Up to 3 additional optional images.

### **Step 4: Variant Options**
   - **Add Variant Button**: Opens a modal to add variant details:
     - **Variant Type**: Dropdown (Size, Color, Unit).
     - **Size**: Input if Size selected.
     - **Color**: Color picker if Color selected.
     - **Unit Count**: Number input if Unit selected.
     - **Unit Type**: Dropdown (kg, piece, etc.)

### **Step 5: Pricing and Additional Costs**
   - **Base Price**: *Required* number input.
   - **Discount (%)**: Optional percentage input.
   - **Shipping Fee**: Optional number input.
   - **Final Price Display**: Automatically calculated: 
     `final price = base price - (base price * discount / 100) + shipping fee`.
   - **Total Stock**: *Required* number input.

---

## 🚀 Getting Started

### Installation

**1. Clone the repository:**

   ```bash
   git clone https://github.com/your-username/multi-product-entry-form.git
   Open the index.html file in your preferred web browser.
Usage
Open index.html to launch the form.
Complete each step to enter product details.
Submit the form to save data to local storage.
View the Table: Saved products are displayed below the form in a dynamic table.
Edit Products: Click the "Edit" button in the table to update details, with real-time updates to local storage
