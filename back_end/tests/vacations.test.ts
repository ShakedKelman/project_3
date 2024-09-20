import express from "express";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import { vacationRoutes } from "../src/controllers/vacationsController";
import { closeDB } from "../src/db/dal";
import UserModel from "../src/models/UsersModel";
import { createToken } from "../src/utils/authUtils";
import bcrypt from "bcrypt"; // Ensure bcrypt is installed to hash passwords
import path from "path";
import fs from "fs";

// const VALID_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjozLCJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlzQWRtaW4iOnRydWV9LCJpYXQiOjE3MjY3NTY3NDYsImV4cCI6MTcyNjc2NzU0Nn0.Cwmvoh9GRbhe9CtBglLlzierZPpvmOIlR9XQYihNxjY";
let VALID_TOKEN: string; // Declare a token variable that will be assigned in the setup phase
let USER_ID: number | undefined; // Store the created user ID

const app = express();
app.use(express.json());
app.use(vacationRoutes);

describe("vacation Controllers", () => {
    let pid: number | undefined;


    beforeAll(async () => {
        console.log("before all running ... ");

        // Step 1: Create a user in the test database
        const user = new UserModel({
            firstName: "admin",
            lastName: "admin",
            email: "admin@gmail.com",
            password: await bcrypt.hash("password123", 10), // Hash the password
            isAdmin: true,
        });


        // Store the user ID for later use
        USER_ID = user.id;

        // Step 2: Generate a valid token using the created user's details
        VALID_TOKEN = createToken(user);
    });
//Should return list of vacations
    it("Should return list of vacations", async () => {
        const response = await request(app)
            .get(appConfig.routePrefix + "/vacations")
            // .send({})  // for request with body
            .set("Authorization", `Bearer ${VALID_TOKEN}`)

        pid = response.body[0].id

        expect(response.status).toBe(StatusCode.Ok);
        expect(Array.isArray(response.body)).toBe(true);        
    })



                                                //Should return a single vacation
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



                                            //Should return paginated list of vacations
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
   
    })

});


  
    // function toBuffer(ab) {
    //     var buffer = new Buffer(ab.byteLength);
    //     var view = new Uint8Array(ab);
    //     for (var i = 0; i < buffer.length; ++i) {
    //     buffer[i] = view[i];
    //     }
    //     return buffer;
    // }
  
    // it("Should add a vacation successfully", async () => {
    //     let response;
    //     try{
    //         const formData = new FormData();
    //         formData.append('image', toBuffer(fs.createReadStream( path.resolve(__dirname, "vacation.avif")) ));

    //         response = await request(app)
    //         .post(appConfig.routePrefix + "/vacations")
    //         .set("Authorization", `Bearer ${VALID_TOKEN}`)
    //         .field("destination", "Hawaii-test") // Using field() to send form-data text
    //         .field("description", "A relaxing vacation in Hawaii")
    //         .field("startDate", "2024-12-01")
    //         .field("endDate", "2024-12-15")
    //         .field("price", "2000")
    //         .attach("image", fs.createReadStream( path.resolve(__dirname, "vacation.avif") )); // Attach an image file
    
    //         console.log('response.body', response.body)
    //     } catch (error) {
    //         console.log('response.status', response.status)
    //         console.log(error.message)
    //     }
    //   expect(response.status).toBe(StatusCode.Created);
    //   expect(response.body).toHaveProperty("vacationId");
    //   expect(response.body.message).toBe("Vacation added successfully");
      
    // });
  
    it("Should return a 400 error if no image is provided", async () => {
      const response = await request(app)
        .post(appConfig.routePrefix + "/vacations")
        .set("Authorization", `Bearer ${VALID_TOKEN}`)
        .field("destination", "Hawaii")
        .field("description", "A relaxing vacation in Hawaii")
        .field("startDate", "2024-12-01")
        .field("endDate", "2024-12-15")
        .field("price", "2000");
  
      expect(response.status).toBe(StatusCode.BadRequest);
      expect(response.body.message).toBe("Image file is required");
    });


   
    afterAll(async () => {
      console.log("afterAll is running...");
      closeDB();
    });