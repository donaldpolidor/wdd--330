import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  // Use PrimaryMedium for list images
  const imagePath = product.Images?.PrimaryMedium || product.Images?.Primary;
  
  return `<li class="product-card">
    <a href="/product_pages/index.html?product=${product.Id}">
      <img src="${imagePath}" alt="Image of ${product.Name}">
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
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
    
    // Update the page title
    this.updatePageTitle();
  }

  renderList(list) {
    renderListWithTemplate(
      productCardTemplate, 
      this.listElement, 
      list, 
      "afterbegin", 
      true
    );
  }

  updatePageTitle() {
    const categoryTitle = this.category.charAt(0).toUpperCase() + this.category.slice(1);
    document.title = `Sleep Outside | ${categoryTitle}`;
    
    // Update the H1 title if it exists
    const pageTitle = document.querySelector("h1");
    if (pageTitle) {
      pageTitle.textContent = `Top Products: ${categoryTitle}`;
    }
  }
}