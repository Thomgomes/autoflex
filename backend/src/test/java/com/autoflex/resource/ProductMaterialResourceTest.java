package com.autoflex.resource;

import com.autoflex.dto.MaterialDTO;
import com.autoflex.dto.ProductDTO;
import com.autoflex.dto.ProductMaterialDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class ProductMaterialResourceTest {

    @Test
    @DisplayName("Should associate material to product successfully")
    public void shouldAssociateMaterialToProductSuccessfully() {
        String matIdStr = given()
            .contentType(ContentType.JSON)
            .body(new MaterialDTO("Wood", 100))
        .when().post("/materials")
        .then().statusCode(200).extract().path("id").toString();
        
        Long materialId = Long.valueOf(matIdStr);

        String prodIdStr = given()
            .contentType(ContentType.JSON)
            .body(new ProductDTO("Table", new BigDecimal("150.00")))
        .when().post("/products")
        .then().statusCode(200).extract().path("id").toString();
        
        Long productId = Long.valueOf(prodIdStr);

        ProductMaterialDTO association = new ProductMaterialDTO(productId, materialId, 4);

        given()
            .contentType(ContentType.JSON)
            .body(association)
        .when().post("/product-materials")
        .then()
            .statusCode(200)
            .body("id", notNullValue())
            .body("quantityRequired", is(4));
    }

    @Test
    @DisplayName("Should update material quantity in a recipe")
    public void shouldUpdateMaterialQuantityInRecipe() {
        // 1. Setup: Criar material e produto
        String matId = given().contentType(ContentType.JSON).body(new MaterialDTO("Steel", 50))
            .when().post("/materials").then().extract().path("id").toString();
        String prodId = given().contentType(ContentType.JSON).body(new ProductDTO("Tool", new BigDecimal("10.00")))
            .when().post("/products").then().extract().path("id").toString();

        // 2. Criar associação inicial (4 unidades)
        String assocId = given()
            .contentType(ContentType.JSON)
            .body(new ProductMaterialDTO(Long.valueOf(prodId), Long.valueOf(matId), 4))
        .when().post("/product-materials")
        .then().extract().path("id").toString();

        // 3. Atualizar para 10 unidades
        ProductMaterialDTO updatedDto = new ProductMaterialDTO(null, null, 10);

        given()
            .contentType(ContentType.JSON)
            .pathParam("id", Long.valueOf(assocId))
            .body(updatedDto)
        .when().put("/product-materials/{id}")
        .then()
            .statusCode(200)
            .body("quantityRequired", is(10));
    }

    @Test
    @DisplayName("Should clear entire product recipe")
    public void shouldClearEntireProductRecipe() {
        given()
            .pathParam("productId", 1L)
        .when().delete("/product-materials/product/{productId}")
        .then().statusCode(204);
    }
}