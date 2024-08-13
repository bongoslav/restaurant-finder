# Restaurant Finder MERN TypeScript App

[![Server Status](https://img.shields.io/website?url=https%3A%2F%2Frestaurant-finder-sdq5.onrender.com%2Fapi%2Fv1%2Frestaurants&label=server)](https://restaurant-finder-sdq5.onrender.com/api/v1/restaurants)
[![Netlify Status](https://api.netlify.com/api/v1/badges/1671a36f-59c8-4b1d-adfd-29ab9f86ab3c/deploy-status)](https://app.netlify.com/sites/restaurant-finder-bongoslav/deploys)

Restaurant Finder is a full-stack web application built with the MERN (MongoDB, Express, React, Node.js) stack and TypeScript. It allows users to discover, review, and manage restaurants.

## Live Demo

- **Client**: [https://restaurant-finder-bongoslav.netlify.app/](https://restaurant-finder-bongoslav.netlify.app/)
- **Server**: [https://restaurant-finder-sdq5.onrender.com/api/v1/restaurants](https://restaurant-finder-sdq5.onrender.com/api/v1/restaurants). Please note that `Render.com` free tier automatically puts the app to sleep if no requests are made recently. So if the server is down, most likely you need to make a single request and it will spin up after a minute.

I have created a demo user for easier use with credentials:
- email: `test@test.com`
- password: `12345678`

## Features

- User authentication (signup, login, logout)
- Browse restaurants with filtering and pagination
- View detailed restaurant information
- Add, edit, and delete reviews
- Restaurant management for owners
- Rate limiting

## Tech Stack

- **Frontend**: React, TypeScript, Radix UI
- **Backend**: Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT

## Project Structure

The project is divided into two main parts:

<details>
<summary><strong>Server</strong></summary>

The server is built with Node.js, Express, and TypeScript. It provides a RESTful API for the client to interact with the database and perform various operations.

### Key Features

- **Authentication**: Implements JWT-based authentication with access and refresh tokens.
- **CRUD Operations**: Supports Create, Read, Update, and Delete operations for restaurants and reviews.
- **Error Handling**: Custom error handling middleware for consistent error responses.
- **Input Validation**: Uses Joi for request payload validation.
- **Database Integration**: MongoDB integration using Mongoose ODM.
- **Security**: Implements rate limiting and other security best practices.

## JWT Authentication Flow

![JWT auth flow](https://mermaid.ink/img/pako:eNqVVcFu2zAM_RVChyEFEnQDdvKhwLAA62HrCjvdyRdVph0htuRJcrus6L-PtmwntmOvzckh-SjyPYp6YUInyAJm8XeFSuBW8szwIlZAv5IbJ4UsuXLwNZeo3NQeoXlCM7VvueOP3GKsvM_jNzc3HhDA_c9oB9e8cvvrXGdSwUoYTChG8txeeZCPJVCXLYBfaGR6hLNYH9pFbM6OeLBoICHHKFvn_4YKDXcIX4RAa-EDhJgatHvY6QMqO4ARzvcQkEUl4JoQWLVYaoCQpVYW130aMt7udvcbrXIqWeuDxKsRHX1Op01fSHN8jY7on9Sq8fKsJ_NOU9GaqmrzrLuOourRK-mgZrZmSFCDCdVGVuvsrByhD4Bn6faDMma4a3WYRvLcDdt44rlMvO8ynWHLmz_7pBfmdsQI_iklCb-U7PPHT_Cg6ua1kX_PY5cm0HjBNo2osGoKGcxCLcZAwCVSBshTeM3MMOmImuUhVfh8ge55Ju4W42cGUL0NdJoaZ45ATNMF5nk3ZV7I-VSNsGN6Gy4o1VTk9wp9sb0QE8oqHN1b2OsCz6pRLbb5-M8F-64zXTkoja4be-NyI8RolZz22RZzpLPaAfRbBVKjC6hst1f7meiaqUFTlJ_PuaXVVi60SqUpuKO1MrOKQiyo9eHNayoqyGGOsWJrViDlkAm9HC91lpjRsiFSWUCfCTeHmMXqleKIAh0dlWCBMxWumdFVtmdBSnub_lUl3fbuzemtpBTN4g__MDXv0-s_edw2BA?bgColor=303030)
Brief explanation of the JWT authentication flow:

1. **Login**: Client sends credentials, server verifies and generates Access and Refresh tokens.
2. **Token Storage**: Access Token stored in client memory, Refresh Token in HTTP-only cookie.
3. **Authenticated Requests**: Client includes Access Token in request headers.
4. **Token Refresh**: When Access Token expires, client uses Refresh Token to get a new Access Token.
5. **Logout**: Server invalidates Refresh Token, client removes Access Token from memory.

### API Routes

- **Auth Routes**:

  - GET `/api/v1/auth/me`: Get currently logged in user
  - POST `/api/v1/auth/register`: User registration
  - POST `/api/v1/auth/login`: User login
  - POST `/api/v1/auth/logout`: User logout
  - POST `/api/v1/auth/refresh-token`: Refresh access token
  - GET `/api/v1/auth/users/:userId`: Get single user
  - PUT `/api/v1/auth/user/:userId`: Update user

- **Restaurant Routes**:

  - GET `/api/v1/restaurants`: Get all restaurants (with filtering and pagination)
  - GET `/api/v1/restaurants/:id`: Get a specific restaurant
  - POST `/api/v1/restaurants`: Create a new restaurant
  - PUT `/api/v1/restaurants/:id`: Update a restaurant
  - DELETE `/api/v1/restaurants/:id`: Delete a restaurant

- **Review Routes**:
  - GET `/api/v1/restaurants/:restaurantId/reviews`: Get all reviews for a restaurant
  - POST `/api/v1/restaurants/:restaurantId/reviews`: Add a new review
  - DELETE `/api/v1/restaurants/:restaurantId/reviews/:reviewId`: Delete a review

### Middleware

- `auth.ts`: Authentication middleware to protect routes
- `isRestaurantOwner.ts`: Middleware to check if the user is the owner of a restaurant
- `isReviewAuthor.ts`: Middleware to check if the user is the author of a review
- `rateLimit.ts`: Rate limiting middleware to prevent abuse
- `validateRequest.ts`: Request validation middleware using Joi schemas

### Testing

The server includes unit tests for the main functionalities using Jest and Supertest.

</details>

<details>
<summary><strong>Client</strong></summary>

The client is built with React and TypeScript, providing a user-friendly interface for interacting with the Restaurant Finder application.

### Key Features

- **Responsive Design**: Built with Radix UI for a consistent and responsive user interface.
- **State Management**: Uses React Context for global state management (auth, theme).
- **Routing**: Implements client-side routing with React Router.
- **Data Fetching**: Utilizes SWR for efficient data fetching and caching.
- **Form Handling**: Custom form components for user input (login, signup, reviews).
- **Error Handling**: Displays user-friendly error messages and handles API errors gracefully.

### Main Components

- `RestaurantListPage`: Displays a grid of restaurants with filtering options.
- `RestaurantDetailsPage`: Shows detailed information about a specific restaurant, including reviews.
- `AddReviewForm`: Allows authenticated users to submit reviews for restaurants.
- `LoginDialog` and `SignupDialog`: Handles user authentication.
- `EditRestaurantDialog`: Enables restaurant owners to update their restaurant information.

### Hooks

- `useAuth`: Custom hook for accessing authentication context and methods.
- `useTheme`: Manages the application's theme (light/dark mode).

</details>

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository
2. Navigate to the `server` directory and run `npm install`
3. Set up your environment variables in a `.env` file (see `.env.example` for required variables)
4. Start the server with `npm run dev`
5. Navigate to the `client` directory and run `npm install`
6. Set up your environment variables in a `.env` file (see `.env.example` for required variables)
7. Start the client with `npm run dev`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
