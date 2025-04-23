// script.js

// Initialize cart from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add items to cart
document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.dataset.item;
    const price = parseInt(button.dataset.price);
    cart.push({ item, price });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    alert(`${item} added to cart!`);
    updateCartSummary();
  });
});

// Update cart summary dynamically
function updateCartSummary() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total').querySelector('span');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach((product) => {
    const li = document.createElement('li');
    li.textContent = `${product.item} - KSh ${product.price}`;
    cartItems.appendChild(li);
    total += product.price;
  });

  cartTotal.textContent = total.toString();
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
      li.textContent = `${product.item} - KSh ${product.price}`;
      orderSummary.appendChild(li);
      total += product.price;
    });

    orderTotal.textContent = total.toString();
  }
});

// EmailJS integration
(function () {
  emailjs.init('r7S7eB8SG444rogVC'); // Replace with your EmailJS public key
})();

document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const date = document.getElementById('date').value;

  // Ensure cart data is loaded from localStorage
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if cart is empty
  if (currentCart.length === 0) {
    alert('Your cart is empty. Please add items before placing an order.');
    return;
  }

  // Send order details via EmailJS
  emailjs
    .send('service_le4lkf5', 'template_of6il3c', {
      name,
      email,
      date,
      cart: JSON.stringify(currentCart), // Send cart data as JSON
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
