import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

// load header and footer
loadHeaderFooter();

// Get category from URL parameter
const category = getParam("category") || "tents";

// Initialize product data with the selected category
const dataSource = new ProductData(category);

// Initialize product list for product listing page
const listElement = document.querySelector(".product-list");
if (listElement) {
  const productList = new ProductList(category, dataSource, listElement);
  productList.init();
  
  // Update page title with category
  document.title = `Sleep Outside | ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}