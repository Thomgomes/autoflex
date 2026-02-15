package com.autoflex.service;

import com.autoflex.dto.ProductMaterialDTO;
import com.autoflex.dto.ProductionSuggestionDTO;
import com.autoflex.dto.ProductionResponseDTO;
import com.autoflex.model.Material;
import com.autoflex.model.Product;
import com.autoflex.model.ProductMaterial;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
public class ProductionServiceTest {

    @Inject
    ProductionService productionService;

    @BeforeEach
    @Transactional
    public void setup() {
        ProductMaterial.deleteAll();
        Product.deleteAll();
        Material.deleteAll();
    }

    @Test
    @Transactional
    @DisplayName("Should calculate correct capacity based on material stock")
    public void shouldCalculateCorrectCapacityBasedOnMaterialStock() {
        Material material = new Material();
        material.name = "Test Input";
        material.stockQuantity = 50;
        material.persist();

        BigDecimal productPrice = new BigDecimal("10.00");
        ProductMaterialDTO requirement = new ProductMaterialDTO(null, material.id, 5);
        List<ProductMaterialDTO> requirements = List.of(requirement);

        ProductionSuggestionDTO result = productionService.simulateItemCapacity(productPrice, requirements);

        assertEquals(10, result.quantityToProduce());
        assertEquals(new BigDecimal("100.00"), result.subtotal());
    }

    @Test
    @Transactional
    @DisplayName("Should prioritize higher value product when stock is limited")
    public void shouldPrioritizeHigherValueProductWhenStockIsLimited() {
        Material material = new Material();
        material.name = "Shared Material";
        material.stockQuantity = 10;
        material.persist();

        Product expensiveProduct = new Product();
        expensiveProduct.name = "Expensive Product";
        expensiveProduct.price = new BigDecimal("100.00");
        expensiveProduct.persist();

        ProductMaterial expensiveRecipe = new ProductMaterial();
        expensiveRecipe.product = expensiveProduct;
        expensiveRecipe.material = material;
        expensiveRecipe.quantityRequired = 6;
        expensiveRecipe.persist();

        Product cheapProduct = new Product();
        cheapProduct.name = "Cheap Product";
        cheapProduct.price = new BigDecimal("50.00");
        cheapProduct.persist();

        ProductMaterial cheapRecipe = new ProductMaterial();
        cheapRecipe.product = cheapProduct;
        cheapRecipe.material = material;
        cheapRecipe.quantityRequired = 6;
        cheapRecipe.persist();

        ProductionResponseDTO result = productionService.suggestProduction();

        assertEquals(1, result.suggestions().size());
        assertEquals("Expensive Product", result.suggestions().get(0).productName());
    }

    @Test
    @Transactional
    @DisplayName("Should not suggest production for products without recipe")
    public void shouldNotSuggestProductionForProductsWithoutRecipe() {
        Product ghostProduct = new Product();
        ghostProduct.name = "Ghost Product";
        ghostProduct.price = new BigDecimal("100.00");
        ghostProduct.persist();

        ProductionResponseDTO result = productionService.suggestProduction();

        boolean containsProduct = result.suggestions().stream()
            .anyMatch(s -> s.productName().equals("Ghost Product"));
            
        assertEquals(false, containsProduct);
    }
}