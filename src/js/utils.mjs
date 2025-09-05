// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item);
  } catch (error) {
    // In case of error, delete corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  const element = qs(selector);
  if (element) {
    element.addEventListener("touchend", (event) => {
      event.preventDefault();
      callback();
    });
    element.addEventListener("click", callback);
  }
}

// ADD TO CART FUNCTION - FIXES THE LOCALSTORAGE OVERWRITE ISSUE
export function addProductToCart(product) {
  // 1. Get existing cart from localStorage or empty array if none exists
  const existingCart = getLocalStorage("so-cart") || [];
  
  // 2. Verify that the product has all the necessary properties.
  const productToAdd = {
    Id: product.Id || "",
    Name: product.Name || "",
    Image: product.Image || "",
    FinalPrice: product.FinalPrice || 0,
    Colors: product.Colors || [{ ColorName: "Default" }],
    quantity: 1
  };
  
  // 3. Check if product already exists in cart
  const existingProductIndex = existingCart.findIndex(item => item.Id === productToAdd.Id);
  
  if (existingProductIndex !== -1) {
    // Product exists - increment quantity
    existingCart[existingProductIndex].quantity = (existingCart[existingProductIndex].quantity || 1) + 1;
  } else {
    // New product - add with quantity 1
    existingCart.push(productToAdd);
  }
  
  // 4. Save updated cart to localStorage
  setLocalStorage("so-cart", existingCart);
  
  // 5. Update cart count display
  updateCartCount();
}

// UPDATE CART COUNT DISPLAY
export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const cartCount = document.querySelector(".cart-count");
  
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
  }
}