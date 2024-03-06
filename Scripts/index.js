// Get the modal
var modal = document.getElementById("addProductModal");

// Get the button that opens the modal
var btn = document.getElementById("addProduct");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Add event listener for adding a new product
document.getElementById("addProductBtn").addEventListener("click", function () {
    const productCode = document.getElementById("productCode").value;
    const productName = document.getElementById("productName").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = 1;

    // Validate that all fields are not empty
    if (productCode.trim() === "" || productName.trim() === "" || productPrice.trim() === "") {
        Swal.fire({
            icon: 'error',
            title: 'Empty Fields',
            text: 'Please fill in all fields to add a new product.'
        });
        return;
    }

    // Validate product name (only allow alphabetic characters and spaces)
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(productName.trim())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Product Name',
            text: 'Product name can only contain alphabetic characters and spaces.'
        });
        return;
    }

    // Validate product price (only allow numerical digits)
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(productPrice.trim())) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Product Price',
            text: 'Product price can only contain numerical digits.'
        });
        return;
    }

    // Check if the product ID already exists in the table
    const existingProduct = Array.from(document.querySelectorAll('#productTable tbody tr'))
        .find(row => row.cells[0].textContent === productCode);

    if (existingProduct) {
        Swal.fire({
            icon: 'error',
            title: 'Product Already Exists',
            text: 'Product with the same ID already exists. Please enter a different ID.'
        });
        return;
    }

    const table = document.getElementById("productTable").getElementsByTagName("tbody")[0];
    const newRow = table.insertRow(-1);
    newRow.innerHTML = `
        <td>${productCode}</td>
        <td>${productName}</td>
        <td>$${productPrice}</td>
        <td><input type="number" value="${productQuantity}" min="1"></td>
        <td>$${(parseFloat(productPrice) * parseInt(productQuantity)).toFixed(2)}</td>
        <td>${new Date().toLocaleString()}</td>
        <td><button class="delete">Delete</button></td>
        <td><button class="update">Edit</button></td>
    `;

    // Update total invoice amount
    updateTotalInvoiceAmount();

    // Close the modal
    modal.style.display = "none";

    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Product Added Successfully',
        showConfirmButton: false,
        timer: 1500
    });

    // Add event listeners to the delete and update buttons in the new row
    const deleteButton = newRow.querySelector('.delete');
    const updateButton = newRow.querySelector('.update');

    deleteButton.addEventListener('click', function () {
        deleteProduct(newRow);
    });

    updateButton.addEventListener('click', function () {
        updateProduct(newRow);
    });

    // Clear modal fields
    clearModalFields();
});

// Function to clear modal fields
function clearModalFields() {
    document.getElementById("productCode").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
}

// Function to delete a product
function deleteProduct(row) {
    Swal.fire({
        title: 'Delete Product',
        text: 'Are you sure you want to delete this product?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it'
    }).then((result) => {
        if (result.isConfirmed) {
            row.remove();
            updateTotalInvoiceAmount();
            showPopup('Product deleted successfully.');
        }
    });
}

// Function to update a product
function updateProduct(row) {
    const productCode = row.cells[0].textContent;
    const productName = row.cells[1].textContent;
    const productPrice = row.cells[2].textContent.replace('$', '');
    const productQuantity = row.cells[3].querySelector('input').value;

    // Update the modal fields with the product details
    document.getElementById('productCode').value = productCode;
    document.getElementById('productName').value = productName;
    document.getElementById('productPrice').value = productPrice;

    // Show the modal
    modal.style.display = 'block';

    // Update the product details when the user clicks the 'Add' button in the modal
    document.getElementById('addProductBtn').onclick = function () {
        row.cells[0].textContent = document.getElementById('productCode').value;
        row.cells[1].textContent = document.getElementById('productName').value;
        row.cells[2].textContent = '$' + document.getElementById('productPrice').value;
        row.cells[3].querySelector('input').value = productQuantity;
        row.cells[4].textContent = '$' + (parseFloat(document.getElementById('productPrice').value) * parseInt(productQuantity)).toFixed(2);

        updateTotalInvoiceAmount();
        modal.style.display = 'none';
        showPopup('Product updated successfully.');
    };
    // Update total product price when quantity is changed
    document.getElementById('productQuantity').addEventListener('input', function () {
        const quantity = parseInt(this.value);
        row.cells[4].textContent = '$' + (parseFloat(productPrice) * quantity).toFixed(2);
        updateTotalInvoiceAmount();
    });
    
    Swal.fire({
        title: 'Update Product',
        text: 'Are you sure you want to update this product?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with the update
            document.getElementById('addProductBtn').click();
        } else {
            document.getElementById('productCode').value = productCode;
            document.getElementById('productName').value = productName;
            document.getElementById('productPrice').value = productPrice;
            modal.style.display = 'none';
        }
    });
}


// Function to update the total invoice amount
function updateTotalInvoiceAmount() {
    let totalInvoiceAmount = 0;
    document.querySelectorAll('#productTable tbody tr').forEach(row => {
        const price = parseFloat(row.cells[2].textContent.replace('$', ''));
        const quantity = parseInt(row.cells[3].querySelector('input').value);
        const totalAmount = price * quantity;
        row.cells[4].textContent = '$' + totalAmount.toFixed(2);
        totalInvoiceAmount += totalAmount;
    });
    document.getElementById('totalAmount').value = '$' + totalInvoiceAmount.toFixed(2);
}
document.getElementById("productTable").addEventListener('input', function (event) {
    if (event.target && event.target.tagName === 'INPUT' && event.target.type === 'number') {
        updateTotalInvoiceAmount();
    }
});

// Function to show a popup message
function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(function () {
        popup.remove();
    }, 2000);
}

function clearModalFields() {
    document.getElementById("productCode").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
}

btn.onclick = function () {
    modal.style.display = "block";
    clearModalFields();
}
