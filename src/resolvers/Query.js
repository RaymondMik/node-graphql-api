import { getUserId } from './../utils'
import { assertValidSchema } from 'graphql';

const Query = {
   users(parent, args, { prisma }, info) {
      const opArgs = {
         first: args.first,
         skip: args.skip,
         after: args.after,
         orderBy: args.orderBy
      }

      if (args.query) {
         opArgs.where = {
            OR: [{
               name_contains: args.query
            }]
         }
      }

      return prisma.query.users(opArgs, info)
   },
   async posts(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false)
      
      const posts = await prisma.query.posts({
         first: args.first,
         skip: args.skip,
         after: args.after,
         orderBy: args.orderBy,
         where: {
            id: args.id,
            OR: [{ published: true },
               {
                  author: {
                     id: userId
                  }
               }]
         }
      }, info)

      return posts
   },
   async post(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false)
      
      const [ post ] = await prisma.query.posts({
         where: {
            id: args.id,
            OR: [{ published: true },
               {
                  author: {
                     id: userId
                  }
               }]
         }
      }, info)

      if (!post) throw new Error('post not found')

      return post
   },
   comments(parent, args, { prisma }, info) {
      return prisma.query.comments({
         first: args.first,
         skip: args.skip,
         after: args.after,
         orderBy: args.orderBy
      }, info)
   }
};

export default Query