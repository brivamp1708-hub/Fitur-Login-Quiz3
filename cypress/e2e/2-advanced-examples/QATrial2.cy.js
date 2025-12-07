describe ('Scenario Login', () => {
    it('TC-001 - Login dengan username dan password valid', () => {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login/')
        cy.get('#user-name').type('Admin')
        cy.get('#password').type('admin123')
        cy.get('#login-button').click()
        cy.url().should('include','inventory')
    })
})

