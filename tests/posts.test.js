import '@babel/polyfill';
import 'cross-fetch/polyfill'
import prisma from '../src/prisma';
import { seedDatabase, getClient, UserOne, PostOne, PostTwo } from './utils/seedDatabase'
import { getPosts, updatePost, createPost, deletePost } from './utils/operations'


const client = getClient()

beforeEach(seedDatabase)

describe('Posts test suite', () => {
    test('Should expose the only post that is public', async () => {
        const response = await client.query({ query: getPosts })

        expect(response.data.posts.length).toBe(1)
        expect(response.data.posts[0].published).toBe(true)
    })

    test('Should expose only public author information', async () => {
        const response = await client.query({ query: getPosts })

        expect(response.data.posts[0].author.name).toBe('Joe')
        expect(response.data.posts[0].author.email).toBeFalsy()
    })

    test('Draft posts should be visible to logged in author', async () => {
        const client = getClient(UserOne.jwt)
        const { data } = await client.query({ query: getPosts })

        expect(data.posts.length).toBe(2)
    })

    // TODO make published only required field for update!
    test('Should be able to update own post', async () => {
        const client = getClient(UserOne.jwt)
        const { data } = await client.mutate({ 
            mutation: updatePost,
            variables: {
                id: PostOne.data.id,
                data: {
                    published: false
                }
            }
         })
        const exists = await prisma.exists.Post({ id: PostOne.data.id, published: false })
    
        expect(data.updatePost.published).toBe(false)
        expect(exists).toBe(true)
    })

    test('Should be able to create a post', async () => {
        const client = getClient(UserOne.jwt)

        await client.mutate({ 
            mutation: createPost,
            variables: {
                data: {
                    title: 'Exciting sighting in the Isonzo river',
                    body: 'Muli muli, look!',
                    published: false
                }
            }
        })
        const exists = await prisma.exists.Post({ title: 'Exciting sighting in the Isonzo river' })

        expect(exists).toBe(true)
    })

    test('Should be able to delete own Post', async () => {
        const client = getClient(UserOne.jwt)

        await client.mutate({ 
            mutation: deletePost,
            variables: {
                id: PostTwo.data.id
            }
        })
        const exists = await prisma.exists.Post({ id: PostTwo.data.id })

        expect(exists).toBe(false)

    })
})
