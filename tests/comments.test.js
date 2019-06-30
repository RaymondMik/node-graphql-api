import '@babel/polyfill';
import 'cross-fetch/polyfill'
import prisma from '../src/prisma';
import { seedDatabase, UserOne, PostTwo, CommentOne, CommentTwo } from './utils/seedDatabase'
import getClient from './utils/getClient'
import { createComment, deleteComment, subscribeToComments, subscribeToPosts } from './utils/operations'
import { doesNotReject } from 'assert';

const client = getClient()

beforeEach(seedDatabase, 20000)

describe('Comments test suite', () => {
   test('user should be able to create a comment', async () => {
      const client = getClient(UserOne.jwt)

      const { data } = await client.mutate({
         mutation: createComment,
            variables: {
               data: {
                  text: 'Just another comment, pal!',
                  post: PostTwo.data.id
               }
            }
      })

      const exists = await prisma.exists.Comment({ text: 'Just another comment, pal!'})
      expect(exists).toBe(true);
   })

   test('user should be able to delete own comment', async () => {
      const client = getClient(UserOne.jwt)

      await client.mutate({
         mutation: deleteComment,
            variables: {
               id: CommentOne.data.id
            }
      })

      const exists = await prisma.exists.Comment({ id: CommentOne.data.id})
      expect(exists).toBe(false);
   })

   test('user should not be able to delete another user\'s comment', async () => {
      const client = getClient(UserOne.jwt)

      await expect(
         client.mutate({
            mutation: deleteComment,
               variables: {
                  id: CommentTwo.data.id
               }
         })
      ).rejects.toThrow()
   })

   test('Should subscribe to comments for a post', async (done) => {
      client.subscribe({ query: subscribeToComments, variables: {postId: PostTwo.data.id} }).subscribe({
          next(response) {
              expect(response.data.comment.mutation).toBe('DELETED')
              done()
          }
      })
  
      await prisma.mutation.deleteComment({ where: { id: CommentOne.data.id }})
  })

  test('Should subscribe to changes for a published post', async (done) => {
      client.subscribe({ query: subscribeToPosts }).subscribe({
         next(response) {
            expect(response.data.post.mutation).toBe('DELETED')
            done()
         }
      })

      await prisma.mutation.deletePost({ where: { id: PostTwo.data.id }})
   })
});
