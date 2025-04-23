// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update cart summary dynamically
function updateCartSummary() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = `${product.item} (Quantity: ${product.quantity}) - KSh ${product.price * product.quantity}`;
    cartItems.appendChild(li);
    total += product.price * product.quantity;
  });

  if (cartTotal) {
    cartTotal.textContent = total.toString();
  }
}

// Add items to cart
document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = parseInt(button.dataset.price);
    const quantityInput = button.previousElementSibling; // Get quantity input field
    const quantity = parseInt(quantityInput.value) || 1; // Default to 1 if no quantity is entered

    if (quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const existingItem = cart.find((product) => product.item === item);

    if (existingItem) {
      existingItem.quantity += quantity; // Increment quantity if the item already exists
    } else {
      cart.push({ item, price, quantity }); // Add new item with specified quantity
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    alert(`${item} (${quantity} pcs) added to cart!`);
    updateCartSummary();
  });
});

// Clear cart after checkout
function clearCart() {
  cart = [];
  localStorage.removeItem('cart'); // Remove cart data from localStorage
  updateCartSummary();
}

// Update cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartSummary();

  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const email = urlParams.get('email');
  const date = urlParams.get('date');

  // Update confirmation page
  if (document.getElementById('customer-name')) {
    document.getElementById('customer-name').textContent = name;
    document.getElementById('customer-email').textContent = email;
    document.getElementById('delivery-date').textContent = date;

    const orderSummary = document.getElementById('order-summary');
    const orderTotal = document.getElementById('order-total');
    let total = 0;

    cart.forEach((product) => {
      const li = document.createElement('li');
      li.textContent = `${product.item} (Quantity: ${product.quantity}) - KSh ${product.price * product.quantity}`;
      orderSummary.appendChild(li);
      total += product.price * product.quantity;
    });

    if (orderTotal) {
      orderTotal.textContent = total.toString();
    }

    clearCart(); // Clear the cart after displaying the confirmation
  }
});

// EmailJS integration
(function () {
  emailjs.init('AmtW32hwxXjkXi1uO'); // Replace with your EmailJS Public Key
})();

document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const date = document.getElementById('date').value;
  const phone = document.getElementById('phone').value;

  // Retrieve the cart from localStorage
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if cart is empty
  if (currentCart.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  // Calculate the total amount
  const total = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Send the email using EmailJS
  emailjs
    .send('service_le4lkf5', 'template_of6il3c', {
      name,
      email,
      phone,
      date,
      cart: currentCart.map(item => `${item.item} (x${item.quantity})`).join(', '),
      total,
    })
    .then(() => {
      alert('Order placed successfully! A confirmation email has been sent.');
      localStorage.removeItem('cart'); // Clear cart after successful order
      window.location.href = 'confirmation.html';
    })
    .catch((error) => {
      console.error('Failed to send order notification:', error);
      alert('Failed to send order notification. Please try again.');
    });
});

// Review form submission
document.getElementById('review-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const reviewText = e.target.querySelector('textarea').value;
  const rating = e.target.querySelector('input[type="number"]').value;

  const reviewList = document.getElementById('review-list');
  const reviewItem = document.createElement('div');
  reviewItem.innerHTML = `<p>${reviewText}</p><p>Rating: ${rating}/5</p>`;
  reviewList.appendChild(reviewItem);

  e.target.reset();
});
