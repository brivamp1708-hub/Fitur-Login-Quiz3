import authPage from "../../support/PageObjects/pageloginSAUCE"
import authData from "../../fixtures/datamasukSACUE.json"

describe ('Skenario Verifikasi Fungi Login', () => {
    it ('TC001-Login dengan username Valid & password Valid', () => {

        //cy.visit('https://www.saucedemo.com')
        //cy.get('#user-name').type('standard_user')
        //cy.get('#password').type('secret_sauce')
        //cy.get('.btn_action').click()
        //cy.url().should('include','inventory')

        authPage.visit()    
        authPage.inputUsername(authData.validUsername)
        authPage.inputPassword(authData.validPassword)
        authPage.clickLoginBtn()
        authPage.validasiLogin()
    })

    it ('TC002-Login dengan username Invalid & Password Invalid', () =>{
        authPage.visit()    
        authPage.inputUsername(authData.invalidUsername)
        authPage.inputPassword(authData.invalidPassword)
        authPage.clickLoginBtn()
    })


})


