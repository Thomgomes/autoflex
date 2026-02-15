package com.autoflex.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductionResponseDTO(
        List<ProductionSuggestionDTO> suggestions,
        BigDecimal totalValue) {
}