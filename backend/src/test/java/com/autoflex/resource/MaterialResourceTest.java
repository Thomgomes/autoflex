package com.autoflex.resource;

import com.autoflex.dto.MaterialDTO;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class MaterialResourceTest {

    @Test
    @DisplayName("Should create a new material successfully via API")
    public void shouldCreateNewMaterialSuccessfullyViaApi() {
        MaterialDTO newMaterial = new MaterialDTO("Stainless Steel", 100);

        given()
            .contentType(ContentType.JSON)
            .body(newMaterial)
        .when()
            .post("/materials")
        .then()
            .statusCode(200)
            .body("id", notNullValue())
            .body("name", is("Stainless Steel"))
            .body("stockQuantity", is(100));
    }

    @Test
    @DisplayName("Should update an existing material")
    public void shouldUpdateExistingMaterial() {
        String createdId = given()
            .contentType(ContentType.JSON)
            .body(new MaterialDTO("Base Material", 10))
        .when().post("/materials")
        .then().statusCode(200).extract().path("id").toString();

        MaterialDTO updatedData = new MaterialDTO("Updated Material", 99);

        given()
            .contentType(ContentType.JSON)
            .pathParam("id", Long.valueOf(createdId))
            .body(updatedData)
        .when().put("/materials/{id}")
        .then()
            .statusCode(200)
            .body("name", is("Updated Material"))
            .body("stockQuantity", is(99));
    }

    @Test
    @DisplayName("Should delete an existing material")
    public void shouldDeleteExistingMaterial() {
        String createdId = given()
            .contentType(ContentType.JSON)
            .body(new MaterialDTO("Material to Delete", 10))
        .when().post("/materials")
        .then().statusCode(200).extract().path("id").toString();

        given()
            .pathParam("id", Long.valueOf(createdId))
        .when().delete("/materials/{id}")
        .then().statusCode(204);
    }
}