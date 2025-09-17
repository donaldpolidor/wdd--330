function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Utilisez la variable d'environnement pour l'URL de base
    this.basePath = import.meta.env.VITE_SERVER_URL;
    this.path = `${this.basePath}api/products/${this.category}`;
  }
  
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}