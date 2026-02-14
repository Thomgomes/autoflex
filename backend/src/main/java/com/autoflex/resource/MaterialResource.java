package com.autoflex.resource;

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
    public Material create(Material material) {
        material.persist();
        return material;
    }
}