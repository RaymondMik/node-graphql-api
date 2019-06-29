import '@babel/polyfill';
import 'cross-fetch/polyfill'
import prisma from '../src/prisma';
import { seedDatabase, getClient, UserOne, PostTwo, CommentOne, CommentTwo } from './utils/seedDatabase'
import { createComment, deleteComment } from './utils/operations'

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
});