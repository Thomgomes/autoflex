package com.autoflex.dto;

import java.math.BigDecimal;

public record ProductionSuggestionDTO(
        Long productId,
        String productName,
        Integer quantityToProduce,
        BigDecimal subtotal) {
}