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
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Review Endpoints", () => {
  let testUser: any;
  let testRestaurant: any;
  let testReview: any;
  let accessToken: string;

  beforeEach(async () => {
    // clear the database before use
    await User.deleteMany({});
    await Restaurant.deleteMany({});

    // create a test user
    testUser = await User.create({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
      name: "Test User",
    });

    // create a test restaurant
    testRestaurant = await Restaurant.create({
      name: "Test Restaurant",
      location: "Test Location",
      priceRange: 3,
      cuisine: "Test Cuisine",
      ownerId: testUser._id,
    });

    // create a test review
    testReview = {
      title: "Great place!",
      rating: 5,
      text: "Really enjoyed my meal here.",
      userId: new mongoose.Types.ObjectId(),
    };

    testRestaurant.reviews.push({
      ...testReview,
      userId: testUser._id,
    });
    await testRestaurant.save();

    // generate access token for authentication
    accessToken = generateAccessToken(testUser._id);

    // silent console.error's
    jest.spyOn(console, "error");
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });

  describe("GET /:restaurantId/reviews", () => {
    it("should return all reviews for a restaurant", async () => {
      const response = await request.get(
        `/api/v1/restaurants/${testRestaurant._id}/reviews`
      );

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe(testReview.title);
    });

    it("should return 404 for non-existent restaurant", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request.get(
        `/api/v1/restaurants/${fakeId}/reviews`
      );

      expect(response.status).toBe(404);
    });
  });

  describe("POST /:restaurantId/reviews", () => {
    it("should create a new review when authenticated", async () => {
      const newReview = {
        title: "Delicious food",
        rating: 4,
        text: "The pasta was amazing!",
      };

      const response = await request
        .post(`/api/v1/restaurants/${testRestaurant._id}/reviews`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(newReview);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("reviews");
      expect(response.body.data.reviews).toHaveLength(2);
      expect(response.body.data.reviews[1].title).toBe(newReview.title);
    });

    it("should return 401 when not authenticated", async () => {
      const newReview = {
        title: "Delicious food",
        rating: 4,
        text: "The pasta was amazing!",
      };

      const response = await request
        .post(`/api/v1/restaurants/${testRestaurant._id}/reviews`)
        .send(newReview);

      expect(response.status).toBe(401);
    });

    it("should return 400 for invalid review data", async () => {
      const invalidReview = {
        title: "Some review name",
        rating: 6, // invalid rating
        text: "OK",
      };

      const response = await request
        .post(`/api/v1/restaurants/${testRestaurant._id}/reviews`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(invalidReview);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /:restaurantId/reviews/:reviewId", () => {
    it("should return a specific review when authenticated", async () => {
      const reviewId = testRestaurant.reviews[0]._id;

      const response = await request
        .get(`/api/v1/restaurants/${testRestaurant._id}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(testReview.title);
    });

    it("should return 401 when not authenticated", async () => {
      const reviewId = testRestaurant.reviews[0]._id;

      const response = await request.get(
        `/api/v1/restaurants/${testRestaurant._id}/reviews/${reviewId}`
      );

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent review", async () => {
      const fakeReviewId = new mongoose.Types.ObjectId();

      const response = await request
        .get(
          `/api/v1/restaurants/${testRestaurant._id}/reviews/${fakeReviewId}`
        )
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /:restaurantId/reviews/:reviewId", () => {
    it("should delete a review when authenticated and author", async () => {
      const reviewId = testRestaurant.reviews[0]._id;

      const response = await request
        .delete(`/api/v1/restaurants/${testRestaurant._id}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(204);

      // Verify the review was deleted
      const updatedRestaurant = await Restaurant.findById(testRestaurant._id);
      expect(updatedRestaurant.reviews).toHaveLength(0);
    });

    it("should return 401 when not authenticated", async () => {
      const reviewId = testRestaurant.reviews[0]._id;

      const response = await request.delete(
        `/api/v1/restaurants/${testRestaurant._id}/reviews/${reviewId}`
      );

      expect(response.status).toBe(401);
    });

    it("should return 403 when authenticated but not the author", async () => {
      const anotherUser = await User.create({
        email: "another@example.com",
        password: "password123",
        username: "anotheruser",
        name: "Another User",
      });
      const anotherToken = generateAccessToken(anotherUser._id);

      const reviewId = testRestaurant.reviews[0]._id;

      const response = await request
        .delete(`/api/v1/restaurants/${testRestaurant._id}/reviews/${reviewId}`)
        .set("Authorization", `Bearer ${anotherToken}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent review", async () => {
      const fakeReviewId = new mongoose.Types.ObjectId();

      const response = await request
        .delete(
          `/api/v1/restaurants/${testRestaurant._id}/reviews/${fakeReviewId}`
        )
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });
});
