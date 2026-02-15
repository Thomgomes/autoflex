describe('Products CRUD', () => {
  it('cria → associa 1 material → fecha modal → olha → edita → olha → exclui', () => {
    const stamp = Date.now()
    const productName = `Pão ${stamp}`
    const productEdited = `Pão Editado ${stamp}`

    cy.visit('/')
    cy.get('[data-testid="nav-produtos"]').click()
    cy.url().should('include', '/products')

    cy.contains('button', 'Novo Produto').click()
    cy.get('input[name="name"]').type(productName)
    cy.get('input[name="price"]').type('5.00')
    cy.contains('button', 'Cadastrar Produto e Adicionar Receita').click()

    cy.contains('Composição:').should('be.visible')
    cy.contains(productName).should('be.visible')

    cy.get('[data-testid="recipe-material-select"] option')
      .should('have.length.greaterThan', 1)
      .eq(1)
      .invoke('val')
      .then((val) => {
        cy.get('[data-testid="recipe-material-select"]').select(String(val))
      })

    cy.get('[data-testid="recipe-quantity"]').type('5')
    cy.get('[data-testid="recipe-add"]').click()
    cy.contains('Gasto: 5 un por produto', { timeout: 5000 }).should('exist')

    cy.get('body').type('{esc}')
    cy.contains('Composição:').should('not.exist')

    cy.contains('Produtos').should('be.visible')
    cy.contains(productName).should('be.visible')
    cy.wait(1500)

    cy.contains('tr', productName).within(() => {
      cy.get('button[title="Editar Produto"]').click({ force: true })
    })
    cy.contains('Editar Produto').should('be.visible')
    cy.get('input[name="name"]').clear().type(productEdited)
    cy.get('input[name="price"]').clear().type('7.50')
    cy.contains('button', 'Atualizar Produto').click()

    cy.contains(productEdited).should('be.visible')
    cy.wait(1500)

    cy.contains('tr', productEdited).within(() => {
      cy.get('button[title="Excluir Produto"]').click({ force: true })
    })
    cy.contains('Excluir produto permanentemente?').should('be.visible')
    cy.contains('button', 'Deletar').click()

    cy.contains(productEdited).should('not.exist')
  })
})
