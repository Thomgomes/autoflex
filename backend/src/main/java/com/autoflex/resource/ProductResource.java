package com.autoflex.resource;

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
    public Product create(Product product) {
        product.persist();
        return product;
    }

    @POST
    @Path("/{productId}/materials")
    @Transactional
    public ProductMaterial addMaterialToProduct(@PathParam("productId") Long productId, ProductMaterial association) {
        Product product = Product.findById(productId);
        if (product == null) {
            throw new NotFoundException("Product not found");
        }
        
        association.product = product;
        association.persist();
        return association;
    }
}