describe("Candy Flow - Doceria", () => {
  it("cadastra 6 materiais, 5 produtos, associa 3 materiais e vai ao dashboard", () => {
    const stamp = Date.now();

    const mats = [
      { name: `Leite Condensado ${stamp}`, stock: "2000" },
      { name: `Manteiga ${stamp}`, stock: "1000" },
      { name: `Chocolate em Pó ${stamp}`, stock: "1200" },
      { name: `Coco Ralado ${stamp}`, stock: "900" },
      { name: `Ovos ${stamp}`, stock: "600" },
      { name: `Açúcar ${stamp}`, stock: "1500" },
    ];

    cy.visit("/");

    cy.get('[data-testid="nav-materiais"]').click();

    mats.forEach((m) => {
      cy.contains("button", "Novo Material").click();
      cy.get('input[name="name"]').clear().type(m.name);
      cy.get('input[name="stockQuantity"]').clear().type(m.stock);
      cy.get('button[type="submit"]').click();
      cy.contains(m.name).should("exist");
    });

    const products = [
      {
        name: `Brigadeiro ${stamp}`,
        price: "3.50",
        recipe: [
          { material: mats[0].name, qty: "10" },
          { material: mats[1].name, qty: "2" },
          { material: mats[2].name, qty: "3" },
        ],
      },
      {
        name: `Beijinho ${stamp}`,
        price: "3.20",
        recipe: [
          { material: mats[0].name, qty: "10" },
          { material: mats[1].name, qty: "2" },
          { material: mats[3].name, qty: "3" },
        ],
      },
      {
        name: `Brownie ${stamp}`,
        price: "8.90",
        recipe: [
          { material: mats[2].name, qty: "4" },
          { material: mats[4].name, qty: "2" },
          { material: mats[5].name, qty: "5" },
        ],
      },
      {
        name: `Quindim ${stamp}`,
        price: "6.50",
        recipe: [
          { material: mats[4].name, qty: "3" },
          { material: mats[5].name, qty: "4" },
          { material: mats[3].name, qty: "3" },
        ],
      },
      {
        name: `Trufa ${stamp}`,
        price: "7.20",
        recipe: [
          { material: mats[2].name, qty: "5" },
          { material: mats[1].name, qty: "2" },
          { material: mats[5].name, qty: "2" },
        ],
      },
    ];

    const selectMaterialByName = (materialName: string) => {
      cy.get('[data-testid="recipe-material-select"] option')
        .contains(materialName)
        .invoke("val")
        .then((val) => {
          cy.get('[data-testid="recipe-material-select"]').select(String(val));
        });
    };

    const addRecipeItem = (materialName: string, qty: string) => {
      selectMaterialByName(materialName);
      cy.get('[data-testid="recipe-quantity"]').clear().type(qty);
      cy.get('[data-testid="recipe-add"]').click();
      cy.contains(`Gasto: ${qty} un por produto`, { timeout: 10000 }).should(
        "exist",
      );
    };

    cy.get('[data-testid="nav-produtos"]').click();

    products.forEach((p) => {
      cy.contains("button", "Novo Produto").click();
      cy.get('input[name="name"]').clear().type(p.name);
      cy.get('input[name="price"]').clear().type(p.price);
      cy.contains("button", "Cadastrar Produto e Adicionar Receita").click();

      cy.contains("Composição:").should("be.visible");
      cy.contains(p.name).should("be.visible");

      p.recipe.forEach((r) => addRecipeItem(r.material, r.qty));

      cy.get("body").click("topLeft", { force: true });
      cy.contains("Composição:").should("not.exist");

      cy.contains(p.name).should("exist");
      cy.wait(300);
    });

    cy.get('[data-testid="nav-dashboard"]').click();

    cy.url().should("eq", `${Cypress.config("baseUrl")}/`);
    cy.intercept("GET", "**/api/production/suggestion").as("suggestion");
    cy.wait("@suggestion").its("response.statusCode").should("eq", 200);
    cy.contains(/dashboard/i).should("exist");
  });
});
