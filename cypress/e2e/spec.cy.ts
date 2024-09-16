describe('template spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  });

  it('Check texts', () => {
    cy.contains("Product List");
    cy.contains("Name");
    cy.contains("Price");
    cy.contains("Category");
    cy.contains("Stock");
    cy.contains("Actions");
    cy.contains("Items per page");
  })

  it('Filter by name', () => {
    cy.get('#filter_name').type("milk");
    cy.contains("Milk");
    cy.contains("Vino").should('not.exist');
  })

  it('Filter by name - not results', () => {
    cy.get('#filter_name').type("aaaaa");
    cy.contains("0 of 0");
  })

  it('Filter by price', () => {
    cy.get('#filter_price').type("2");
    cy.contains("Milk").should('not.exist');
    cy.contains("Vino");
  })

  it('Filter by stock', () => {
    cy.get('#filter_stock').type("25");
    cy.contains("Milk").should('not.exist');
    cy.contains("Vino");
  })

  it('Goto new product page', () => {
    cy.get('button.mat-primary').click();
    cy.contains("New product");
  })

  it('Goto new product page and cancel', () => {
    cy.get('button.mat-primary').click();
    cy.contains("New product");
    cy.get('.mat-unthemed').click();
    cy.contains("Product List");
  })

  it('New product form errors', () => {
    cy.get('button.mat-primary').click();
    cy.get('.button-save').click();
    cy.contains("Name is required");
    cy.contains("Price must be greater than 0");
    cy.contains("Category is required");
  })

  it('New product', () => {
    cy.get('button.mat-primary').click();
    cy.get('#mat-input-3').type("Test Cypress");
    cy.get('#mat-input-4').type("2");
    cy.get('#mat-input-6').type("2");
    cy.get('#mat-input-5').type("Test description");
    cy.get('.mat-mdc-select').click();
    cy.get('.mat-mdc-option').eq(0).click();
    
    cy.get('.button-save').click();
    cy.contains("Create new product");
    cy.contains("Would you like to create this new product?");

    cy.get('.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base').eq(2).click();
    cy.contains("Product added");
    cy.contains("Product List");
  })

  it('Goto edit product page', () => {
    cy.get('#filter_name').type("Test Cypress");
    cy.contains("1 – 1 of 1");
    cy.get('.mat-icon.notranslate.icon-pointer.material-icons.mat-ligature-font.mat-icon-no-color').eq(0).click();
    cy.contains("Edit product");
  })

  it('Edit product', () => {
    cy.get('#filter_name').type("Test Cypress");
    cy.get('.mat-icon.notranslate.icon-pointer.material-icons.mat-ligature-font.mat-icon-no-color').eq(0).click();
    cy.get('#mat-input-4').type("5");
    cy.get('#mat-input-5').type(" edit");
    
    cy.get('.button-save').click();
    cy.contains("Edit product");
    cy.contains("Would you like to edit this product?");

    cy.get('.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base').eq(2).click();
    cy.contains("Updated product");
    cy.contains("Product List");
  })

  it('Delete product', () => {
    cy.get('#filter_name').type("Test Cypress");
    cy.contains("1 – 1 of 1");
    cy.get('.mat-icon.notranslate.icon-pointer.material-icons.mat-ligature-font.mat-icon-no-color').eq(1).click();
    cy.contains("Delete product");
    cy.contains("Would you like to delete this product?");
    cy.get('.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base').eq(1).click();
    cy.contains("Product removed");
    cy.contains("0 of 0");
  })

})