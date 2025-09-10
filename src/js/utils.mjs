export function getParam(param) {
  const queryString = window.location.search;
  console.log("Query string:", queryString);
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  console.log(`Parameter ${param}:`, value);
  return value;
}

export function setLocalStorage(key, data) {
  try {
    console.log("Saving to localStorage:", key, data);
    localStorage.setItem(key, JSON.stringify(data));
    console.log("Data saved successfully");
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

export function getLocalStorage(key) {
  try {
    console.log("Reading from localStorage:", key);
    const item = localStorage.getItem(key);
    console.log("Raw data:", item);
    
    if (!item) {
      console.log("No data found, returning empty array");
      return [];
    }
    
    const data = JSON.parse(item);
    console.log("Parsed data:", data);
    
    // Ensure we always return an array
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === "object" && data !== null) {
      console.log("Converting object to array");
      return [data];
    } else {
      console.warn("Unexpected data format, returning empty array");
      return [];
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
  // Update the counter in the UI
  const cartCounter = document.querySelector(".cart-count");
  if (cartCounter) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? "block" : "none";
  }
}

export function addProductToCart(product) {
  console.log("Adding product to cart:", product);
  
  let cart = getLocalStorage("so-cart") || [];
  
  // Ensure cart is always an array
  if (!Array.isArray(cart)) {
    console.warn("Cart is not an array, resetting it");
    cart = [];
  }
  
  const existingItemIndex = cart.findIndex(item => item.Id === product.Id);
  
  if (existingItemIndex >= 0) {
    // Product already in cart, increase quantity
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    console.log("Quantity increased for existing product");
  } else {
    // New product, add with quantity 1
    const productToAdd = {...product, quantity: 1};
    cart.push(productToAdd);
    console.log("New product added to cart");
  }
  
  // Save updated cart
  const success = setLocalStorage("so-cart", cart);
  
  if (success) {
    console.log("Cart updated successfully");
    updateCartCount(); 
  } else {
    console.error("Failed to update cart");
  }
  
  return success;
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}