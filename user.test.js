const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })

it('gets the user endpoint', async done => {
    const response = await request.get('/users')
    expect(response.status).toBe(200)
    done()
  })