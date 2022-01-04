import faker from "faker";
import knex from "../src/database";

import supertest, { Response } from "supertest";

import app from "../src";
import { passwordAdmin, usernameAdmin } from "../src/access";
import { customerDatabase } from "../src/shared/customer";

const req = supertest(app);
let loginResponse: Response | null = null;

beforeEach(async () => {
    loginResponse = await req.post('/login')
        .send({ username: usernameAdmin, password: passwordAdmin })
});
describe("customers", () => {

    describe("createUser", () => {
        test("should successfully create a new customer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };
          const res = await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

          expect(res.status).toBe(201);
          expect(res.body.message).toBe("User created successfully");
        });

        test("should send error if email are already in use", async () => {
            const body = {
              name: faker.name.firstName(),
              email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

            const res = await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("Email already in use.");
        });
    })


    describe("updateUser", () => {
        test("should successfully update a new customer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

          const body2 = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

            
            await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);
            
            
            const user = await knex<customerDatabase>("customers").where("email", body.email).first()

          const res = await req
            .put(`/customer/${user?.id}`)
            .set('Authorization', 'Bearer ' + loginResponse?.body.token)
            .send(body2);

          expect(res.status).toBe(201);
          expect(res.body.message).toBe("User updated successfully");
        });

        test("should send error if email is already in use", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

            const user = await knex<customerDatabase>("customers").where("email", body.email).first()

            const res = await req
                .put(`/customer/${user?.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send(body);

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("Email already in use.");
        });

        test("should send error if user is not found by id", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            const params = {
                id: 10000
            }

            const res = await req
                .put(`/customer/${params.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send(body);

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("User does not exist.");
        });
    })

    describe("deleteUser", () => {
        test("should delete a customer on database", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

            const user = await knex<customerDatabase>("customers").where("email", body.email).first()
            
            const res = await req
                .delete(`/customer/${user?.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send();

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("User deleted successfully");
        });

        test("should send error if user is not found by id", async () => {
            const params = {
                id: 1
            }

            const res = await req
                .delete(`/customer/${params.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send();

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("User does not exist");
        });
    })

    describe("getUser", () => {
        test("should successfully get a customer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

          await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

          const user = await knex<customerDatabase>("customers").where("email", body.email).first()
       
          const res = await req
                .get(`/customer/${user?.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send();

          expect(res.status).toBe(200);
          expect(res.body).toBeTruthy();
          expect(res.body.name).toBe(body.name);
        });

        test("should send error if user is not found by id", async () => {
            const params = {
              id: 99999
            }

            const res = await req
                .get(`/customer/${params.id}`)
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send();

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });
    })

    describe("getAllUsers", () => {
        test("should successfully retrieve all customers of database", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/customer").set('Authorization', 'Bearer ' + loginResponse?.body.token).send(body);

            const res = await req
                .get("/customer")
                .set('Authorization', 'Bearer ' + loginResponse?.body.token)
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toBeTruthy();
        });
    })
});