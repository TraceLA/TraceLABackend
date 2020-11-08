const app = require('./server') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)

it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })

it('GET users', async done => {
    const response = await request.get('/users')
    expect(response.status).toBe(200)
    done()
  })

it('GET users with valid username', async done => {
    const response = await request.get('/users?username=small')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("first_name");
    expect(response.body[0]).toHaveProperty("last_name");
    expect(response.body[0]).toHaveProperty("email");
    done()
})

it('GET users with valid first and last name', async done => {
    const response = await request.get('/users?first_name=peek&last_name=chew')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("first_name");
    expect(response.body[0]).toHaveProperty("last_name");
    expect(response.body[0]).toHaveProperty("email");
    done()
})

it('GET users with invalid username', async done => {
    const response = await request.get('/users?username=idontexist')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(0);
    done()
})

it('GET users with invalid first and last name', async done => {
    const response = await request.get('/users?first_name=invalidfirstname&last_name=invalidlastname')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(0);
    done()
})




