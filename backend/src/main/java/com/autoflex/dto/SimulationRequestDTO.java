package com.autoflex.dto;

public record SimulationRequestDTO(java.math.BigDecimal price,
        java.util.List<com.autoflex.dto.ProductMaterialDTO> requirements) {
}