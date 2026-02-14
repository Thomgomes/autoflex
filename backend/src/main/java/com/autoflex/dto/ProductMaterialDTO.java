package com.autoflex.dto;

public record ProductMaterialDTO(
        Long productId,
        Long materialId,
        Integer quantityRequired) {
}