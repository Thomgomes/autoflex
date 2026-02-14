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

    @PUT
    @Path("/{id}")
    @Transactional
    public Product update(@PathParam("id") Long id, ProductDTO dto) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Produto não encontrado");
        }
        entity.name = dto.name();
        entity.price = dto.price();
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Produto não encontrado");
        }
        entity.delete();
    }

    @GET
    @Path("/{productId}/materials")
    public List<ProductMaterial> getRecipe(@PathParam("productId") Long productId) {
        return ProductMaterial.find("product.id", productId).list();
    }

    @POST
    @Path("/{productId}/materials")
    @Transactional
    public ProductMaterial addMaterial(@PathParam("productId") Long productId, ProductMaterialDTO dto) {
        Product product = Product.findById(productId);
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

    @DELETE
    @Path("/materials/{associationId}")
    @Transactional
    public void removeMaterialFromRecipe(@PathParam("associationId") Long associationId) {
        ProductMaterial entity = ProductMaterial.findById(associationId);
        if (entity == null) {
            throw new NotFoundException("Associação não encontrada");
        }
        entity.delete();
    }
}