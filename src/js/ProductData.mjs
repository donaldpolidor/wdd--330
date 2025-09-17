function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
  }
}

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ProductData {
  constructor() {
  }
  
  async getData(category) {
    try {
      console.log("Fetching data for category:", category);
      const response = await fetch(`${baseURL}products/search/${category}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await convertToJson(response);
      console.log("Data received for", category, ":", data?.Result?.length || 0, "items");
      
      return data.Result || [];
    } catch (error) {
      console.error("Error in getData:", error);
      
      // Fallback: try local JSON file
      try {
        console.log("Trying fallback to local JSON...");
        const localResponse = await fetch(`/json/${category}.json`);
        if (localResponse.ok) {
          const localData = await convertToJson(localResponse);
          console.log("Fallback successful, using local data");
          return localData;
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
      
      throw error;
    }
  }
  
  async findProductById(id) {
    console.log("Search for product by ID:", id);
    
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      console.log("API response:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await convertToJson(response);
      console.log("Data received:", data);
      
      if (!data.Result) {
        throw new Error("No Result field in API response");
      }
      
      return data.Result;
      
    } catch (error) {
      console.error("Erreur dans findProductById:", error);
      
      // Fallback: try to find product in local data
      try {
        console.log("Trying fallback to local data...");
        const localResponse = await fetch('/json/tents.json');
        if (localResponse.ok) {
          const localData = await convertToJson(localResponse);
          const product = localData.find(item => item.Id === id);
          if (product) {
            console.log("Product found in local fallback");
            return product;
          }
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
      
      throw new Error(`Cannot find product with ID: ${id}`);
    }
  }
}