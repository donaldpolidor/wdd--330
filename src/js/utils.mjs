export function getParam(param, defaultValue = null) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value !== null ? value : defaultValue;
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
  
  const cartCounter = document.querySelector(".cart-count");
  if (cartCounter) {
    cartCounter.textContent = totalItems;
    cartCounter.style.display = totalItems > 0 ? "block" : "none";
  }
}

// Listen to the basket update event
document.addEventListener('cartUpdated', updateCartCount);

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

// Function to load a template
export async function loadTemplate(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      throw new Error(`Failed to load template: ${path}`);
    }
    return await res.text();
  } catch (error) {
    console.error("Error loading template:", error);
    return "";
  }
}

// Function to return a template
export function renderWithTemplate(template, parentElement, data, callback) {
  if (parentElement) {
    parentElement.innerHTML = template;
    if (callback) {
      callback(data);
    }
  }
}

// Function to load header and footer
export async function loadHeaderFooter() {
  try {
    // load the header
    const headerTemplate = await loadTemplate("/partials/header.html");
    const headerElement = document.querySelector("#main-header");
    renderWithTemplate(headerTemplate, headerElement, null, () => {
      // Callback to update the shopping cart counter
      updateCartCount();
    });

    // load the footer
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const footerElement = document.querySelector("#main-footer");
    renderWithTemplate(footerTemplate, footerElement);
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}