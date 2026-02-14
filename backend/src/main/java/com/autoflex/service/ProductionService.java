package com.autoflex.service;

import com.autoflex.dto.ProductionSuggestionDTO;
import com.autoflex.model.Material;
import com.autoflex.model.Product;
import com.autoflex.model.ProductMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {

    public List<ProductionSuggestionDTO> suggestProduction() {
        // 1. Pegar todos os produtos ordenados pelo preço (mais caro primeiro)
        List<Product> products = Product.find("order by price desc").list();
        
        // 2. Carregar o estoque atual num mapa temporário para simulação
        List<Material> allMaterials = Material.listAll();
        Map<Long, Integer> virtualStock = new HashMap<>();
        for (Material m : allMaterials) {
            virtualStock.put(m.id, m.stockQuantity);
        }

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        // 3. Algoritmo Ganancioso
        for (Product product : products) {
            int count = 0;
            boolean canProduce = true;

            // Buscar a "receita" do produto
            List<ProductMaterial> recipe = ProductMaterial.find("product", product).list();
            
            if (recipe.isEmpty()) continue;

            // Tentar produzir o máximo possível deste produto
            while (canProduce) {
                for (ProductMaterial item : recipe) {
                    int currentStock = virtualStock.get(item.material.id);
                    if (currentStock < item.quantityRequired) {
                        canProduce = false;
                        break;
                    }
                }

                if (canProduce) {
                    // "Consumir" o estoque virtual
                    for (ProductMaterial item : recipe) {
                        virtualStock.put(item.material.id, virtualStock.get(item.material.id) - item.quantityRequired);
                    }
                    count++;
                }
            }

            if (count > 0) {
                suggestions.add(new ProductionSuggestionDTO(product.id, product.name, count));
            }
        }

        return suggestions;
    }
}