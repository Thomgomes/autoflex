describe("Materiais CRUD", () => {
  it("cria → lista → edita → lista → deleta", () => {
    const stamp = Date.now();
    const materialName = `Farinha ${stamp}`;
    const materialNameEdited = `Farinha Editada ${stamp}`;

    cy.visit("/");
    cy.get('[data-testid="nav-materiais"]').click();
    cy.url().should("include", "/materials");

    cy.contains("button", "Novo Material").click();
    cy.get('input[name="name"]').clear().type(materialName);
    cy.get('input[name="stockQuantity"]').clear().type("1000");
    cy.get('button[type="submit"]').click();

    cy.contains(materialName).should("be.visible");
    cy.wait(1500);

    cy.contains("tr", materialName).within(() => {
      cy.get('button[title*="Editar"]').click({ force: true });
    });

    cy.contains(/editar material/i).should("be.visible");
    cy.get('input[name="name"]').clear().type(materialNameEdited);
    cy.get('input[name="stockQuantity"]').clear().type("500");
    cy.get('button[type="submit"]').click();

    cy.contains(materialNameEdited).should("be.visible");
    cy.wait(1500);

    cy.contains("tr", materialNameEdited).within(() => {
      cy.get('button[title*="Excluir"]').click({ force: true });
    });

    cy.contains("button", /deletar/i).click();

    cy.contains(materialNameEdited).should("not.exist");
  });
});
