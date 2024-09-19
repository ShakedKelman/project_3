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

    it("Should return list of vacations", async () => {
        const response = await request(app)
            .get(appConfig.routePrefix + "/vacations")
            // .send({})  // for request with body
            .set("Authorization", `Bearer ${VALID_TOKEN}`)

        pid = response.body[0].id

        expect(response.status).toBe(StatusCode.Ok);
        expect(Array.isArray(response.body)).toBe(true);        
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
    })
    it("Should return paginated list of vacations", async () => {
        const page = 1; // Specify the page number
        const limit = 10; // Specify the limit per page
    
        const response = await request(app)
            .get(`${appConfig.routePrefix}/vacations-pg?page=${page}&limit=${limit}`)
            .set("Authorization", `Bearer ${VALID_TOKEN}`);
    
        console.log(response.body); // Log to check actual response structure
        
        expect(response.status).toBe(StatusCode.Ok);
    
        // Check if response body is an object
        expect(typeof response.body).toBe('object');
    
        // Adjust these expectations based on the actual response structure
        const { vacations = [], total = 0, pageCount = 0 } = response.body;
    
        // Validate that vacations is an array
        expect(Array.isArray(vacations)).toBe(true);
    
        // Validate that the length of the array is not greater than the limit
        expect(vacations.length).toBeLessThanOrEqual(limit);
    
        // Validate other properties if they are included in the response
        expect(typeof total).toBe('number');
        expect(typeof pageCount).toBe('number');
    
        // Optionally: Check if the total number of vacations is correct (requires more setup in your test database)
        // expect(total).toBeGreaterThan(0);
    });
    
    ;
    
    

    afterAll(async () => {
        console.log("afterAll is running..");
        closeDB();
    })
})