import bcrypt from 'bcrypt'
import { getUserId, getJwt, hashPassword } from './../utils'

const Mutation = {
   async createUser(parent, args, { prisma }, info) {
      // check if entered email is unique
      const isEmailTaken = await prisma.exists.User({ email: args.data.email })
      
      if (isEmailTaken) throw new Error('email already taken')

      const password = await hashPassword(args.data.password)

      const user = await prisma.mutation.createUser({ 
         data: {
            ...args.data,
            password
         }
      })

      return {
         user,
         token: getJwt(user.id, '7 days')
      }
   },
   async loginUser(parent, args, { prisma }, info) {
      const user = await prisma.query.user({
         where: {
            email: args.data.email
         }
      })

      const doesPwdMatches = await bcrypt.compare(args.data.password, user.password)
      if (!user || !doesPwdMatches) throw new Error('unable to login')

      return {
         user,
         token: getJwt(user.id, '7 days')
      }
   },
   async deleteUser(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      // check if user exists
      const doesUserExist = await prisma.exists.User({ id: userId })
      if (!doesUserExist) throw new Error('user does not exist')

      return prisma.mutation.deleteUser({ 
         where: {
            id: args.id 
         }
      }, info)
   },
   async updateUser(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      if (typeof args.data.password === 'string') {
         args.data.password = await hashPassword(args.data.password)
      }

      return prisma.mutation.updateUser({ 
         where: { id: userId }, 
         data: args.data
      }, info)
   },
   createPost(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)
      
      return prisma.mutation.createPost({ 
         data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
               connect: {
                  id: userId
               }
            }
         }
      }, info)
   },
   async deletePost(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)

      const doesPostExist = await prisma.exists.Post({
         id: args.id,
         author: {
            id: userId
         }
      })

      if (!doesPostExist) throw new Error('you are unable to delete this post')

      return prisma.mutation.deletePost({
         where: {
            id: args.id
         }
      }, info)
   },
   async updatePost(parent, {id, title, body, published}, { prisma, request }, info) {
      const userId = getUserId(request)

      const doesPostExist = await prisma.exists.Post({
         id: id,
         author: {
            id: userId
         }
      })

      const isPostPublished = await prisma.exists.Post({ id: id, published: true })

      if (isPostPublished && !published) {
         prisma.mutation.deleteManyComments({
            where: {
               post: {
                  id
               }
            }
         })
      }

      if (!doesPostExist) throw new Error('you are unable to update this post')

      return prisma.mutation.updatePost({
         data: {
            title,
            body,
            published
         },
         where: {
            id
         }
      }, info)
   },
   async createComment(parent, { data: { text, post } }, { prisma, request }, info) {
      const userId = getUserId(request)
      const doesPostExist = await prisma.exists.Post({ id: post, published: true })

      if (!doesPostExist) throw new Error('user or post do not exist')

      return prisma.mutation.createComment({ 
         data: {
            text: text,
            author: {
               connect: {
                  id: userId
               }
            },
            post: {
               connect: {
                  id: post
               }
            }
         }
      }, info)
   },
   async deleteComment(parent, { id }, { prisma, request }, info) {
      const userId = getUserId(request)

      const doesCommentExist = await prisma.exists.Comment({
         id,
         author: {
            id: userId
         }
      })

      if (!doesCommentExist) throw new Error('cannot delete comment')

      return prisma.mutation.deleteComment({
         where: {
            id
         }
      }, info)
   },
   async updateComment(parent, { id, text }, { prisma, request }, info) {
      const userId = getUserId(request)

      const doesCommentExist = await prisma.exists.Comment({
         id,
         author: {
            id: userId
         }
      })

      if (!doesCommentExist) throw new Error('cannot update comment')

      return prisma.mutation.updateComment({
         data: {
            text
         },
         where: {
            id
         }
      }, info)
   },
};

export default Mutation