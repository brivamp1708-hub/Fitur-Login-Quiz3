class authPage{
    visit(){
        cy.visit('https://www.saucedemo.com')
    }
    inputUsername(dataUsername){
        cy.get('#user-name').type(dataUsername)
    }
    inputPassword(dataPassword){
        cy.get('#password').type(dataPassword)
    }
    clickLoginBtn(){
        cy.get('.btn_action').click()
    }
    validasiLogin(){
        cy.url().should('include','inventory')
    }
}

export default new authPage()


