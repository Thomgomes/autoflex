describe("Produto Material CRUD", () => {
  it("cria material → cria produto → adiciona 2 materiais → remove 1 material → fecha", () => {
    const stamp = Date.now();
    const productName = `Bolo ${stamp}`;

    cy.visit("/");

    const mat1 = `Farinha ${stamp}`;
    const mat2 = `Açúcar ${stamp}`;

    cy.get('[data-testid="nav-materiais"]').click();

    cy.contains("button", "Novo Material").click();
    cy.get('input[name="name"]').type(mat1);
    cy.get('input[name="stockQuantity"]').type("1000");
    cy.get('button[type="submit"]').click();
    cy.contains(mat1).should("exist");

    cy.contains("button", "Novo Material").click();
    cy.get('input[name="name"]').type(mat2);
    cy.get('input[name="stockQuantity"]').type("500");
    cy.get('button[type="submit"]').click();
    cy.contains(mat2).should("exist");

    cy.get('[data-testid="nav-produtos"]').click();
    cy.contains("button", "Novo Produto").click();
    cy.get('input[name="name"]').type(productName);
    cy.get('input[name="price"]').type("25.00");
    cy.contains("button", "Cadastrar Produto e Adicionar Receita").click();

    cy.contains("Composição:").should("be.visible");
    cy.contains(productName).should("be.visible");

    cy.get('[data-testid="recipe-material-select"] option')
      .contains(mat1)
      .invoke("val")
      .then((val) => {
        cy.get('[data-testid="recipe-material-select"]').select(String(val));
      });
    cy.get('[data-testid="recipe-quantity"]').clear().type("5");
    cy.get('[data-testid="recipe-add"]').click();
    cy.contains("Gasto: 5 un por produto", { timeout: 10000 }).should("exist");

    cy.get('[data-testid="recipe-material-select"] option')
      .contains(mat2)
      .invoke("val")
      .then((val) => {
        cy.get('[data-testid="recipe-material-select"]').select(String(val));
      });
    cy.get('[data-testid="recipe-quantity"]').clear().type("2");
    cy.get('[data-testid="recipe-add"]').click();
    cy.contains("Gasto: 2 un por produto", { timeout: 10000 }).should("exist");

    cy.get("body").click("topLeft", { force: true });
    cy.contains("Composição:").should("not.exist");

    cy.contains(productName).should("be.visible");
    cy.wait(1500);

    cy.contains("tr", productName).within(() => {
      cy.get('button[title="Gerenciar Receita"]').click({ force: true });
    });

    cy.contains("Composição:").should("be.visible");
    cy.contains(productName).should("be.visible");

    cy.contains("p", mat2, { timeout: 10000 })
      .parents("div")
      .filter(":has(button)")
      .first()
      .within(() => {
        cy.get("button").click({ force: true });
      });

    cy.contains("Gasto: 2 un por produto", { timeout: 15000 }).should(
      "not.exist",
    );

    cy.get("body").type("{esc}");
    cy.contains("Composição:").then(($t) => {
      if ($t.length) cy.get("body").click("topLeft", { force: true });
    });
    cy.contains("Composição:").should("not.exist");
  });
});
