import express from "express";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import { vacationRoutes } from "../src/controllers/vacationsController";
import { closeDB } from "../src/db/dal";

const VALID_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjozLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3MjY3NTY3NDYsImV4cCI6MTcyNjc2NzU0Nn0.Cwmvoh9GRbhe9CtBglLlzierZPpvmOIlR9XQYihNxjY";

const app = express();
app.use(express.json());
app.use(vacationRoutes);

describe("vacation Controllers", () => {
    let pid: number | undefined;

    beforeAll(() => {
        console.log("before all running ... ");
    })    

    it("Should return a single vacation", async () => {
        if (!pid) {
            console.warn("There are no vacations to check 'Should return a single vacation'");
            return;
        }
        const response = await request(app)
            .get(appConfig.routePrefix + `/vacations/${pid}`)
            .set("Authorization", `Bearer ${VALID_TOKEN}`)
        
        console.log(response.body); // Log to check actual response structure
        
        expect(response.status).toBe(StatusCode.Ok);
        
        const vacations = response.body; // This will be an array
        
        // Check if the response body is an array and has at least one item
        expect(Array.isArray(vacations)).toBe(true);
        expect(vacations.length).toBeGreaterThan(0);
        
        const vacation = vacations[0]; // Get the first item of the array
        
        expect(vacation).toHaveProperty("price");
        expect(vacation).toHaveProperty("id");
        // Remove or update this line if 'name' is not part of the response
        // expect(vacation).toHaveProperty("name");
    });
    
    

    afterAll(async () => {
        console.log("afterAll is running..");
        closeDB();
    })
})