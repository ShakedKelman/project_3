import express from "express";
import request from "supertest";
import { appConfig } from "../src/utils/appConfig";
import { StatusCode } from "../src/models/statusEnum";
import { vacationRoutes } from "../src/controllers/vacationsController";

const VALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyV2l0aG91dFBhc3N3b3JkIjp7ImlkIjoxMSwiZmlyc3ROYW1lIjoiZG5hbmFueSIsImxhc3ROYW1lIjoiRG9lIiwiZW1haWwiOiJkYW55eS5kb2VAZXhhbXBsZS5jb20iLCJpc0FkbWluIjp0cnVlfSwiaWF0IjoxNzI1NzE4NTQzLCJleHAiOjE3MjU3MjkzNDN9.SfwhjK1CR07Iz_KTtcKVrurlYBnL5dmtfD74_XAq0ZA"

const app = express();
app.use(express.json());
app.use(vacationRoutes);

describe("vacations Controllers", () => {
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
            console.warn("There is no vacations to check 'Should return a single vacation'")
            return;
        }
        const response = await request(app)
            .get(appConfig.routePrefix + `/vacations/${pid}`)
            .set("Authorization", `Bearer ${VALID_TOKEN}`)

        expect(response.status).toBe(StatusCode.Ok);
        const vacation = response.body[0];

        expect(vacation).toHaveProperty("price");
        expect(vacation).toHaveProperty("id");
        expect(vacation).toHaveProperty("destination");
    })

    afterAll(async () => {
        console.log("afterAll is running..");
    })
})
