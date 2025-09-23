import CheckoutProcess from './CheckoutProcess.mjs';
import { loadHeaderFooter } from './utils.mjs';

// Load header and footer
loadHeaderFooter();

// Simple initialization
console.log('🚀 Initializing checkout...');

const checkout = new CheckoutProcess('so-cart', '.order-totals');
checkout.init();

// Recalculate totals when zip code changes
const zipInput = document.getElementById('zip');
if (zipInput) {
  zipInput.addEventListener('input', () => {
    checkout.calculateOrderTotal();
  });
}

// Handle form submission
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!checkoutForm.checkValidity()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    if (checkout.list.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }

    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';

    try {
      const result = await checkout.checkout(checkoutForm);
      alert(`Order successfully placed! Order number: ${result.orderId}`);
      localStorage.removeItem('so-cart');
      window.location.href = '../index.html';
    } catch (error) {
      alert('Error processing the order. Please try again..');
      submitButton.disabled = false;
      submitButton.textContent = 'Payment';
    }
  });
}