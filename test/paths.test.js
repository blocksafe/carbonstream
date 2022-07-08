/**
 * API Tests for path route
 * 
 */

// Dependencies
const supertest = require('supertest');
const config = require('./config');
const {cloneDeep} = require('lodash');



// Initiate the supertest client
const request = supertest.agent(config.url);


// Write the valid 200 queryString for get
const validGet = {
    '_id' : 'abcd'
}

// GET
describe('GET /path', () => {

    // No query object sent
    test('1. should return 400 if no query is sent', async () => {
        const {status} = await request.get('/paths');
        expect(status).toEqual(400);
    });

    // No query object sent, check for error message
    test('2. should show an error message if no query String is sent', async () => {
        const { body, status } = await request.get('/paths');
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "_id"
            }
        }));
    });


    // Query object exists but is missing the _id field
    test('3. should show an error message if query exists but is missing the _id field', async () => {
        const params = {'foo' : 'bar'};
        const {body, status} = await request.get('/paths').query(params);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "_id"
            }
        }));
    });

    // _id is invalid
    test('4. should show an error message if  _id is invalid', async () => {
        let params = cloneDeep(validGet)
        params._id = 'ab*cd';

        const {body, status} = await request.get('/paths').send(params);
        
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": "_id"
            }
        }));

    });


    // Correct Payload
    test('5. should retrieve a path if the query object is valid', async () => {
        let params = cloneDeep(validGet)
        param._id = 'test-'+Date.now();
        const {body, status} = await request.get('/paths').query(params);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            '_id' : expect.any(String),
            'refId' : expect.any(String),
            'refType' : expect.any(String)
        }));
        expect(body.created).toBeUndefined();
        expect(body.updated).toBeUndefined();

    });



});


describe('POST /paths', () => {

    test('should return a 405', async () => {
        const response = await request.post('/paths');
        expect(response.status).toEqual(405);
    });
});

describe('PUT /paths', () => {

    test('should return a 405', async () => {
        const response = await request.put('/paths');
        expect(response.status).toEqual(405);
    });
});

describe('DELETE /paths', () => {

    test('should return a 405', async () => {
        const response = await request.del('/paths');
        expect(response.status).toEqual(405);
    });
});