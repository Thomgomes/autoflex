describe('Fluxo de Navegação Autoflex', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve navegar entre as telas principais pela sidebar', () => {
    // 1. Validar Dashboard
    cy.contains('Autoflex').should('be.visible');
    
    // 2. Ir para Materiais
    cy.get('[data-testid="nav-materiais"]').click();
    cy.url().should('include', '/materials');
    cy.contains('Materiais de Produção').should('be.visible');

    // 3. Ir para Produtos
    cy.get('[data-testid="nav-produtos"]').click();
    cy.url().should('include', '/products');
    cy.contains('Catálogo de Produtos').should('be.visible');
  });
});