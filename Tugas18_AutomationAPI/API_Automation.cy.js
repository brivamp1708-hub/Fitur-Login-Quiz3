/// <reference types="cypress" />

describe('Reqres.in API Automation Test - 15 Stable Scenarios', () => {

    // Definisikan Base URL API
    const BASE_URL = 'https://reqres.in/api';

    // =======================================================
    // I. SCENARIO GET (5 TC) - Untuk Mengambil Data
    // =======================================================

    it('TC-01: GET List Users (Page 2) - Status 200 & Memeriksa Data Array', () => {
        cy.request('GET', `${BASE_URL}/users?page=2`).then((response) => {
            // Memastikan status code adalah 200 (OK)
            expect(response.status).to.eq(200); 
            // Memastikan body memiliki properti 'data' dan berupa array
            expect(response.body).to.have.property('data').that.is.an('array');
            // Memastikan ada lebih dari 0 data
            expect(response.body.data.length).to.be.greaterThan(0);
        });
    });

    it('TC-02: GET Single User - Status 200 & Verifikasi ID 5', () => {
        cy.request('GET', `${BASE_URL}/users/5`).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan ID user yang diterima adalah 5
            expect(response.body.data).to.have.property('id', 5);
        });
    });

    it('TC-03: GET Single User NOT FOUND - Memeriksa Status 404', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/users/999`,
            failOnStatusCode: false // Penting: Agar Cypress tidak gagal pada status 4xx
        }).then((response) => {
            expect(response.status).to.eq(404);
            // Memastikan body response kosong
            expect(response.body).to.be.empty; 
        });
    });

    it('TC-04: GET List Resources (unknown) - Memeriksa Jumlah Total Item', () => {
        cy.request('GET', `${BASE_URL}/unknown`).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan total item di halaman adalah 12
            expect(response.body).to.have.property('total', 12); 
        });
    });

    it('TC-05: GET Single Resource - Memeriksa Nama Resource (true red)', () => {
        cy.request('GET', `${BASE_URL}/unknown/3`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property('name', 'true red');
        });
    });

    // =======================================================
    // II. SCENARIO POST (5 TC) - Untuk Membuat Data
    // =======================================================

    it('TC-06: POST Create New User - Status 201 & Validasi Job yang Dibuat', () => {
        const newUser = { "name": "leo messi", "job": "footballer" };
        cy.request('POST', `${BASE_URL}/users`, newUser).then((response) => {
            // POST yang sukses menghasilkan status 201 (Created)
            expect(response.status).to.eq(201); 
            expect(response.body).to.have.property('job', newUser.job);
        });
    });

    it('TC-07: POST Register Successful - Status 200 & Mendapatkan Token', () => {
        const credentials = { "email": "eve.holt@reqres.in", "password": "pistol" };
        cy.request('POST', `${BASE_URL}/register`, credentials).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan token berhasil diterima
            expect(response.body).to.have.property('token').and.be.a('string'); 
        });
    });
    
    it('TC-08: POST Register Unsuccessful - Status 400 (Missing Password)', () => {
        cy.request({
            method: 'POST',
            url: `${BASE_URL}/register`,
            body: { "email": "sydney@fife" }, // Body tanpa password
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error', 'Missing password');
        });
    });

    it('TC-09: POST Login Successful - Status 200 & Mendapatkan Token', () => {
        const credentials = { "email": "eve.holt@reqres.in", "password": "cityslicka" };
        cy.request('POST', `${BASE_URL}/login`, credentials).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token').and.be.a('string');
        });
    });
    
    it('TC-10: POST Login Unsuccessful - Status 400 (Missing Email)', () => {
        cy.request({
            method: 'POST',
            url: `${BASE_URL}/login`,
            body: { "password": "cityslicka" }, // Body tanpa email
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error', 'Missing email or username');
        });
    });

    // =======================================================
    // III. SCENARIO PUT, PATCH, DELETE, DELAY (5 TC)
    // =======================================================

    it('TC-11: PUT Update User - Status 200 & Verifikasi Perubahan', () => {
        const updatedData = { "name": "thomas", "job": "tester" };
        cy.request('PUT', `${BASE_URL}/users/2`, updatedData).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan data job berhasil diubah
            expect(response.body).to.have.property('job', 'tester'); 
        });
    });

    it('TC-12: PATCH Partial Update Job - Status 200', () => {
        const partialUpdate = { "job": "automation engineer" };
        cy.request('PATCH', `${BASE_URL}/users/4`, partialUpdate).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan hanya properti job yang diupdate
            expect(response.body).to.have.property('job', partialUpdate.job); 
        });
    });
    
    it('TC-13: DELETE Existing User - Status 204 (Success)', () => {
        // DELETE yang sukses menghasilkan status 204 (No Content)
        cy.request('DELETE', `${BASE_URL}/users/3`).then((response) => {
            expect(response.status).to.eq(204);
            expect(response.body).to.be.empty;
        });
    });

    it('TC-14: GET List Users with 3-Second Delay - Memeriksa Durasi > 3000ms', () => {
        cy.request(`${BASE_URL}/users?delay=3`).then((response) => {
            expect(response.status).to.eq(200);
            // Memastikan response time lebih dari 3 detik (3000 milidetik)
            expect(response.duration).to.be.greaterThan(3000); 
        });
    });

    it('TC-15: GET Single Resource NOT FOUND - Status 404', () => {
        cy.request({
            method: 'GET',
            url: `${BASE_URL}/unknown/99`,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.body).to.be.empty;
        });
    });
});
