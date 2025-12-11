class LoginPage {
    // 1. SELECTORS (Elemen UI)
    usernameInput() {
        return cy.get('input[name="username"]');
    }

    passwordInput() {
        return cy.get('input[name="password"]');
    }

    loginButton() {
        return cy.get('button[type="submit"]');
    }

    errorMessage() {
        return cy.get('.oxd-alert-content-text');
    }

    requiredMessage(fieldIndex) {
        // fieldIndex 2 untuk Username, 3 untuk Password
        return cy.get(`:nth-child(${fieldIndex}) > .oxd-input-group > .oxd-text`);
    }

    forgotPasswordLink() {
        return cy.get('.orangehrm-login-forgot > .oxd-text');
    }

    // 2. ACTIONS (Fungsi yang berinteraksi dengan UI)

    visitLoginPage() {
        // Menggunakan URL penuh sebagai perbaikan yang paling stabil untuk menghindari error 'cy.visit'
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'); 
        
        // Memastikan elemen kunci di halaman sudah dimuat sebelum melanjutkan
        this.usernameInput().should('be.visible'); 
    }
    
    fillUsername(username) {
        this.usernameInput().type(username);
    }
    
    fillPassword(password) {
        this.passwordInput().type(password);
    }

    clickLogin() {
        this.loginButton().click();
    }

    login(username, password) {
        this.fillUsername(username);
        this.fillPassword(password);
        this.clickLogin();
    }
}

export default new LoginPage()
