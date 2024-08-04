import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import app from "../../src/app";
import User from "../../src/models/user.model";
import Restaurant from "../../src/models/restaurant.model";
import { generateAccessToken } from "../../src/config/jwt";

const request = supertest(app);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Restaurant API", () => {
  let testUser: any;
  let testRestaurant: any;
  let accessToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Restaurant.deleteMany({});

    testUser = await User.create({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      name: "Test User",
    });

    testRestaurant = await Restaurant.create({
      name: "Test Restaurant",
      location: "Test Location",
      priceRange: 3,
      cuisine: "Test Cuisine",
      ownerId: testUser._id,
    });

    // silent console.error's
    jest.spyOn(console, "error");
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);

    accessToken = generateAccessToken(testUser._id);
  });

  describe("GET /", () => {
    it("should return all restaurants when authenticated", async () => {
      const response = await request
        .get("/api/v1/restaurants")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe("Test Restaurant");
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request.get("/api/v1/restaurants");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /:id", () => {
    it("should return a specific restaurant", async () => {
      const response = await request.get(
        `/api/v1/restaurants/${testRestaurant._id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.data[0].name).toBe("Test Restaurant");
    });

    it("should return 404 for non-existent restaurant", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request.get(`/api/v1/restaurants/${fakeId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should create a new restaurant when authenticated", async () => {
      const newRestaurant = {
        name: "New Restaurant",
        location: "New Location",
        priceRange: 4,
        cuisine: "New Cuisine",
        hours: ["8:00-17:00", "8:00-17:00"],
      };

      const response = await request
        .post("/api/v1/restaurants")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newRestaurant);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe("New Restaurant");
    });

    it("should return 401 when not authenticated", async () => {
      const newRestaurant = {
        name: "New Restaurant",
        location: "New Location",
        priceRange: 4,
        cuisine: "New Cuisine",
      };

      const response = await request
        .post("/api/v1/restaurants")
        .send(newRestaurant);

      expect(response.status).toBe(401);
    });

    it("should return 400 for invalid input", async () => {
      const invalidRestaurant = {
        name: "Invalid Restaurant",
        // missing required fields
      };

      const response = await request
        .post("/api/v1/restaurants")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidRestaurant);

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    it("should update a restaurant when authenticated and owner", async () => {
      const updatedData = {
        name: "Updated Restaurant",
        location: "Updated Location",
      };

      const response = await request
        .put(`/api/v1/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe("Updated Restaurant");
    });

    it("should return 401 when not authenticated", async () => {
      const updatedData = {
        name: "Updated Restaurant",
      };

      const response = await request
        .put(`/api/v1/restaurants/${testRestaurant._id}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });

    it("should return 403 when authenticated but not owner", async () => {
      const anotherUser = await User.create({
        email: "another@example.com",
        password: "password123",
        username: "anotheruser",
        name: "Another User",
      });
      const anotherToken = generateAccessToken(anotherUser._id);

      const updatedData = {
        name: "Updated Restaurant",
      };

      const response = await request
        .put(`/api/v1/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${anotherToken}`)
        .send(updatedData);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent restaurant", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updatedData = {
        name: "Updated Restaurant",
      };

      const response = await request
        .put(`/api/v1/restaurants/${fakeId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updatedData);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /:id", () => {
    it("should delete a restaurant when authenticated and owner", async () => {
      const response = await request
        .delete(`/api/v1/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);

      const deletedRestaurant = await Restaurant.findById(testRestaurant._id);
      expect(deletedRestaurant).toBeNull();
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request.delete(
        `/api/v1/restaurants/${testRestaurant._id}`
      );

      expect(response.status).toBe(401);
    });

    it("should return 403 when authenticated but not owner", async () => {
      const anotherUser = await User.create({
        email: "another@example.com",
        password: "password123",
        username: "anotheruser",
        name: "Another User",
      });
      const anotherToken = generateAccessToken(anotherUser._id);

      const response = await request
        .delete(`/api/v1/restaurants/${testRestaurant._id}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent restaurant", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request
        .delete(`/api/v1/restaurants/${fakeId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
