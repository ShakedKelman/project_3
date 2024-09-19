import express from "express";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import { closeDB } from "../src/db/dal";
import { userRoutes } from "../src/controllers/userControllers";

const VALID_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjozLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3MjY3NTY3NDYsImV4cCI6MTcyNjc2NzU0Nn0.Cwmvoh9GRbhe9CtBglLlzierZPpvmOIlR9XQYihNxjY";

const app = express();
app.use(express.json());
app.use(userRoutes);

describe("User Controllers", () => {
    let pid: number | undefined;

    beforeAll(() => {
        console.log("before all running ... ");
    });

    afterAll(async () => {
        console.log("afterAll is running..");
        await closeDB();
    });

   
    it("Should register a new user", async () => {
        const response = await request(app)
            .post(appConfig.routePrefix + "/register")
            .send({
                firstName: "test",
                lastName: "reg",
                email: "test.smith@example.com",
                password: "password123",
                isAdmin: false 
                
            });

        expect(response.status).toBe(StatusCode.Created);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user.firstName).toBe("test");
        expect(response.body.user.lastName).toBe("reg");
        expect(response.body.user.email).toBe("test.smith@example.com");
        expect(response.body.user.isAdmin).toBeFalsy();
    });
});
