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

// Representa a "Receita" (RF003)
export interface ProductMaterial {
  id: number;
  productId: number;
  materialId: number;
  quantityRequired: number;
  material?: Material;
}

// Resposta do algoritmo de produção (RF004)
export interface ProductionSuggestion {
  productId: number;
  productName: string;
  quantityToProduce: number;
}

export interface ProductionResponse {
  suggestions: ProductionSuggestion[];
  totalValue: number;
}