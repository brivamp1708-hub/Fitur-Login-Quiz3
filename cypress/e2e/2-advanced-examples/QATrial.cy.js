describe ('Scenario Login', () => {
    it('TC-001 - Login dengan username dan password valid', () => {
        cy.visit('https://www.saucedemo.com/')
        cy.get('#user-name').type('standard_user')
        cy.get('#password').type('secret_sauce')
        cy.get('#login-button').click()
        cy.url().should('include','inventory')
})
 it('TC-001 - Login dengan username dan password tidak valid', () => {
        cy.visit('https://www.saucedemo.com/')
        cy.get('#user-name').type('standard_user')
        cy.get('#password').type('wrong_password')
        cy.get('#login-button').click()
    })
})

