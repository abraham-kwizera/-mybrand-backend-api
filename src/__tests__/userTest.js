import app from '../../index.js';
import userModel from '../models/userModel.js';
import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';

const { it, describe, beforeEach, afterEach } = mocha;
const { expect } = chai;

const webUser = {
    firstName: 'username',
    lastName: 'lastname',
    userName: 'username',
    email: 'username@gmail.com',
    provider: 'email',
    password: 'userpassword',
    confirmPassword: 'userpassword',
    role: 'admin'
};

const webUserCredentials = {
    email: 'username@gmail.com',
    password: 'userpassword',
};

describe('User API tests:', () => {
    beforeEach(async() => {
        await userModel.deleteMany({});
    });

    afterEach(async() => {
        await userModel.deleteMany({});
    });

    it('Create a user', async() => {
        const res = await request(app).post('/users/register').send(webUser);
        console.log(res)
        expect(res.status).to.be.equal(201);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', `User ${firstName} ${lastName} Is Created Successfully`);
    });

    it('Fail to create a user when some fields missing', async() => {
        const res = await request(app).post('/users/register').send({
            firstName: 'username',
            lastName: 'username',
            userName: 'username',
            email: 'email@gmail.com',
        });
        expect(res.status).to.be.equal(500);
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'User Registration error, Try again...');
    });

    it('create a user with short password', async() => {
        const res = await request(app).post('/users/register').send({
            firstName: 'username',
            lastName: 'username',
            userName: 'username',
            email: 'username@gmail.com',
            provider: 'email',
            password: 'usern',
            confirmPassword: 'usern',
            role: 'admin'
        });
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'Fill in a strong password');
    });

    it('User should log in', async() => {
        await request(app).post('/users/register').send(webUser);
        const res = await request(app).post('/users/login').send(webUserCredentials);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'Login successfully');
    });

    it('get all users test', async() => {
        await request(app).post('/users/login').send(webUserCredentials);
        const res = await request(app).get('/users');
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'All users successfully retrieved');
    });

    it('get one user test', async() => {
        const user = await userModel.create(webUser);
        user.save();
        const res = await request(app).get(`/users/${user._id}`);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'Successfully got one user');
    });

    it('delete a user test', async() => {
        const user = await userModel.create(webUser);
        user.save();
        console.log(user._id);

        const res = await request(app).delete(`/users/${user._id}`);
        expect(res.status).to.be.equal(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message', 'Deleted user successfully');
    });
});