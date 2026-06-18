import { test, expect } from '@playwright/test';

const BASE_URL = 'https://api.restful-api.dev/objects';

const requestBody = {
    name: 'Apple MacBook Pro 16',
    data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB'
    }
};

test.describe('POST Object API Test', () => {

    test('should create a new object and return 200 with created data', async ({ request }) => {
        const response = await request.post(BASE_URL, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        });

        // Validate response status
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log('Created Object Response:', responseBody);

        // Validate the response contains an auto-generated id
        expect(responseBody).toHaveProperty('id');
        expect(typeof responseBody.id).toBe('string');

        // Validate the returned name matches the request
        expect(responseBody.name).toBe(requestBody.name);

        // Validate the returned data fields match the request
        expect(responseBody.data.year).toBe(requestBody.data.year);
        expect(responseBody.data.price).toBe(requestBody.data.price);
        expect(responseBody.data['CPU model']).toBe(requestBody.data['CPU model']);
        expect(responseBody.data['Hard disk size']).toBe(requestBody.data['Hard disk size']);

        // Validate a createdAt timestamp is present
        expect(responseBody).toHaveProperty('createdAt');
    });

    test('should return response with Content-Type application/json', async ({ request }) => {
        const response = await request.post(BASE_URL, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: requestBody
        });

        expect(response.headers()['content-type']).toContain('application/json');
    });

    test('should create object and the id should be unique across two POST requests', async ({ request }) => {
        const postOptions = {
            headers: { 'Content-Type': 'application/json' },
            data: requestBody
        };

        const [response1, response2] = await Promise.all([
            request.post(BASE_URL, postOptions),
            request.post(BASE_URL, postOptions)
        ]);

        expect(response1.ok()).toBeTruthy();
        expect(response2.ok()).toBeTruthy();

        const body1 = await response1.json();
        const body2 = await response2.json();

        console.log('Object 1 ID:', body1.id);
        console.log('Object 2 ID:', body2.id);

        expect(body1.id).not.toBe(body2.id);
    });

});
