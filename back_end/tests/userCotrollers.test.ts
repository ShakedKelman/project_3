import express from "express";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import UserModel from "../src/models/UsersModel"; // Ensure this import is correct
import { userRoutes } from "../src/controllers/userControllers";

const app = express();
app.use(express.json());
app.use(userRoutes);

describe("User Controllers", () => {
    let testUser: { email: string; password: string; token?: string };
    let userId: number | undefined;

    beforeAll(async () => {
        // Set up any necessary initial conditions
        console.log("before all running ... ");
        
        // Insert test user into database
        testUser = {
            email: "john.doe@example.com",
            password: "hashed_password",
        };

    

        // You might want to use a service or model method to add test data here.
        // e.g., await UserModel.create({ ... })
    });
    it("Should register a new user", async () => {
        const response = await request(app)
            .post(appConfig.routePrefix + "/register")
            .send({
                firstName: "Test",
                lastName: "User",
                email: testUser.email,
                password: testUser.password,
                isAdmin: 0, // Add this line
            });
    
        console.log(response.body); // Debugging output
        expect(response.status).toBe(StatusCode.Created);
        expect(response.body).toHaveProperty("token");
        testUser.token = response.body.token;
    });
    
    
    

    it("Should login a user", async () => {
        // Make sure the test user exists in the database
        // and the password matches the hashed version in the database
        const response = await request(app)
            .post(appConfig.routePrefix + "/login")
            .send({
                email: testUser.email,
                password: testUser.password,
            });
    
        console.log(response.body); // Debugging output
        expect(response.status).toBe(StatusCode.Ok);
        expect(response.body).toHaveProperty("token");
        testUser.token = response.body.token;
    });
    
    

    it("Should return a list of users", async () => {
        const response = await request(app)
            .get(appConfig.routePrefix + "/allUsers")
            .set("Authorization", `Bearer ${testUser.token}`);

        expect(response.status).toBe(StatusCode.Ok);
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            userId = response.body[0].id;
        }
    });

    afterAll(async () => {
        // Clean up any test data
        console.log("afterAll is running..");
        
        // Optionally, you can delete the test user from the database here.
        // e.g., await UserModel.delete({ email: testUser.email });
    });
});
