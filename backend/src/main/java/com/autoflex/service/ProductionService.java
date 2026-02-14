package com.autoflex.service;

import com.autoflex.dto.ProductionResponseDTO;
import com.autoflex.dto.ProductionSuggestionDTO;
import com.autoflex.model.Material;
import com.autoflex.model.Product;
import com.autoflex.model.ProductMaterial;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionService {

    public List<ProductionSuggestionDTO> suggestProduction() {
        List<Product> products = Product.find("order by price desc").list();

        List<Material> allMaterials = Material.listAll();
        Map<Long, Integer> virtualStock = new HashMap<>();
        for (Material m : allMaterials) {
            virtualStock.put(m.id, m.stockQuantity);
        }

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        for (Product product : products) {
            int count = 0;
            boolean canProduce = true;

            List<ProductMaterial> recipe = ProductMaterial.find("product", product).list();

            if (recipe.isEmpty())
                continue;

            while (canProduce) {
                for (ProductMaterial item : recipe) {
                    int currentStock = virtualStock.get(item.material.id);
                    if (currentStock < item.quantityRequired) {
                        canProduce = false;
                        break;
                    }
                }

                if (canProduce) {
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

        BigDecimal totalValue = BigDecimal.ZERO;
        for (ProductionSuggestionDTO s : suggestions) {
            Product p = Product.findById(s.productId());
            if (p != null && p.price != null) {
                BigDecimal productTotal = p.price.multiply(BigDecimal.valueOf(s.quantityToProduce()));
                totalValue = totalValue.add(productTotal);
            }
        }

        return new ProductionResponseDTO(suggestions, totalValue);
    }
}