import axios from "axios";
import faker from "faker";

import supertest from "supertest";

import app from "../src";
import { passwordAdmin, usernameAdmin } from "../src/access";
import knex from "../src/database";
import { customerDatabase } from "../src/shared/customer";

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

            const products = await axios.get(`http://challenge-api.luizalabs.com/api/product/?page=${Math.floor(Math.random() * 10)+1}`)
            .then(res => res.data)

            const params = {
                id: products.products[Math.floor(Math.random() * 10)+1].id
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const user = await knex<customerDatabase>("customers").where("email", body2.email).first()
            const body = {
                customerId: user?.id
            };
            
            const res = await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);
            console.log(res.text)
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Product added successfully");
        });

        test("should send error if customerId isn't send", async () => {
            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("customerId is required");
        });

        test("should send error if customerId doesn't find any user", async () => {
            const body = {
                customerId: 9999999

            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User does not exist");
        });

        test("should send error if product id doesn't find any product", async () => {
            const params = {
                id: '9999999999'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const user = await knex<customerDatabase>("customers").where("email", body2.email).first()
            
            const body = {
                customerId: user?.id
            };

            const res = await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Request failed with status code 404");
        });

        test("should send error if product is already in favorites list", async () => {
            const products = await axios.get(`http://challenge-api.luizalabs.com/api/product/?page=${Math.floor(Math.random() * 10)+1}`)
            .then(res => res.data)

            const params = {
                id: products.products[Math.floor(Math.random() * 10)+1].id
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);
            
            const user = await knex<customerDatabase>("customers").first()
            const body = {
                customerId: user?.id

            };

            await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            const res = await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            console.log(res.text)
            expect(res.status).toBe(403);
            expect(res.body.message).toBe("Can't duplicate product in favorite's list");
        });
    })


    describe("removeProductsFromFavorites", () => {

        test("should remove a product in favorites", async () => {
            
            const products = await axios.get(`http://challenge-api.luizalabs.com/api/product/?page=${Math.floor(Math.random() * 10)+1}`)
            .then(res => res.data)

            const params = {
                id: products.products[Math.floor(Math.random() * 10)+1].id
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const user = await knex<customerDatabase>("customers").where("email", body2.email).first()
            const body = {
                customerId: user?.id

            };
            await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);
            const res = await req.delete(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            console.log(res.text)
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Product deleted");
        });

        test("should send error if customerId isn't send", async () => {
            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.delete(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send();

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("customerId is required");
        });

        test("should send error if customerId doesn't find any user", async () => {
            const body = {
                customerId: 99999999
            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const res = await req.delete(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User does not exist");
        });

        test("should send error if product is not found in favorites", async () => {
            const user = await knex<customerDatabase>("customers").first()
            const body = {
                customerId: user?.id

            };

            const params = {
                id: '1bf0f365-fbdd-4e21-9786-da459d78dd1f'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);

            const res = await req.delete(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Product isn't in favorite list.");
        });
    })

    describe("listProductsFromFavorites", () => {

        test("should return message if no product is found in favorites", async () => {
            const body = {
                customerId: 999999999
            };

            const params = {
                id: '1bf0f365'
            }

            const body2 = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + token).send(body2);
            await req.post(`/product/${params.id}`).set('Authorization', 'Bearer ' + token).send(body);

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
            console.log(res.text)
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("No products added to favorite list");
        });
    })
});