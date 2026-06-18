import { test, expect, request as playwrightRequest } from '@playwright/test';
// @ts-check

const BASE_URL = 'https://api.restful-api.dev/objects';

const createBody = {
    name: 'Apple MacBook Pro 16',
    data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB'
    }
};

const updateBody = {
    name: 'Apple MacBook Pro 16',
    data: {
        year: 2019,
        price: 2049.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB',
        color: 'silver'
    }
};

test.describe('PUT Object API Test', () => {
    // Run tests serially to avoid rate-limiting the public API
    test.describe.configure({ mode: 'serial' });

    let objectId;
    let originalPrice;
    let putResponseBody;

    test.beforeAll(async () => {
        // Create ONE object via POST and share its id across all tests
        const context = await playwrightRequest.newContext();
        const postResponse = await context.post(BASE_URL, {
            headers: { 'Content-Type': 'application/json' },
            data: createBody
        });
        if (!postResponse.ok()) {
            throw new Error(`Setup failed: POST returned ${postResponse.status()} – ${await postResponse.text()}`);
        }
        const created = await postResponse.json();
        objectId = created.id;
        originalPrice = created.data.price;
        console.log('Setup — Created Object ID:', objectId, '| Original price:', originalPrice);
        await context.dispose();
    });

    test('should update an existing object and return 200 with updated data', async ({ request }) => {
        const putResponse = await request.put(`${BASE_URL}/${objectId}`, {
            headers: { 'Content-Type': 'application/json' },
            data: updateBody
        });

        expect(putResponse.ok()).toBeTruthy();
        expect(putResponse.status()).toBe(200);

        putResponseBody = await putResponse.json();
        console.log('Updated Object Response:', putResponseBody);

        // id remains the same
        expect(putResponseBody.id).toBe(objectId);

        // name is unchanged
        expect(putResponseBody.name).toBe(updateBody.name);

        // all data fields are updated
        expect(putResponseBody.data.year).toBe(updateBody.data.year);
        expect(putResponseBody.data.price).toBe(updateBody.data.price);
        expect(putResponseBody.data['CPU model']).toBe(updateBody.data['CPU model']);
        expect(putResponseBody.data['Hard disk size']).toBe(updateBody.data['Hard disk size']);
        expect(putResponseBody.data.color).toBe(updateBody.data.color);

        // updatedAt timestamp is present
        expect(putResponseBody).toHaveProperty('updatedAt');
    });

    test('should reflect new price after PUT update', async ({ request }) => {
        const putResponse = await request.put(`${BASE_URL}/${objectId}`, {
            headers: { 'Content-Type': 'application/json' },
            data: updateBody
        });
        expect(putResponse.ok()).toBeTruthy();

        const updatedObject = await putResponse.json();
        console.log('Original price:', originalPrice, '| Updated price:', updatedObject.data.price);

        // Price should have changed from 1849.99 to 2049.99
        expect(updatedObject.data.price).not.toBe(originalPrice);
        expect(updatedObject.data.price).toBe(2049.99);
    });

    test('should add new field "color" via PUT and return it in response', async ({ request }) => {
        const putResponse = await request.put(`${BASE_URL}/${objectId}`, {
            headers: { 'Content-Type': 'application/json' },
            data: updateBody
        });
        expect(putResponse.ok()).toBeTruthy();

        const updatedObject = await putResponse.json();
        console.log('Color field after PUT:', updatedObject.data.color);

        expect(updatedObject.data).toHaveProperty('color');
        expect(updatedObject.data.color).toBe('silver');
    });

    test('should return response with Content-Type application/json', async ({ request }) => {
        const putResponse = await request.put(`${BASE_URL}/${objectId}`, {
            headers: { 'Content-Type': 'application/json' },
            data: updateBody
        });

        expect(putResponse.headers()['content-type']).toContain('application/json');
    });

});
