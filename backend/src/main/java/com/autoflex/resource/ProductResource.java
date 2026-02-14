package com.autoflex.resource;

import com.autoflex.dto.ProductDTO;
import com.autoflex.dto.ProductMaterialDTO;
import com.autoflex.model.Material;
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

    @POST
    @Path("/{productId}/materials")
    @Transactional
    public ProductMaterial addMaterialToProduct(@PathParam("productId") Long productId, ProductMaterialDTO dto) {
        Product product = Product.findById(productId);
        Material material = Material.findById(dto.materialId());

        if (product == null || material == null) {
            throw new NotFoundException("Product or Material not found");
        }

        ProductMaterial association = new ProductMaterial();
        association.product = product;
        association.material = material;
        association.quantityRequired = dto.quantityRequired();
        
        association.persist();
        return association;
    }
}