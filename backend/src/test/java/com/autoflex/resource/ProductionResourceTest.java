package com.autoflex.resource;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class ProductionResourceTest {

    @Test
    @DisplayName("Should return production suggestion for Dashboard")
    public void shouldReturnProductionSuggestionForDashboard() {
        given()
        .when()
            .get("/production/suggestion")
        .then()
            .statusCode(200)
            .body("totalValue", notNullValue())
            .body("suggestions", notNullValue());
    }
}