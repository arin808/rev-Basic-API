/**
 * Supertest assistance from https://medium.com/@golakiyachintan24/how-to-test-http-apis-using-jest-and-supertest-in-node-js-f25cbafacf52
*/
const server = require('../app.js');
const req = require('supertest');

describe('HTTP Requests', () => {
    test('GET request gets and displays all items', async () => {
        const response = await req(server).get('/api/groceryList')
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('application/json');
    });
    test('POST request adds an item to the list', async () => {
        const response = await req(server).post('/api/addItem')
        .send({productName: 'test', quantity: 1, price: 1.00});
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('Item successfully added to the list');
        expect(response.type).toEqual('application/json');
    });
    test('PUT request edits an item', async () => {
        const id = 1;
        const response = await req(server).put`/api/editItem?id=${id}`
        .send({id: 1, productName: 'test', quantity: 1, price: 1.00});
        expect(response.status).toEqual(201);
        expect(response.body.message).toEqual('Item successfully changed.');
        expect(response.type).toEqual('application/json');
    });
    test('DELETE request removes an item from the list', async () => {
        const id = 1;
        const response = await req(server).delete`/api/deleteItem?id=${id}`;
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Item successfully deleted');
        expect(response.type).toEqual('application/json');
    });
    test('404 error if request not found', async () => {
        const response = await req(server).get('/api/doesNotExist');
        expect(response.status).toEqual(404);
        expect(response.text).toEqual('Not Found');
        expect(response.type).toEqual('text/plain');
    });
});

afterEach(() => {
    server.close();
});