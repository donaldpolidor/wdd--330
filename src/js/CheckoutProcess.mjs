import { getLocalStorage } from './utils.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  /**
   * Initialize checkout process by loading cart items from localStorage
   */
  init() {
    this.list = getLocalStorage(this.key) || [];
    console.log('Cart items loaded:', this.list);
    this.calculateItemSummary();
    this.displayCartItems();
    this.calculateOrderTotal(); // Calculate totals on initialization
  }

  /**
   * Calculate subtotal from all items in cart
   */
  calculateItemSummary() {
    // Reset itemTotal before calculation
    this.itemTotal = 0;
    
    this.itemTotal = this.list.reduce((total, item) => {
      const price = item.FinalPrice || item.SuggestedRetailPrice || 0;
      const quantity = item.Quantity || item.quantity || 1;
      const itemTotal = price * quantity;
      console.log('Item:', item.Name, 'Price:', price, 'Quantity:', quantity, 'Total:', itemTotal);
      return total + itemTotal;
    }, 0);
    
    console.log('Subtotal calculated:', this.itemTotal);
    this.updateDisplay('item-total', this.itemTotal);
  }

  /**
   * Calculate order totals including tax and shipping
   */
  calculateOrderTotal() {
    console.log('Starting order total calculation...');
    console.log('Base item total:', this.itemTotal);
    
    // Calculate tax (6% of item total)
    this.tax = Math.round((this.itemTotal * 0.06) * 100) / 100; // Round to 2 decimals
    console.log('Tax (6%):', this.tax);
    
    // Calculate shipping: $10 for first item + $2 for each additional item
    const itemCount = this.list.reduce((count, item) => {
      return count + (item.Quantity || item.quantity || 1);
    }, 0);
    
    console.log('Total item count:', itemCount);
    this.shipping = 10 + (Math.max(0, itemCount - 1) * 2);
    console.log('Shipping cost:', this.shipping);
    
    // Calculate final total
    this.orderTotal = Math.round((this.itemTotal + this.tax + this.shipping) * 100) / 100;
    console.log('Final total:', this.orderTotal);
    console.log('Calculation completed');
    
    this.displayOrderTotals();
  }

  /**
   * Display all calculated totals in the order summary
   */
  displayOrderTotals() {
    console.log('Displaying totals - Tax:', this.tax, 'Shipping:', this.shipping, 'Total:', this.orderTotal);
    
    // Update tax display
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    if (taxElement) {
      taxElement.textContent = `$${this.tax.toFixed(2)}`;
      console.log('Tax displayed:', this.tax.toFixed(2));
    } else {
      console.error('Tax element not found');
    }
    
    // Update shipping display
    const shippingElement = document.querySelector(`${this.outputSelector} #shipping`);
    if (shippingElement) {
      shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
      console.log('Shipping displayed:', this.shipping.toFixed(2));
    } else {
      console.error('Shipping element not found');
    }
    
    // Update order total display
    const orderTotalElement = document.querySelector(`${this.outputSelector} #order-total`);
    if (orderTotalElement) {
      orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
      console.log('Order total displayed:', this.orderTotal.toFixed(2));
    } else {
      console.error('Order total element not found');
    }
  }

  /**
   * Update DOM element with calculated value
   * @param {string} elementId - ID of the element to update
   * @param {number} value - Value to display
   */
  updateDisplay(elementId, value) {
    const element = document.querySelector(`${this.outputSelector} #${elementId}`);
    if (element) {
      element.textContent = `$${value.toFixed(2)}`;
      console.log(`Updated ${elementId}: $${value.toFixed(2)}`);
    } else {
      console.error(`Element #${elementId} not found in DOM`);
      console.log(`Searching for: "${this.outputSelector} #${elementId}"`);
    }
  }

  /**
   * Display cart items in the order summary section
   */
  displayCartItems() {
    const cartItemsElement = document.querySelector(`${this.outputSelector} #cart-items`);
    if (!cartItemsElement) {
      console.error('Cart items element not found');
      console.log(`Searching for: "${this.outputSelector} #cart-items"`);
      return;
    }

    if (this.list.length === 0) {
      cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
      console.log('🛒 Cart is empty');
      return;
    }

    cartItemsElement.innerHTML = this.list.map(item => {
      const price = item.FinalPrice || item.SuggestedRetailPrice || 0;
      const quantity = item.Quantity || item.quantity || 1;
      const total = price * quantity;
      
      return `
        <div class="cart-item">
          <span class="item-name">${item.Name}</span>
          <span class="item-quantity">Quantity: ${quantity}</span>
          <span class="item-price">$${total.toFixed(2)}</span>
        </div>
      `;
    }).join('');
    
    console.log('Cart items displayed');
  }

  /**
   * Convert cart items to simplified format for order submission
   * @returns {Array} Simplified items array
   */
  packageItems() {
    return this.list.map(item => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice || item.SuggestedRetailPrice || 0,
      quantity: item.Quantity || item.quantity || 1
    }));
  }

  /**
   * Convert form data to JSON object
   * @param {HTMLFormElement} formElement - Form element to convert
   * @returns {Object} Form data as JSON
   */
  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach(function(value, key) {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }

  /**
   * Process checkout by preparing order data and submitting to server
   * @param {HTMLFormElement} formElement 
   * @returns {Promise} 
   */
  async checkout(formElement) {
    console.log('Starting checkout process...');
    
    // Recalculate totals to ensure accuracy before submission
    this.calculateOrderTotal();
    
    const formData = this.formDataToJSON(formElement);
    
    const order = {
      orderDate: new Date().toISOString(),
      ...formData,
      items: this.packageItems(),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    console.log('📤 Submitting order:', order);

    try {
      const response = await this.submitOrder(order);
      console.log('Order submitted successfully:', response);
      return response;
    } catch (error) {
      console.error('Order submission failed:', error);
      throw error;
    }
  }

  /**
   * Submit order data to server
   * @param {Object} orderData 
   * @returns {Promise} 
   */
  async submitOrder(orderData) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    };

    console.log('Sending request to server...');
    const response = await fetch('https://wdd330-backend.onrender.com/checkout', options);
    
    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}