/**
 * API Tests for policies route
 * 
 */

// Dependencies
const supertest = require('supertest');
const config = require('./config');
const {cloneDeep} = require('lodash');

// Inititate the supertest client
const request = supertest.agent(config.url);

// Set the test identifier
// const testIdentifier = {
//     'check': true,
//     'method': 'GET',
//     'no': 0
// }

// Write the valid 200 query string for the (2 options)
const validGet = {
    '_id': 'terms'
}

const validGetAlt = {
    '_id'  : 'privacy'
}

let testNo = 1;
// GET
describe('GET /policies', (testNo = 1) => {
    

    // 1. No query object sent
    test(testNo + '. should return a 400 if no query is sent -> to /policies route', async() => {
         
        
        let params = cloneDeep(validGet)
        
        
        // Setting parameters
        // params = cloneDeep(validGet);

        const {status} = await request.get('/policies');
        expect(status).toEqual(400);
        
    });
    testNo++;
    // 2. No query object sent, check for message error
    test(testNo + '. should show an error message if no query is sent -> to /policies route', async() => {
        // Basic  Test maker  
        
        let params = cloneDeep(validGet);
        
        // params = cloneDeep(validGet);

        
        const {status, body} = await request.get('/policies');
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": '_id'
            }
        }));
    });
    testNo++;
    // 3. _id in invalid 
    test(testNo + '. should return an error message if query exist but missing the _id field -> to /policies route', async() => {
        // Basic  Test maker 
        let params = {'foo' : 'bar'};
        
        
        // Setting parameters
        
        
        const {status, body} = await request.get('/policies').query(params);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": '_id'
            }
        }));
    })
    testNo++;
    // 4. _id in invalid 
    test(testNo + '. should return an error message if _id  is invalid -> to /policies route', async() => {
        // Basic  Test maker  
        let params = cloneDeep(validGet);
        
        
        
        // Making id invalid
        params._id = 'ab*cd';
        const {status, body} = await request.get('/policies').query(params);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type": "query",
                "timestamp": expect.any(Number),
                "message": [
                    expect.any(String)
                ],
                "key": '_id'
            }
        }));
    })
    testNo++;
    // 5. Correct query object
    test(testNo + '. should retrieve a policy content if the query object is valid -> to /policies route', async() => {
        // Basic  Test maker  
        let params = cloneDeep(validGet)
        
        
        
        
        
        const {status, body} = await request.get('/policies').query(params);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            '_id': params._id,            
            'content': expect.any(String),
            'name': expect.any(String),
            'version': expect.any(String),
            'updated': expect.any(Number),

        }));
        expect(body.internal).toBeUndefined();
    });

    testNo++;

    // 6. Correct query object
    test(testNo + '. should allow retrival of privacy policy as well if the query object is valid -> to /policies route', async() => {
        // Basic  Test maker  
        let params = cloneDeep(validGetAlt)
        
        
        const {status, body} = await request.get('/policies').query(params);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            '_id': params._id,
            'content': expect.any(String),            
            'name': expect.any(String),
            'version': expect.any(String),
            'updated': expect.any(Number),

        }));
        expect(body.internal).toBeUndefined();
        expect(body.jurisdiction).toBeUndefined();
    });



})


describe('POST /policies', () => {

    test('should return a 405', async () => {
        const response = await request.post('/policies');
        expect(response.status).toEqual(405);
    });
});

describe('PUT /policies', () => {

    test('should return a 405', async () => {
        const response = await request.put('/policies');
        expect(response.status).toEqual(405);
    });
});

describe('DELETE /policies', () => {

    test('should return a 405', async () => {
        const response = await request.del('/policies');
        expect(response.status).toEqual(405);
    });
});

