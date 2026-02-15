package com.autoflex.resource;

import com.autoflex.dto.ProductDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class ProductResourceTest {

    @Test
    @DisplayName("Should create a new product successfully")
    public void shouldCreateNewProductSuccessfully() {
        ProductDTO newProduct = new ProductDTO("Strawberry Cake", new BigDecimal("45.00"));

        given()
                .contentType(ContentType.JSON)
                .body(newProduct)
                .when().post("/products")
                .then()
                .statusCode(200)
                .body("id", notNullValue())
                .body("name", is("Strawberry Cake"))
                .body("price", is(45.00f));
    }

    @Test
    @DisplayName("Should update an existing product")
    public void shouldUpdateExistingProduct() {
        String createdId = given()
                .contentType(ContentType.JSON)
                .body(new ProductDTO("Old Product", new BigDecimal("10.00")))
                .when().post("/products")
                .then().statusCode(200).extract().path("id").toString();

        ProductDTO updatedData = new ProductDTO("New Product", new BigDecimal("20.00"));

        given()
                .contentType(ContentType.JSON)
                .pathParam("id", Long.valueOf(createdId))
                .body(updatedData)
                .when().put("/products/{id}")
                .then()
                .statusCode(200)
                .body("name", is("New Product"))
                .body("price", is(20.00f));
    }

    @Test
    @DisplayName("Should delete an existing product")
    public void shouldDeleteProduct() {
        String createdId = given()
                .contentType(ContentType.JSON)
                .body(new ProductDTO("Product to Delete", new BigDecimal("10.00")))
                .when().post("/products")
                .then().statusCode(200).extract().path("id").toString();

        given()
                .pathParam("id", Long.valueOf(createdId))
                .when().delete("/products/{id}")
                .then().statusCode(204);
    }
}