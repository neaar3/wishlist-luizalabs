import supertest from "supertest";
import faker from "faker";
import app from "../src/index";
import { passwordAdmin, usernameAdmin } from "../src/access";

describe("Admin", () => {
    const req = supertest(app);

    test("Should login if username and password are correct", async () => {
        const loginData = {
            username: usernameAdmin,
            password: passwordAdmin
        }

        const res = await req.post("/login").send(loginData);

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();
    })

    test("Should fail login if username or password are incorrect", async () => {
        const loginData = {
            username: faker.name.firstName(),
            password: faker.internet.password()
        }

        const res = await req.post("/login").send(loginData);

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Invalid Username or Password. Try again.");
    })

    test("Should fail login if username or password are not send", async () => {
        const loginData = {
            username: faker.name.firstName()
        }

        const res = await req.post("/login").send(loginData);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Login must contain username and password");
    })
})