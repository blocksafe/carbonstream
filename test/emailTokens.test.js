/**
 * API test for Email Token 
 * 
 */

//  Dependencies
const supertest = require('supertest');
const config = require('./config');
const helpers = require('./helpers');
const { cloneDeep } = require('lodash');



// Initiate the supertest client
const request = supertest.agent(config.url);

// Write the valid 200 payload for the post
const box = 'user_' + Date.now();
const validPost = {
    'verification' :  {
        '_id' : null,
        'code' : null
    }
};

// Run a before all setup
beforeAll( async () => {

    // Trigger an email verification, and the request _id in  the validPost
    const {body} = await request.post('/emails/verifications').send({'email' : box+config.sandboxEmailDomain});
    validPost.verification._id = body._id;
    // Receive the email, and retrive the confirmation code
    let bucket = config.sandboxEmailBucket;
    let key = box+'/'+config.sandboxEmailBucket;
    validPost.verification.code = await helpers.getConfirmationCodeFromEmail(bucket, key);

    return  true;
}, config.emailVerificationTimeout);

// POST
describe('POST /emails/tokens', () => {

    
    // No payload sent
    test('1. should return a 400 if  no payload is sent', async () => {
        const {status} = await request.post('/emails/tokens');
        expect(status).toEqual(400);
    });


    // No payload sent
    test('2. should show an error message if no payload is sent', async () => {
        const {status} = await request.post('/emails/tokens');
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : expect.any(String)
            }
        }));
    });

    // Payload missing _id
    test('3. should show an error message if payload is missing _id', async () => {
        let payload = cloneDeep(validPost)
        delete payload.verification._id;
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification._id"
            }
        }));
    });

    // Verification _id is not a valid format
    test('4. should show an error message if verification._id is not valid format', async () => {
        let payload = cloneDeep(validPost);
        payload.verification._id = 'a*b';
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification._id"
            }
        }));
    });

    // Verification._id doesnot exist
    test('5. should show an error message if verification _id doesnot exist', async () => {
        let payload = cloneDeep(validPost)
        payload.verification._id  +=  'x';
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification._id"
            }
        }));
    });

    // Payload missing verification code
    test('6. should show an error message if verification code is missing', async () => {
        let payload = cloneDeep(validPost)
        delete payload.verification.code;
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification.code"
            }
        }));
    });

    // Invalid format of verification code
    test('7. should show an error message if verification code is invalid format', async () => {
        let payload = cloneDeep(validPost)
        payload.verification.code = '12345678';
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification.code"
            }
        }));
    });

    // Correct Payload
    test('8. should show a status code 200 if correct payload, successful', async () => {
        let payload = cloneDeep(validPost);
        
        const {status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            'created' : expect.any(Number),
            '_id' : expect.any(String),
            'email' : box+config.sandboxEmailDomain,
            'updated' : expect.any(Number),
            'expires' : expect.any(Number),
            'emailExists' : false
        }));

        // expect(body.code).toBeUndefined();
        // expect(body.humanReadableCode).toBeUndefined();
        // expect(body.attempts).toBeUndefined();
        expect(body.internal).toBeUndefined();

    });

    // Verification code already been used
    test('9. should show an error message if verification has  already been used', async () => {
        let payload = cloneDeep(validPost);
        const {body, status} = await request.post('/emails/tokens').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "verification._id"
            }
        }))
    })

});

describe('GET /emails/tokens', () => {

    test('GET  return a 405', async () => {
        const response = await request.get('/emails/tokens');
        expect(response.status).toEqual(405);
    });
});

describe('PUT /emails/tokens', () => {

    test('PUT return a 405', async () => {
        const response = await request.put('/emails/tokens');
        expect(response.status).toEqual(405);
    });
});


describe('DELETE /emails/tokens', () => {

    test('should return a 405', async () => {
        const response = await request.del('/emails/tokens');
        expect(response.status).toEqual(405);
    });
});
