/// <reference types="cypress" />

// Base URL Login OrangeHRM
const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

describe('OrangeHRM Login Feature (12 Test Cases)', () => {
    // Kredensial Valid
    const validUsername = 'Admin';
    const validPassword = 'admin123';

    // Hook: Kunjungi halaman login sebelum setiap test
    beforeEach(() => {
        cy.visit(LOGIN_URL);
        // Assert: Memastikan form login terlihat
        cy.get('.orangehrm-login-container').should('be.visible');
    });

    // =======================================================
    // SCENARIO POSITIF
    // =======================================================

    it('TC-01: Login dengan Kredensial Valid', () => {
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi masuk ke Dashboard
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
    });

    // =======================================================
    // SCENARIO NEGATIF (Kredensial Salah)
    // =======================================================

    it('TC-02: Login dengan Password Salah', () => {
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type('salahpass'); // Password salah
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi pesan error
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-03: Login dengan Username Salah', () => {
        cy.get('input[name="username"]').type('WrongUser'); // Username salah
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi pesan error
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-04: Login dengan Kredensial Kosong (Kedua Field)', () => {
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi pesan Required di kedua field
        cy.get(':nth-child(2) > .oxd-input-group > .oxd-text').should('contain', 'Required');
        cy.get(':nth-child(3) > .oxd-input-group > .oxd-text').should('contain', 'Required');
    });

    // =======================================================
    // SCENARIO VALIDASI (Field Kosong)
    // =======================================================

    it('TC-05: Validasi Username Kosong', () => {
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Pesan Required hanya di field Username
        cy.get(':nth-child(2) > .oxd-input-group > .oxd-text').should('contain', 'Required');
    });

    it('TC-06: Validasi Password Kosong', () => {
        cy.get('input[name="username"]').type(validUsername);
        cy.get('button[type="submit"]').click();

        // ASSERT: Pesan Required hanya di field Password
        cy.get(':nth-child(3) > .oxd-input-group > .oxd-text').should('contain', 'Required');
    });

    // =======================================================
    // SCENARIO BATAS & KEAMANAN
    // =======================================================

    it('TC-07: Login dengan Username yang Tidak Ada (Angka/ID)', () => {
        cy.get('input[name="username"]').type('999999'); // ID yang tidak terdaftar
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi pesan error
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-08: Login dengan Spasi Ekstra (Trim Test)', () => {
        cy.get('input[name="username"]').type(` ${validUsername} `);
        cy.get('input[name="password"]').type(` ${validPassword} `);
        cy.get('button[type="submit"]').click();

        // ASSERT: Muncul pesan error (asumsi sistem tidak trim spasi)
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    // =======================================================
    // SCENARIO FUNGSIONAL DAN UI
    // =======================================================

    it('TC-09: Memverifikasi Teks Placeholder', () => {
        // ASSERT: Placeholder Username terlihat
        cy.get('input[name="username"]').invoke('attr', 'placeholder').should('equal', 'Username');
        // ASSERT: Placeholder Password terlihat
        cy.get('input[name="password"]').invoke('attr', 'placeholder').should('equal', 'Password');
    });

    it('TC-10: Memverifikasi link "Forgot your password?"', () => {
        cy.get('.orangehrm-login-forgot > .oxd-text').should('be.visible').and('contain', 'Forgot your password?').click();

        // ASSERT: Navigasi ke halaman Reset Password
        cy.url().should('include', '/requestPasswordReset');
        cy.get('.orangehrm-forgot-password-title').should('contain', 'Reset Password');
    });

    it('TC-11: Login setelah Navigasi Balik', () => {
        // Langkah 1: Navigasi ke halaman lain
        cy.get('.orangehrm-login-forgot > .oxd-text').click();
        cy.url().should('include', '/requestPasswordReset');

        // Langkah 2: Navigasi Balik
        cy.go('back');
        cy.url().should('include', '/auth/login');

        // Langkah 3: Coba login valid (untuk memastikan state browser bersih)
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Login berhasil
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-12: Verifikasi Elemen UI Utama (Logo dan Tombol)', () => {
        // ASSERT: Logo OrangeHRM terlihat
        cy.get('.orangehrm-login-logo > img').should('be.visible');
        // ASSERT: Tombol Login terlihat
        cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
    });
    // ... Lanjutan dari kode sebelumnya (setelah TC-12)

    // =======================================================
    // SCENARIO BATAS, KEAMANAN & SPESIFIK LAINNYA
    // =======================================================

    it('TC-13: Login dengan Password yang Terlalu Pendek', () => {
        // ACT: Password 1 karakter
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type('a'); 
        cy.get('button[type="submit"]').click();

        // ASSERT: Verifikasi pesan error
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-14: Login dengan Username Maksimal (Test Batas Karakter)', () => {
        // ACT: Asumsi batas karakter tinggi, coba masukkan string yang sangat panjang
        const longUsername = 'A'.repeat(50); 
        cy.get('input[name="username"]').type(longUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Harus gagal/error karena username ini tidak terdaftar
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-15: Login menggunakan Karakter Spesial di Password yang Salah', () => {
        // ACT: Coba login dengan kombinasi karakter spesial
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type('password!@#$'); 
        cy.get('button[type="submit"]').click();

        // ASSERT: Harus gagal/error karena password ini tidak terdaftar
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });

    it('TC-16: Memverifikasi Fokus Otomatis pada Field Username', () => {
        // ASSERT: Cek elemen yang sedang memiliki fokus (aktif)
        // 'have.focus' memastikan bahwa elemen tersebut adalah elemen yang aktif
        cy.get('input[name="username"]').should('have.focus');
    });

    it('TC-17: Login dengan menekan Tombol Enter', () => {
        // ACT: Isi username dan password, lalu tekan {enter} pada field password
        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword + '{enter}'); // Menekan Enter

        // ASSERT: Verifikasi masuk ke Dashboard
        cy.url().should('include', '/dashboard/index');
        cy.get('.oxd-topbar-header-title').should('contain', 'Dashboard');
    });

    it('TC-18: Memverifikasi Tampilan Password (Masking)', () => {
        // ACT: Isi password
        cy.get('input[name="password"]').type(validPassword);
        
        // ASSERT: Verifikasi atribut 'type' adalah 'password' (untuk masking)
        cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });
    
    it('TC-19: Login dengan Username Case Sensitive (Kapitalisasi Salah)', () => {
        // ACT: Username seharusnya 'Admin', kita coba 'admin'
        cy.get('input[name="username"]').type('admin'); 
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Harus gagal karena username adalah case sensitive
        cy.get('.oxd-alert-content-text').should('be.visible').and('contain', 'Invalid credentials');
    });
});

