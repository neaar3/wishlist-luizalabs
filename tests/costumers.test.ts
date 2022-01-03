import faker from "faker";

import supertest from "supertest";

import app from "../src";
import { passwordAdmin, usernameAdmin } from "../src/access";

const req = supertest(app);
let token: string | null = null;

beforeEach(() => {
    req.post('/login')
        .send({ username: usernameAdmin, password: passwordAdmin })
        .end(function(_err, res) {
            token = res.body.token;
        });
});
describe("Costumers", () => {

    describe("createUser", () => {
        test("should successfully create a new costumer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };
          const res = await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

          expect(res.status).toBe(201);
          expect(res.body.message).toBe("User created successfully");
        });

        test("should send error if email are already in use", async () => {
            const body = {
              name: faker.name.firstName(),
              email: faker.internet.email(),
            };

            await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

            const res = await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("Email already in use.");
        });
    })


    describe("updateUser", () => {
        test("should successfully update a new costumer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

          const body2 = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

          const params = {
            id: 1
          }

          await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

          const res = await req
            .put("/costumer")
            .set('Authorization', 'Bearer ' + token)
            .query(params)
            .send(body2);

          expect(res.status).toBe(201);
          expect(res.body.message).toBe("User updated successfully");
        });

        test("should send error if email are already in use", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            const params = {
                id: 1
            }

            await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

            const res = await req
                .put("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
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
                id: 1
            }

            const res = await req
                .put("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
                .send(body);

            expect(res.status).toBe(403);
            expect(res.body.error).toBe("User does not exist.");
        });
    })

    describe("deleteUser", () => {
        test("should delete a costumer on database", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            const params = {
                id: 1
            }

            await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

            const res = await req
                .delete("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
                .send();

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("User deleted successfully");
        });

        test("should send error if user is not found by id", async () => {
            const params = {
                id: 1
            }

            const res = await req
                .delete("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
                .send();

            expect(res.status).toBe(403);
            expect(res.body.message).toBe("User does not exist");
        });
    })

    describe("getUser", () => {
        test("should successfully get a costumer on database", async () => {
          const body = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
          };

          const params = {
            id: 1
        }

          await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

          const res = await req
                .get("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
                .send();

          expect(res.status).toBe(200);
          expect(res.body).toBeTruthy();
          expect(res.body.name).toBe(body.name);
        });

        test("should send error if user is not found by id", async () => {
            const params = {
              id: 1
            }

            const res = await req
                .get("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .query(params)
                .send();

            expect(res.status).toBe(404);
            expect(res.body.message).toBe("User not found");
        });
    })

    describe("getAllUsers", () => {
        test("should successfully create a new costumer on database", async () => {
            const body = {
                name: faker.name.firstName(),
                email: faker.internet.email(),
            };

            await req.post("/costumer").set('Authorization', 'Bearer ' + token).send(body);

            const res = await req
                .get("/costumer")
                .set('Authorization', 'Bearer ' + token)
                .send();

            expect(res.status).toBe(200);
            expect(res.body).toBeTruthy();
            expect(res.body.name).toBe(body.name);
        });
    })
});