import faker from "faker";

import supertest from "supertest";

import app from "../src";
import { passwordAdmin, usernameAdmin } from "../src/access";

const req = supertest(app);
let token: string | null = null;

beforeEach((done) => {
    req.post('/login')
    .send({ username: usernameAdmin, password: passwordAdmin })
    .end(function(_err, res) {
    token = res.body.token;
    done();
    });
});
describe("products", () => {

    describe("addProductsToFavorites", () => {
        test("should successfully add a new product on favorites", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const res = await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Product added successfully");
        });

        test("should send error if customerId isn't send", async () => {
            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("customerId is required");
        });

        test("should send error if customerId doesn't find any user", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User does not exist");
        });

        test("should send error if product id doesn't find any product", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const res = await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Product does not exist");
        });

        test("should send error if product is already in favorites list", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);
            await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            const res = await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Can't duplicate product in favorite's list");
        });
    })


    describe("removeProductsFromFavorites", () => {

        test("should remove a product in favorites", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);
            await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            const res = await req.delete("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Product deleted");
        });

        test("should send error if customerId isn't send", async () => {
            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.delete("/product").set('Authorization', 'Bearer ' + token).query(params).send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("customerId is required");
        });

        test("should send error if customerId doesn't find any user", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.delete("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User does not exist");
        });

        test("should send error if product is not found in favorites", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const res = await req.delete("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Product isn't in favorite list.");
        });
    })

    describe("listProductsFromFavorites", () => {

        test("should return message if no product is found in favorites", async () => {
            const body = {
                customerId: 1
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);
            await req.post("/product").set('Authorization', 'Bearer ' + token).query(params).send(body);

            const res = await req.get("/product").set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(200);
            expect(res.body.message).toBeTruthy();
        });

        test("should send error if customerId isn't send", async () => {
            const res = await req.get("/product").set('Authorization', 'Bearer ' + token).send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("customerId is required");
        });

        test("should return message if no product is found in favorites", async () => {
            const body = {
                customerId: 1
            };

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const res = await req.get("/product").set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("No products added to favorite list");
        });
    })
});