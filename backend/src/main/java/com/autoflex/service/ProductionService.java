package com.autoflex.service;

import com.autoflex.dto.ProductMaterialDTO;
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

    public ProductionResponseDTO suggestProduction() {
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
                    Integer currentStock = virtualStock.get(item.material.id);
                    if (currentStock == null || currentStock < item.quantityRequired) {
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
                BigDecimal itemSubtotal = product.price.multiply(BigDecimal.valueOf(count));

                suggestions.add(new ProductionSuggestionDTO(product.id, product.name, count, itemSubtotal));
            }
        }

        BigDecimal totalValue = BigDecimal.ZERO;
        for (ProductionSuggestionDTO s : suggestions) {
            Product p = Product.findById(s.productId());
            if (p != null && p.price != null) {
                totalValue = totalValue.add(p.price.multiply(BigDecimal.valueOf(s.quantityToProduce())));
            }
        }

        return new ProductionResponseDTO(suggestions, totalValue);
    }

    public ProductionSuggestionDTO simulateItemCapacity(BigDecimal price, List<ProductMaterialDTO> requirements) {
        if (requirements == null || requirements.isEmpty() || price == null) {
            return new ProductionSuggestionDTO(null, "Simulação", 0, BigDecimal.ZERO);
        }

        int maxCount = Integer.MAX_VALUE;

        for (ProductMaterialDTO req : requirements) {
            Material material = Material.findById(req.materialId());
            if (material != null && req.quantityRequired() != null && req.quantityRequired() > 0) {
                int possible = material.stockQuantity / req.quantityRequired();
                if (possible < maxCount)
                    maxCount = possible;
            } else {
                maxCount = 0;
                break;
            }
        }

        if (maxCount == Integer.MAX_VALUE)
            maxCount = 0;
        BigDecimal subtotal = price.multiply(BigDecimal.valueOf(maxCount));

        return new ProductionSuggestionDTO(null, "Simulação Individual", maxCount, subtotal);
    }
}
