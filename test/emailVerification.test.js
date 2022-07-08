/**
 * API test for email verification
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
    'email' :  box+config.sandboxEmailDomain
};

// POST
describe('POST /emails/verifications', () => {

    // No payload sent
    test('1. should return a 400 if  no payload is sent', async () => {
        const {status} = await request.post('/emails/verifications');
        expect(status).toEqual(400);
    });

    // No payload sent
    test('2. should show an error message if no payload is sent', async () => {
        const {status} = await request.post('/emails/verifications');
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

    // Payload missing email
    test('3. should show an error message if payload is missing email', async () => {
        let payload = cloneDeep(validPost)
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "email"
            }
        }));
    });

    // Email is not email format
    test('4. should show an error message if email is not email format', async () => {
        let payload = cloneDeep(validPost);
        payload.email = 'not-an-email';
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "email"
            }
        }));
    });

    // Email is using temporary address
    test('5. should show an error message if email is using temporary address', async () => {
        let payload = cloneDeep(validPost);
        payload.email = 'foo@mailinator.com';
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "email"
            }
        }));
    });

    // Email is using role address
    test('6. should show an error message if email is using role address', async () => {
        let payload = cloneDeep(validPost);
        payload.email = 'webmaster@sabza.com';
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(400);
        expect(body).toEqual(expect.objectContaining({
            "error": {
                "type" : "payload",
                "timestamp" : expect.any(Number),
                "message" : [
                    expect.any(String)
                ],
                "key" : "email"
            }
        }));
    });

    // Correct Payload
    test('7. should show a status code 200 if correct payload, successful', async () => {
        let payload = cloneDeep(validPost);
        
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            'created' : expect.any(Number),
            '_id' : expect.any(String),
            'email' : payload.email,
            'updated' : expect.any(Number),
        }));

        expect(body.code).toBeUndefined();
        expect(body.humanReadableCode).toBeUndefined();
        expect(body.attempts).toBeUndefined();
        expect(body.internal).toBeUndefined();

    });

    // Correct Payload
    test('8. should show a status code 200 if correct payload, successful', async () => {
        let payload = cloneDeep(validPost);
        
        const {status} = await request.post('/emails/verifications').send(payload);
        expect(status).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            'created' : expect.any(Number),
            '_id' : expect.any(String),
            'email' : payload.email,
            'updated' : expect.any(Number),
        }));

        expect(body.code).toBeUndefined();
        expect(body.humanReadableCode).toBeUndefined();
        expect(body.attempts).toBeUndefined();
        expect(body.internal).toBeUndefined();

    });

    // Check for delivery in mailbox
    test('9. should receive an email containing the confirmation code', async () => {

        let bucket = config.sandboxEmailBucket;
        let key = box+'/'+config.emailKeys.emailVerification;
        let code = await helpers.getConfirmationCodeFromEmail(bucket, key);
        expect(code).toHaveLength(8);
    }, config.emailVerificationTimeout);


});

describe('GET /emails/verifications', () => {

    test('GET  return a 405', async () => {
        const response = await request.get('/emails/verifications');
        expect(response.status).toEqual(405);
    });
});

describe('PUT /emails/verifications', () => {

    test('PUT return a 405', async () => {
        const response = await request.put('/emails/verifications');
        expect(response.status).toEqual(405);
    });
});


describe('DELETE /emails/verifications', () => {

    test('should return a 405', async () => {
        const response = await request.del('/emails/verifications');
        expect(response.status).toEqual(405);
    });
});


