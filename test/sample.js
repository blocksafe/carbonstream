/**
 * API Tests for users route
 * 
 */

// Dependencies
const supertest = require('supertest');
const config = require('./config');

// Initiate the supertest client
const request = supertest.agent(config.url);

describe('POST /users', () => {

    // No payload is sent
    test('should return a 400 if no payload is sent', async () => {
        const {status} = await request.post('/users');
        expect(status).toEqual(400);
    });

    // No payload is sent
    test('should show an error msg if no payload is sent', async () => {
        const {status} = await request.post('/users');
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "payload",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": expect.any(String)
            }
        }));
    });


});