import { test, expect, request as playwrightRequest } from '@playwright/test';

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

function isApiLimitExhausted(status, bodyText) {
    return (status === 405 || status === 429) && /(daily request limit|rate limit)/i.test(bodyText);
}

test.describe('DELETE Object API Test', () => {
    test.describe.configure({ mode: 'serial' });

    let objectId;
    let deleteResult;
    let skipReason;

    test.beforeAll(async () => {
        const context = await playwrightRequest.newContext();

        try {
            // Create object first so DELETE always has a valid id.
            const createResponse = await context.post(BASE_URL, {
                headers: { 'Content-Type': 'application/json' },
                data: createBody
            });

            const createText = await createResponse.text();
            if (!createResponse.ok()) {
                if (isApiLimitExhausted(createResponse.status(), createText)) {
                    skipReason = 'API daily request limit is exhausted. Skipping DELETE tests for now.';
                    return;
                }
                throw new Error(`Setup create failed: ${createResponse.status()} - ${createText}`);
            }

            const createdObject = JSON.parse(createText);
            objectId = createdObject.id;
            console.log('Setup - Created object id:', objectId);

            const deleteResponse = await context.delete(`${BASE_URL}/${objectId}`);
            const deleteText = await deleteResponse.text();

            if (!deleteResponse.ok()) {
                if (isApiLimitExhausted(deleteResponse.status(), deleteText)) {
                    skipReason = 'API daily request limit is exhausted. Skipping DELETE tests for now.';
                    return;
                }
                throw new Error(`DELETE failed: ${deleteResponse.status()} - ${deleteText}`);
            }

            deleteResult = {
                status: deleteResponse.status(),
                headers: deleteResponse.headers(),
                bodyText: deleteText,
                body: JSON.parse(deleteText)
            };
        } finally {
            await context.dispose();
        }
    });

    test('should delete object successfully with 200 response', async () => {
        test.skip(!!skipReason, skipReason);

        expect(deleteResult.status).toBe(200);
        expect(deleteResult.body).toHaveProperty('message');
        expect(deleteResult.body.message.toLowerCase()).toContain('deleted');
    });

    test('should include the deleted object id in response message', async () => {
        test.skip(!!skipReason, skipReason);

        expect(deleteResult.body.message).toContain(objectId);
    });

    test('should return response with Content-Type application/json', async () => {
        test.skip(!!skipReason, skipReason);

        expect(deleteResult.headers['content-type']).toContain('application/json');
    });
});
