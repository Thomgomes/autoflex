package com.autoflex.dto;

public record ProductionSuggestionDTO(
        Long productId,
        String productName,
        Integer quantityToProduce) {
}