import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import supertest from "supertest";
import app from "../../src/app";
import User from "../../src/models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../src/config/jwt";
import bcrypt from "bcrypt";

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

describe("Auth API", () => {
  let testUser: any;
  let accessToken: string;
  let refreshToken: string;

  beforeEach(async () => {
    await User.deleteMany({});

    testUser = await User.create({
      email: "test@example.com",
      password: "password123", // storing the unhashed password for testing purposes
      username: "testuser",
      name: "Test User",
    });

    accessToken = generateAccessToken(testUser._id);
    refreshToken = generateRefreshToken(testUser._id);

    testUser.refreshTokens = [refreshToken];
    await testUser.save();

    // silent console.error's
    jest.spyOn(console, "error");
    // @ts-ignore jest.spyOn adds this functionallity
    console.error.mockImplementation(() => null);
  });

  describe("GET /me", () => {
    it("should return current user when authenticated", async () => {
      const response = await request
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.email).toBe("test@example.com");
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request.get("/api/v1/auth/me");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        email: "new@example.com",
        password: "newpassword123",
        username: "newuser",
        name: "New User",
      };

      const response = await request
        .post("/api/v1/auth/register")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("email", "new@example.com");
      expect(response.body.data).not.toHaveProperty("password");
    });

    it("should return 400 for invalid input", async () => {
      const invalidUser = {
        email: "invalid-email",
        password: "short",
      };

      const response = await request
        .post("/api/v1/auth/register")
        .send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request
        .post("/api/v1/auth/login")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
      expect(response.body.data.user).toHaveProperty(
        "email",
        "test@example.com"
      );
    });

    it("should return 400 for incorrect credentials", async () => {
      const incorrectCredentials = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request
        .post("/api/v1/auth/login")
        .send(incorrectCredentials);

      expect(response.status).toBe(400);
    });
  });

  describe("POST /logout", () => {
    it("should logout successfully when authenticated", async () => {
      const response = await request
        .post("/api/v1/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(response.status).toBe(200);

      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.refreshTokens).not.toContain(refreshToken);
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request.post("/api/v1/auth/logout");

      expect(response.status).toBe(401);
    });
  });

  describe("POST /refresh-token", () => {
    it("should return new access token with valid refresh token", async () => {
      const response = await request
        .post("/api/v1/auth/refresh-token")
        .set("Cookie", `refreshToken=${refreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("accessToken");
    });

    it("should return 401 with invalid refresh token", async () => {
      const response = await request
        .post("/api/v1/auth/refresh-token")
        .set("Cookie", "refreshToken=invalidtoken");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /users/:userId", () => {
    it("should return user data when authenticated", async () => {
      const response = await request
        .get(`/api/v1/auth/users/${testUser._id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.user).toHaveProperty(
        "email",
        "test@example.com"
      );
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request.get(`/api/v1/auth/users/${testUser._id}`);

      expect(response.status).toBe(401);
    });

    it("should return 404 for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request
        .get(`/api/v1/auth/users/${fakeId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PUT /users/:userId", () => {
    it("should update user data when authenticated", async () => {
      const updatedData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await request
        .put(`/api/v1/auth/users/${testUser._id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.data.user).toHaveProperty("name", "Updated Name");
      expect(response.body.data.user).toHaveProperty(
        "email",
        "updated@example.com"
      );
    });

    it("should return 401 when not authenticated", async () => {
      const updatedData = {
        name: "Updated Name",
      };

      const response = await request
        .put(`/api/v1/auth/users/${testUser._id}`)
        .send(updatedData);

      expect(response.status).toBe(401);
    });

    it("should return 403 when trying to update another user", async () => {
      const anotherUser = await User.create({
        email: "another@example.com",
        password: "password123",
        username: "anotheruser",
        name: "Another User",
      });

      const updatedData = {
        name: "Hacked Name",
      };

      const response = await request
        .put(`/api/v1/auth/users/${anotherUser._id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updatedData);

      expect(response.status).toBe(403);
    });
  });
});
