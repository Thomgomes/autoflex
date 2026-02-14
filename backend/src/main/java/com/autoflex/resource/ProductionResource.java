package com.autoflex.resource;

import com.autoflex.dto.ProductionResponseDTO;
import com.autoflex.service.ProductionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {

    @Inject
    ProductionService productionService;

    @GET
    @Path("/suggestion")
    public ProductionResponseDTO getSuggestion() {
        return productionService.suggestProduction();
    }
}