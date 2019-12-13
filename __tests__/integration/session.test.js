const request  = require("supertest");
const app  = require("../../src/app");
const  factory  = require('../factories');
const truncate  = require("../utils/truncate");

describe('Authentication',() =>{
    
    //antes de cada teste executar a remoção de models
    beforeEach(async () => {
        await truncate();
    })

    it("Should authenticate whit valid credentials", async () => {
       
        const user = await factory.create('User', {
            password: '123123'
        });
        const response =  await request(app)
        .post('/sessions')
        .send({
            email:user.email,
            password:"123123",
        }
        )
        //console.log('success', user.toJSON());
        expect(response.status).toBe(200)    
    });  

    it("Should not authenticate whit invalid credencials", async () => {

        const user = await factory.create('User', {
            password: '123123'
        });
        const response =  await request(app)
        .post('/sessions')
        .send({
            email:user.email,
            password:"123456",
        }
        )
        //console.log('success', user.toJSON());
        expect(response.status).toBe(401)   
    });

    it("should return jwt token when authenticated", async () => { 
        
        const user = await factory.create('User', {
            password: '123123'
        });
        const response =  await request(app)
        .post('/sessions')
        .send({
            email:user.email,
            password:"123123"
        })
        console.log('success', response.body);
        expect(response.body).toHaveProperty('token');    
    });

    it("should be able to access private routes when authenticated", async () => {
        const user = await factory.create('User', {
            password: '123123'
        });
        const response =  await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer ${user.generateToken()}`);
        
        expect(response.status).toBe(200);    
    });

    it("should not be able to access private routes whithout JWT token", async () => {
        const response =  await request(app)
        .get('/dashboard');
        
        expect(response.status).toBe(401);    
    });

    it("should not be able to access private routes whith invalid JWT token ", async () => {
        const user = await factory.create('User', {
            password: '123123'
        });
        const response =  await request(app)
        .get('/dashboard')
        .set('Authorization', `Bearer 123`);;
        
        expect(response.status).toBe(401);    
    });
});