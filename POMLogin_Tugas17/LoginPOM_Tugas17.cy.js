/// <reference types="cypress" />

// Import Page Object dan Data
import LoginPage from '../../support/PageObjects/LoginPage';
import loginData from '../../fixtures/LoginData.json';

// Inisialisasi Kredensial
const validUser = loginData.validCredentials.username;
const validPass = loginData.validCredentials.password;
const invalidUser = loginData.invalidCredentials.username;
const invalidPass = loginData.invalidCredentials.password;

describe('POM Login Feature Test - 15 Test Cases', () => {

    // Hook: Mengunjungi halaman sebelum setiap test
    beforeEach(() => {
        LoginPage.visitLoginPage();
    });

    // =======================================================
    // SCENARIO POSITIF (TC 1 - 3)
    // =======================================================

    it('TC-01: Login Berhasil dengan Kredensial Valid', () => {
        // ACT
        LoginPage.login(validUser, validPass);

        // ASSERT
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
    });

    it('TC-02: Login Berhasil menggunakan Tombol Enter', () => {
        // ACT: Ketik password dan tekan {enter}
        LoginPage.fillUsername(validUser);
        LoginPage.passwordInput().type(validPass + '{enter}');

        // ASSERT
        cy.url().should('include', '/dashboard/index');
    });

it('TC-03: Verifikasi Logout dan Re-Login Berhasil (Stable Version)', () => {
        // ACT: Login pertama
        LoginPage.login(validUser, validPass);
        cy.url().should('include', '/dashboard/index');

        // ACT: Logout (Menggunakan aksi yang terpusat)
        cy.get('.oxd-userdropdown-tab').click();
        cy.contains('Logout').click();
        
        // ASSERT: Verifikasi kembali ke halaman login (stabilitas)
        cy.url().should('include', '/auth/login');
        LoginPage.usernameInput().should('be.visible'); // Memastikan elemen input ada

        // ACT: Login kedua (Re-Login)
        LoginPage.login(validUser, validPass);
        
        // ASSERT: Verifikasi masuk kembali ke Dashboard
        cy.url().should('include', '/dashboard/index');
        cy.contains('.oxd-topbar-header-title', 'Dashboard').should('be.visible');
    });

    // =======================================================
    // SCENARIO NEGATIF (TC 4 - 8)
    // =======================================================

    it('TC-04: Login Gagal dengan Username Salah', () => {
        // ACT
        LoginPage.login(invalidUser, validPass);

        // ASSERT
        LoginPage.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-05: Login Gagal dengan Password Salah', () => {
        // ACT
        LoginPage.login(validUser, invalidPass);

        // ASSERT
        LoginPage.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-06: Login Gagal dengan Kredensial Salah Keduanya', () => {
        // ACT
        LoginPage.login(invalidUser, invalidPass);

        // ASSERT
        LoginPage.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-07: Login Gagal - Verifikasi Pesan Error untuk Kredensial Tidak Dikenali', () => {
        // ACT
        LoginPage.login(invalidUser, validPass); 

        // ASSERT
        LoginPage.errorMessage().should('be.visible', { timeout: 7000 }).and('contain', 'Invalid credentials');
        
        // Assertion 2: Memastikan URL masih di halaman login setelah kegagalan
        cy.url().should('include', '/auth/login'); 
    });
    
    it('TC-08: Login Gagal dengan Username yang Sangat Panjang', () => {
        // ACT: Menggunakan string yang sangat panjang
        LoginPage.login("A".repeat(50) + validUser, validPass); 
        
        // ASSERT
        LoginPage.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });

    // =======================================================
    // SCENARIO VALIDASI (TC 9 - 15)
    // =======================================================

    it('TC-09: Validasi Field Kosong (Keduanya)', () => {
        // ACT: Klik tombol login tanpa mengisi apapun
        LoginPage.clickLogin();

        // ASSERT
        LoginPage.requiredMessage(2).should('be.visible').and('contain', 'Required');
        LoginPage.requiredMessage(3).should('be.visible').and('contain', 'Required');
    });

    it('TC-10: Validasi Username Kosong', () => {
        // ACT: Isi password saja, biarkan username kosong
        LoginPage.fillPassword(validPass);
        LoginPage.clickLogin();

        // ASSERT
        LoginPage.requiredMessage(2).should('be.visible').and('contain', 'Required');
    });

    it('TC-11: Validasi Password Kosong', () => {
        // ACT: Isi username saja, biarkan password kosong
        LoginPage.fillUsername(validUser);
        LoginPage.clickLogin();

        // ASSERT
        LoginPage.requiredMessage(3).should('be.visible').and('contain', 'Required');
    });

    it('TC-12: Verifikasi Link "Forgot your password?"', () => {
        // ACT
        LoginPage.forgotPasswordLink().click();

        // ASSERT
        cy.url().should('include', '/requestPasswordReset');
        cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
    });
    
    it('TC-13: Verifikasi Placeholder Username', () => {
        // ASSERT: Memastikan placeholder ada
        LoginPage.usernameInput().should('have.attr', 'placeholder', 'Username');
    });
    
    it('TC-14: Verifikasi Tipe Input Password (Masking)', () => {
        // ASSERT: Memastikan tipe input adalah 'password' untuk masking
        LoginPage.passwordInput().should('have.attr', 'type', 'password');
    });
    
    it('TC-15: Verifikasi Login Gagal dengan Spasi Ekstra', () => {
        // ACT: Login dengan spasi di awal/akhir (asumsi sistem tidak trim)
        LoginPage.login(` ${validUser} `, ` ${validPass} `);
        
        // ASSERT
        LoginPage.errorMessage().should('be.visible').and('contain', 'Invalid credentials');
    });
});
