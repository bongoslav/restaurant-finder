// ! to migrate postgre to mongo
export const restaurants = [
  {
    id: 1,
    name: "Tasty Burger",
    location: "10 Vitosha boulevard, Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [
      {
        id: 1,
        title: "Good",
        authorId: "", // references the user document
        rating: 4.5,
        text: "This is a good restaurant",
      },
      {
        id: 2,
        title: "Very Good",
        authorId: "",
        rating: 5,
        text: "This is the best restaurant",
      },
    ],
  },
  {
    id: 2,
    name: "Tasty Burger",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [
      {
        id: 1,
        title: "Good",
        authorId: "", // references the user document
        rating: 4.5,
        text: "This is a good restaurant",
      },
      {
        id: 2,
        title: "Very Good",
        authorId: "",
        rating: 5,
        text: "This is the best restaurant",
      },
    ],
  },
  {
    id: 4,
    name: "No reviews",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
  {
    id: 6,
    name: "No reviews",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
  {
    id: 11,
    name: "Tasty Burger",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [
      {
        id: 1,
        title: "Good",
        authorId: "", // references the user document
        rating: 4.5,
        text: "This is a good restaurant",
      },
      {
        id: 2,
        title: "Very Good",
        authorId: "",
        rating: 5,
        text: "This is the best restaurant",
      },
    ],
  },
  {
    id: 22,
    name: "Tasty Burger",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [
      {
        id: 1,
        title: "Good",
        authorId: "", // references the user document
        rating: 4.5,
        text: "This is a good restaurant",
      },
      {
        id: 2,
        title: "Very Good",
        authorId: "",
        rating: 5,
        text: "This is the best restaurant",
      },
    ],
  },
  {
    id: 44,
    name: "No reviews",
    location: "Vitoshka, Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
  {
    id: 66,
    name: "No reviews",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
  {
    id: 444,
    name: "No reviews",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
  {
    id: 666,
    name: "No reviews",
    location: "Sofia, Bulgaria",
    priceRange: 4,
    images: ["https://place-hold.it/300x200", ""],
    cuisine: "American",
    reviews: [],
  },
];

export const users = [
  {
    id: 1,
    name: "Ivan",
    email: "ivan@example.com",
    password: "hashed_password_1",
    username: "ivan_123",
    refreshToken: "stored_refresh_token_1",
  },
];
