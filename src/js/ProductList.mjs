import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  let imagePath = product.Image;
  
  // Path normalization
  if (imagePath) {
    if (imagePath.startsWith("/")) {
      imagePath = imagePath.substring(1);
    }
    if (!imagePath.startsWith("images/")) {
      imagePath = "images/" + imagePath;
    }
    imagePath = "/" + imagePath;
  }
  
  return `<li class="product-card">
    <a href="product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}" onerror="console.error('Image failed to load:', this.src)">
      <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
      <h2 class="card__name">${product.Name}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData();
    this.renderList(list);
  }

  renderList(list) {
    // Display all products instead of a selection
    renderListWithTemplate(
      productCardTemplate, 
      this.listElement, 
      list, 
      "afterbegin", 
      true
    );
  }
}