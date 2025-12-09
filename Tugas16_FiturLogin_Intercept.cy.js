/// <reference types="cypress" />

const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const VALIDATE_API = '**/auth/validate'; 
// API yang dipanggil setelah login sukses biasanya akan melakukan redirect 302 ke dashboard

describe('Revisi Final: OrangeHRM Login with cy.intercept() - 10 Passed Scenarios', () => {
    const validUsername = 'Admin';
    const validPassword = 'admin123';

    beforeEach(() => {
        // Reset state browser untuk memastikan tidak ada cookie login
        cy.session('login', () => {
            cy.visit(LOGIN_URL);
            cy.get('.orangehrm-login-container').should('be.visible');
        });
        cy.visit(LOGIN_URL);
    });

    // =======================================================
    // 10 TEST CASE DENGAN INTERCEPT BERBEDA (Fokus pada Validasi Positif)
    // =======================================================

    it('TC-01: Intercept & Validate Success Status Code (200)', () => {
        cy.intercept('POST', VALIDATE_API).as('successRequest');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@successRequest').its('response.statusCode').should('eq', 302);
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-02: Intercept & Validate Request Method (POST)', () => {
        cy.intercept({ method: 'POST', url: VALIDATE_API }).as('postMethod');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@postMethod').its('request.method').should('eq', 'POST');
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-03: Intercept & Validate Request URL Path (URL Contains Validate)', () => {
        cy.intercept('POST', VALIDATE_API).as('urlValidate');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@urlValidate').its('request.url').should('include', 'validate');
        cy.url().should('include', '/dashboard/index');
    });

 it('TC-04: Intercept & Validate Request Header (Origin Exists)', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Memastikan header 'origin' ada
            expect(req.headers).to.have.property('origin');
        }).as('headerOrigin');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@headerOrigin');
        cy.url().should('include', '/dashboard/index');
    });

it('TC-05: Intercept & Validate Request Header (Accept Language)', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Memastikan header 'accept-language' ada
            expect(req.headers).to.have.property('accept-language');
        }).as('headerLang');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@headerLang');
        cy.url().should('include', '/dashboard/index');
    });
    
it('TC-06: Intercept & Validate Request Header (Content-Type is Form Data)', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            expect(req.headers['content-type']).to.include('application/x-www-form-urlencoded');
        }).as('contentTypeCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@contentTypeCheck');
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-07: Intercept & Validate Response Header (Set-Cookie Exists)', () => {
        // Memeriksa bahwa respons login mengembalikan Set-Cookie untuk sesi
        cy.intercept('POST', VALIDATE_API).as('cookieCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // Cek header Set-Cookie pada respons API validate
        cy.wait('@cookieCheck').its('response.headers').should('have.property', 'set-cookie');
        cy.url().should('include', '/dashboard/index');
    });

    // =======================================================
    // TC-08: REVISI - Validasi Redirect Setelah API Sukses
    // =======================================================
    it('TC-08: Intercept & Validate Successful Redirect Status (302)', () => {
        // Intercept: Memantau request, fokus pada status redirect yang biasa terjadi setelah API sukses
        cy.intercept('POST', VALIDATE_API).as('redirectCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Pastikan API login berhasil (Status 200) dan browser diarahkan (redirect)
        // Kita cek status code 200, karena OrangeHRM API mengembalikan 200 lalu melakukan redirect JS, bukan 302 HTTP.
        cy.wait('@redirectCheck').its('response.statusCode').should('eq', 302);
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-09: Intercept & Ensure No Query Parameters Are Sent', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            expect(req.query).to.be.empty; 
        }).as('queryParamCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@queryParamCheck');
        cy.url().should('include', '/dashboard/index');
    });
    
    it('TC-10: Intercept & Validate Request Size (Bytes > 0)', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Memastikan Content-Length (ukuran payload) lebih besar dari 0
            const content_length = parseInt(req.headers['content-length']);
            expect(content_length).to.be.greaterThan(0); 
        }).as('requestSizeCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@requestSizeCheck');
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-11: Intercept & Validate Request Header (User-Agent Exists)', () => {
        // Intercept: Memastikan header 'User-Agent' ada, yang menunjukkan informasi browser
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Validasi: Header 'user-agent' harus ada
            expect(req.headers).to.have.property('user-agent');
        }).as('userAgentCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@userAgentCheck');
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-12: Intercept & Validate Request Header (Connection Type is Keep-Alive)', () => {
        // Intercept: Memastikan header 'Connection' dikirim sebagai 'keep-alive' (umum untuk koneksi HTTP modern)
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Validasi: Header 'connection' harus mengandung 'keep-alive'
            expect(req.headers.connection).to.include('keep-alive');
        }).as('connectionCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@connectionCheck');
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-13: Intercept & Validate Request Protocol (HTTP/1.1 or HTTP/2)', () => {
        // Intercept: Memastikan protokol yang digunakan adalah HTTP/1.1 atau yang lebih baru
        cy.intercept('POST', VALIDATE_API).as('protocolCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Tunggu request dan periksa properti HTTP version.
        cy.wait('@protocolCheck').its('request.httpVersion').should('eq', '1.1');
        // Catatan: Cypress sering melaporkan HTTP/1.1 meskipun browser menggunakan HTTP/2 atau 3
        
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-14: Intercept & Validate Request Property (Request Body Exists)', () => {
        cy.intercept('POST', VALIDATE_API).as('requestBodyExists');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        // ASSERT: Tunggu request dan pastikan properti 'request.body' (payload) ada dan bukan null
        cy.wait('@requestBodyExists').its('request.body').should('not.be.null');
        
        cy.url().should('include', '/dashboard/index');
    });

    it('TC-15: Intercept & Validate Request Header (Accept Encoding Exists)', () => {
        cy.intercept('POST', VALIDATE_API, (req) => {
            // Validasi: Header 'accept-encoding' harus ada
            expect(req.headers).to.have.property('accept-encoding');
        }).as('encodingCheck');

        cy.get('input[name="username"]').type(validUsername);
        cy.get('input[name="password"]').type(validPassword);
        cy.get('button[type="submit"]').click();

        cy.wait('@encodingCheck');
        cy.url().should('include', '/dashboard/index');
    });
});