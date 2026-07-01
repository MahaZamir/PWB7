import { test, expect, request as playwrightRequest } from '@playwright/test';

const BASE_URL = 'https://api.restful-api.dev';

const createBody = {
    name: 'Apple MacBook Pro 16',
    data: {
        year: 2019,
        price: 1849.99,
        'CPU model': 'Intel Core i9',
        'Hard disk size': '1 TB'
    }
};

const patchBody = {
    name: 'Apple MacBook Pro 16 (Updated Name)'
};

function isApiLimitExhausted(status, bodyText) {
    return (status === 405 || status === 429) && /(daily request limit|rate limit)/i.test(bodyText);
}

function getSkippableApiError(status, bodyText) {
    if (isApiLimitExhausted(status, bodyText)) {
        return 'API daily request limit is exhausted. Skipping PATCH tests for now.';
    }

    return null;
}

test.describe('PATCH Object API Test', () => {
    test.describe.configure({ mode: 'serial' });

    let objectId;
    let patchedResponse;
    let rateLimitMessage;

    test.beforeAll(async () => {
        const context = await playwrightRequest.newContext();

        try {
            // Step 1: Create object to obtain a valid id
            const createResponse = await context.post(`${BASE_URL}/objects`, {
                headers: { 'Content-Type': 'application/json' },
                data: createBody
            });

            const createText = await createResponse.text();
            if (!createResponse.ok()) {
                const skipReason = getSkippableApiError(createResponse.status(), createText);
                if (skipReason) {
                    rateLimitMessage = skipReason;
                    return;
                }
                throw new Error(`Setup create failed: ${createResponse.status()} - ${createText}`);
            }

            const createdObject = JSON.parse(createText);
            objectId = createdObject.id;
            console.log('Setup - Created object id:', objectId);

            // Step 2: Patch the object name using the requested endpoint
            const patchResponse = await context.patch(`${BASE_URL}/objects/${objectId}`, {
                headers: { 'Content-Type': 'application/json' },
                data: patchBody
            });

            const patchText = await patchResponse.text();
            if (!patchResponse.ok()) {
                const skipReason = getSkippableApiError(patchResponse.status(), patchText);
                if (skipReason) {
                    rateLimitMessage = skipReason;
                    return;
                }
                throw new Error(`PATCH failed: ${patchResponse.status()} - ${patchText}`);
            }

            patchedResponse = {
                status: patchResponse.status(),
                headers: patchResponse.headers(),
                body: JSON.parse(patchText)
            };
        } finally {
            await context.dispose();
        }
    });

    test('should patch object name successfully with 200 response', async () => {
        test.skip(!!rateLimitMessage, rateLimitMessage);

        expect(patchedResponse.status).toBe(200);
        expect(patchedResponse.body.id).toBe(objectId);
        expect(patchedResponse.body.name).toBe(patchBody.name);
    });

    test('should return updatedAt and keep existing data after PATCH', async () => {
        test.skip(!!rateLimitMessage, rateLimitMessage);

        expect(patchedResponse.body).toHaveProperty('updatedAt');
        expect(patchedResponse.body.data.year).toBe(createBody.data.year);
        expect(patchedResponse.body.data.price).toBe(createBody.data.price);
        expect(patchedResponse.body.data['CPU model']).toBe(createBody.data['CPU model']);
        expect(patchedResponse.body.data['Hard disk size']).toBe(createBody.data['Hard disk size']);
    });

    test('should return response with Content-Type application/json', async () => {
        test.skip(!!rateLimitMessage, rateLimitMessage);

        expect(patchedResponse.headers['content-type']).toContain('application/json');
    });
});
