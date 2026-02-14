package com.autoflex.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "materials")
public class Material extends PanacheEntity {

    public String name;

    @Column(name = "stock_quantity")
    public Integer stockQuantity;
}