export interface Material {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductMaterial {
  id: number;
  productId: number;
  materialId: number;
  quantityRequired: number;
  material?: Material;
}

export interface ProductionSuggestion {
  productId: number;
  productName: string;
  quantityToProduce: number;
  subtotal: number;
}

export interface ProductionResponse {
  suggestions: ProductionSuggestion[];
  totalValue: number;
}
