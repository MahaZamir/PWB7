import {test, expect} from '@playwright/test';

test.describe('Get Object API Test', () => {
    test('should retrieve an object successfully', async ({ request }) => {
        const response = await request.get('https://api.restful-api.dev/objects');

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        console.log(responseBody);
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

    });
});



