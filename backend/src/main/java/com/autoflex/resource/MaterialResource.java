package com.autoflex.resource;

import com.autoflex.dto.MaterialDTO;
import com.autoflex.model.Material;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MaterialResource {

    @GET
    public List<Material> listAll() {
        return Material.listAll();
    }

    @POST
    @Transactional
    public Material create(MaterialDTO dto) {
        Material material = new Material();
        material.name = dto.name();
        material.stockQuantity = dto.stockQuantity();
        material.persist();
        return material;
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Material update(@PathParam("id") Long id, MaterialDTO dto) {
        Material entity = Material.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.name = dto.name();
        entity.stockQuantity = dto.stockQuantity();
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        Material entity = Material.findById(id);
        if (entity == null) {
            throw new NotFoundException();
        }
        entity.delete();
    }
}