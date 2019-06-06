import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'
import ApolloBoost from 'apollo-boost'

/**
 * Generate user
 */
export const UserOne = {
    payloadInfo: {
        name: 'Joe',
        email: 'joe@test.org',
        password: bcrypt.hashSync('oilP99!?^-', bcrypt.genSaltSync(10))
    },
    data: undefined,
    jwt: undefined
}

export const PostOne = {
    payloadInfo: {
        title: 'Unbelieavable sighting #2',
        body: 'I almost hit a deer on my gravel bike',
        published: false,
    },
    data: undefined
}

export const PostTwo = {
    payloadInfo: {
        title: 'Unbelieavable sighting',
        body: 'I almost hit a wild boar on my trail bike',
        published: true,
    },
    data: undefined
}

/**
 * Provide ApolloBoost client object
 * @param {String} jwt 
 */
export const getClient = (jwt) => 
    new ApolloBoost({ 
        uri: 'http://localhost:4000',
        request(operation) {
            if (jwt) {
                operation.setContext({
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                })
            }
        }
    })

/**
 * Prepare database with data needed for testing - designed to be run beforeEach()
 */
export const seedDatabase = async () => {
   await prisma.mutation.deleteManyPosts()
   await prisma.mutation.deleteManyUsers()
   UserOne.data = await prisma.mutation.createUser({ data: UserOne.payloadInfo })
   UserOne.jwt = jwt.sign({ userId: UserOne.data.id }, process.env.JWT_SECRET)
   // create post one
   PostOne.data = await prisma.mutation.createPost({
       data: {
           ...PostOne.payloadInfo,
           author: {
               connect: {
                   id: UserOne.data.id
               }
           }
       }
   })
   // create post two
   PostTwo.data = await prisma.mutation.createPost({
       data: {
           ...PostTwo.payloadInfo,
           author: {
               connect: {
                   id: UserOne.data.id
               }
           }
       }
   })
}

export default seedDatabase