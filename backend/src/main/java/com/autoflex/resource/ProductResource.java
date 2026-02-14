package com.autoflex.resource;

import com.autoflex.dto.ProductDTO;
import com.autoflex.model.Product;
import com.autoflex.model.ProductMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductResource {

    @GET
    public List<Product> listAll() {
        return Product.listAll();
    }

    @POST
    @Transactional
    public Product create(ProductDTO dto) {
        Product product = new Product();
        product.name = dto.name();
        product.price = dto.price();
        product.persist();
        return product;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, ProductDTO dto) {
        Product entity = Product.findById(id);
        if (entity == null)
            throw new NotFoundException();
        entity.name = dto.name();
        entity.price = dto.price();
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null)
            throw new NotFoundException();

        ProductMaterial.delete("product.id", id);
        entity.delete();
    }
}