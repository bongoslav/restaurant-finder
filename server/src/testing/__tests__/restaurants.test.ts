import request from "supertest"
import app from "../../server";
import fs from "fs"

describe('Restaurant API', () => {
  // ? add more detailed expects
  it('should add a new restaurant', async () => {
    const restaurantData = {
      name: "Delicious restaurant",
      location: "Sofia, Bulgaria",
      price_range: "4"
    }
    await request(app)
      .post('/api/v1/restaurants/add-restaurant')
      .send(restaurantData)
      .expect(201);
  })

  it('should get all restaurants with reviews data', async () => {
    await request(app)
      .get('/api/v1/restaurants')
      .expect(200);
  })

  it('should get only the added restaurant with its reviews', async () => {
    await request(app)
      .get('/api/v1/restaurants/1')
      .expect(200);
  })

  it('should update a restaurant', async () => {
    const updatedRestaurant = {
      name: "updated restaurant",
      location: "updated location",
      price_range: "5",
    }
    await request(app)
      .put('/api/v1/restaurants/1')
      .send(updatedRestaurant)
      .expect(200)
  })

  // takes ~7s
  it('should add a restaurant photo', async () => {
    const filePath = `${__dirname}/../restaurant1.jpeg`
    console.log(filePath);
    const exists = fs.existsSync(filePath)
    if (!exists) throw new Error("Test error: File does not exist!")

    await request(app)
      .post('/api/v1/restaurants/1/add-photo')
      .attach('restaurant-photo', filePath)
      .set('Content-Type', 'multipart/form-data')
      .expect(200)
  }, 10000)
});
