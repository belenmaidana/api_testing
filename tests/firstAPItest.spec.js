const { test, expect } = require('@playwright/test');
const bookingDetails = require('../test-data/booking-details.json');
const { faker } = require('@faker-js/faker');
const { DateTime } = require('luxon');
var token


const randomFirstName = faker.person.firstName()
const randomLastName = faker.person.lastName()
const randomNumber = faker.random.numeric(4)
const currentDate = DateTime.now().toFormat('yyyy-MM-dd')
const currentDatePlusFive = DateTime.now().plus({ days: 5 }).toFormat('yyyy-MM-dd')


test('should be able to delete the booking details', async ({ request }) => {


    // Create a Token which will be used in DELETE request
    
    
    const response = await request.post('/ auth', {
    data: {
    "username": "admin",
    "password": "password123"
    }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("New Token is: " + token);
    
    
    // DELETE
    
    
    const deleteRequest = await request.delete('/booking/1', {
    headers: {
    'Content-Type': 'application/json',
    'Cookie': 'token=${token}'
    }
    });
    expect(deleteRequest.status()).toEqual(201);
    expect(deleteRequest.statusText()).toBe('Created');
    });


test('should be able to partial update the booking details', async ({ request }) => {


    // Create a Token which will be used in PATCH request
    
    
    const response = await request.post('/auth', {
    data: {
    "username": "admin",
    "password": "password123"
    }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("New Token is: " + token);
    
    
    // PATCH
    
    
    const partialUpdateRequest = await request.patch('/booking/1', {
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': `token=${token}`,
    },
    data: {
    "firstname": "Sim",
    "lastname": "Son",
    "totalprice": 333,
    "depositpaid": false
    }
    });
    console.log(await partialUpdateRequest.json());
    expect(partialUpdateRequest.ok()).toBeTruthy();
    expect(partialUpdateRequest.status()).toBe(200);
    const partialUpdatedResponseBody = await partialUpdateRequest.json()
    expect(partialUpdatedResponseBody).toHaveProperty("firstname", "Sim");
    expect(partialUpdatedResponseBody).toHaveProperty("lastname", "Son");
    expect(partialUpdatedResponseBody).toHaveProperty("totalprice", 333);
    expect(partialUpdatedResponseBody).toHaveProperty("depositpaid", false);
    });

test('should be able to update the booking details', async ({ request }) => {


    // Create a Token which will be used in PUT request
       
    const response = await request.post('/auth', {
    data: {
    "username": "admin",
    "password": "password123"
    }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    token = responseBody.token;
    console.log("New Token is: " + token);
    
    
    // PUT
    const updateRequest = await request.put('/booking/1', {
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': `token=${token}`,
    },
    data: {
    "firstname": "Jim",
    "lastname": "Brown",
    "totalprice": 111,
    "depositpaid": true,
    "bookingdates": {
    "checkin": "2023-06-01",
    "checkout": "2023-06-15"
    },
    "additionalneeds": "Breakfast"
    }
    })
    console.log(await updateRequest.json());
    expect(updateRequest.ok()).toBeTruthy();
    expect(updateRequest.status()).toBe(200);
    const updatedResponseBody = await updateRequest.json()
    expect(updatedResponseBody).toHaveProperty("firstname", "Jim");
    expect(updatedResponseBody).toHaveProperty("lastname", "Brown");
    expect(updatedResponseBody).toHaveProperty("totalprice", 111);
    expect(updatedResponseBody).toHaveProperty("depositpaid", true);
    });






test('should be able to get subset of booking details using query parameters - checkin date example', async ({ request }) => { 
    const response = await request.get('/booking', {
    params: {
    checkin: "2023-03-25",
    checkout: "2024-12-25"
    },
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    });



test('should be able to get subset of booking details using query parameters', async ({ request }) => {  // no devuelve nada
    const response = await request.get('/booking', {
    params: {
    firstname: "Enid",
    lastname: "Sporer"
    },
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    console.log(response.headers());
    console.log(await response.status());
    console.log(await response.body());

    });


test('should be get specific booking details', async ({ request }) => {
    const response = await request.get('/booking/1145');
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    });



test.only('should be get all the booking details', async ({ request }) => {
    const response = await request.get("/booking");
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});



test('should be able to create a booking - dynamic data', async ({ request }) => { //ver error randomNumber
    const response = await request.post("/booking", {
        data: {
            "firstname": randomFirstName,
            "lastname": randomLastName,
            "totalprice": randomNumber,
            "depositpaid": true,
            "bookingdates": {
                "checkin": currentDate,
                "checkout": currentDatePlusFive
            },
            "additionalneeds": "Breakfast"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", randomFirstName);
    expect(responseBody.booking).toHaveProperty("lastname", randomLastName);
    expect(responseBody.booking).toHaveProperty("totalprice", parseInt(randomNumber));         //verificar que la comprobacion es con el mismo tipo de dato
    expect(responseBody.booking).toHaveProperty("depositpaid", true);
});


test('should be able to create a booking', async ({ request }) => {
    const response = await request.post("/booking", {
        data: {
            "firstname": "Jim",
            "lastname": "Brown",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2023-06-01",
                "checkout": "2023-06-15"
            },
            "additionalneeds": "Breakfast"
        }
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", "Jim");
    expect(responseBody.booking).toHaveProperty("lastname", "Brown");
    expect(responseBody.booking).toHaveProperty("totalprice", 111);
    expect(responseBody.booking).toHaveProperty("depositpaid", true);
});

test('should be able to create a booking - test-data json file', async ({ request }) => {
    const response = await request.post("/booking", {
        data: bookingDetails
    });
    console.log(await response.json());
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json()
    expect(responseBody.booking).toHaveProperty("firstname", "Jim");
    expect(responseBody.booking).toHaveProperty("lastname", "Brown");
    expect(responseBody.booking).toHaveProperty("totalprice", 111);
    expect(responseBody.booking).toHaveProperty("depositpaid", true);
});