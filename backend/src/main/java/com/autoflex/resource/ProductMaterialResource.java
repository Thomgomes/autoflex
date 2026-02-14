package com.autoflex.resource;

import com.autoflex.dto.ProductMaterialDTO;
import com.autoflex.model.Material;
import com.autoflex.model.Product;
import com.autoflex.model.ProductMaterial;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/product-materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductMaterialResource {

    @GET
    @Path("/product/{productId}")
    public List<ProductMaterial> listByProduct(@PathParam("productId") Long productId) {
        return ProductMaterial.find("product.id", productId).list();
    }

    @POST
    @Transactional
    public ProductMaterial addAssociation(ProductMaterialDTO dto) {
        Product product = Product.findById(dto.productId());
        Material material = Material.findById(dto.materialId());

        if (product == null || material == null) {
            throw new NotFoundException("Produto ou Material não encontrado");
        }

        ProductMaterial association = new ProductMaterial();
        association.product = product;
        association.material = material;
        association.quantityRequired = dto.quantityRequired();

        association.persist();
        return association;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public ProductMaterial updateAssociation(@PathParam("id") Long id, ProductMaterialDTO dto) {
        ProductMaterial entity = ProductMaterial.findById(id);
        if (entity == null)
            throw new NotFoundException();

        entity.quantityRequired = dto.quantityRequired();
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        ProductMaterial entity = ProductMaterial.findById(id);
        if (entity == null)
            throw new NotFoundException();
        entity.delete();
    }

    @DELETE
    @Path("/product/{productId}")
    @Transactional
    public void clearRecipe(@PathParam("productId") Long productId) {
        ProductMaterial.delete("product.id", productId);
    }
}