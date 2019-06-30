import '@babel/polyfill';
import 'cross-fetch/polyfill'
import prisma from './../src/prisma'
import { seedDatabase, UserOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createUser, loginUser, getUsers } from './utils/operations'

const client = getClient()

beforeEach(seedDatabase, 20000)

describe('Users test suite', () => {
    test('Should create a new user', async () => {
        const response = await client.mutate({
            mutation: createUser,
            variables: {
                data: {
                    name: "Steve",
                    email: "steve1@example.com",
                    password: "MyPass123"
                }
            }
        })
    
        const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
        expect(exists).toBe(true)
    })
    
    test('Should expose public author profiles', async () => {
        const response = await client.query({ query: getUsers })
    
        expect(response.data.users.length).toBe(2)
        expect(response.data.users[0].email).toBe(null)
        expect(response.data.users[0].name).toBe('Joe')
    })
    
    test('Should not login with bad credentials', async () => {
        const wrongPwd = 'blabla123'
    
        await expect(
            client.mutate({ 
                mutation: loginUser,
                variables: {
                    data: {
                        email: "mike@test.org",
                        password: wrongPwd
                    }
                }
            })
        ).rejects.toThrow()
    })
    
    test('should not sign up with invalid password', async () => {
        await expect(
            client.mutate({
                mutation: createUser,
                variables: {
                    data: {
                        name: "Micheal",
                        email: "micheal@example.com",
                        password: "My"
                    }
                }
             })
        ).rejects.toThrow()
    })

    test('Personal private author information should be exposed to logged in user', async () => {
        const client = getClient(UserOne.jwt)
        const { data } = await client.query({ query: getUsers })

        expect(data.users[0].id).toBe(UserOne.data.id)
        expect(data.users[0].email).toBe(UserOne.data.email)
    })
})
