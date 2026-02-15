package com.autoflex.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.autoflex.dto.MaterialDTO;
import com.autoflex.dto.ProductMaterialDTO;
import com.autoflex.dto.SimulationRequestDTO;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

import java.math.BigDecimal;
import java.util.List;

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

    @Test
    @DisplayName("Should simulate item capacity via API")
    public void shouldSimulateItemCapacityViaApi() {
        // 1. Criar material de teste
        String matId = given()
            .contentType(ContentType.JSON)
            .body(new MaterialDTO("Steel", 50))
        .when().post("/materials")
        .then().statusCode(200).extract().path("id").toString();

        // 2. Preparar DTO de Simulação (Necessita 5 unidades para cada 1 produto)
        ProductMaterialDTO requirement = new ProductMaterialDTO(null, Long.valueOf(matId), 5);
        SimulationRequestDTO request = new SimulationRequestDTO(new BigDecimal("100.00"), List.of(requirement));

        given()
            .contentType(ContentType.JSON)
            .body(request)
        .when().post("/production/simulate")
        .then()
            .statusCode(200)
            .body("quantityToProduce", is(10)) // 50 / 5 = 10
            .body("subtotal", is(1000.0f)); // 10 * 100 = 1000
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent material")
    public void shouldReturn404WhenDeletingNonExistentMaterial() {
        given()
                .pathParam("id", 9999L)
                .when()
                .delete("/materials/{id}")
                .then()
                .statusCode(404);
    }
}