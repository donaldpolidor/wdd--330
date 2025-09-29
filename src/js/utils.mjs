export function getParam(param, defaultValue = null) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value !== null ? value : defaultValue;
}

export function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
}

export function getLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return [];
    
    const data = JSON.parse(item);
    if (Array.isArray(data)) return data;
    if (typeof data === "object" && data !== null) return [data];
    return [];
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
  let cart = getLocalStorage("so-cart") || [];
  
  // Ensure cart is always an array
  if (!Array.isArray(cart)) {
    cart = [];
  }
  
  const existingItemIndex = cart.findIndex(item => item.Id === product.Id);
  
  if (existingItemIndex >= 0) {
    // Product already in cart, increase quantity
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
  } else {
    // New product, add with quantity 1
    const productToAdd = {...product, quantity: 1};
    cart.push(productToAdd);
  }
  
  // Save updated cart
  const success = setLocalStorage("so-cart", cart);
  
  if (success) {
    updateCartCount();
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
    if (headerElement) {
      renderWithTemplate(headerTemplate, headerElement, null, () => {
        // Callback to update the shopping cart counter
        updateCartCount();
      });
    }

    // load the footer
    const footerTemplate = await loadTemplate("/partials/footer.html");
    const footerElement = document.querySelector("#main-footer");
    if (footerElement) {
      renderWithTemplate(footerTemplate, footerElement);
    }
    
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}

// NEW ALERT MESSAGE FUNCTION - Corrected version
export function alertMessage(message, scroll = true) {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = 'alert-message';
  alert.innerHTML = `
    <span class="alert-text">${message}</span>
    <button class="alert-close">&times;</button>
  `;

  // Add to the top of main
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(alert, main.firstChild);
    
    // Scroll to top if requested
    if (scroll) {
      window.scrollTo(0, 0);
    }
  }

  // Close alert when X is clicked
  const closeBtn = alert.querySelector('.alert-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (alert.parentNode) {
        alert.remove();
      }
    });
  }

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}