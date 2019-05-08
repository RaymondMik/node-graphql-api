import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
})

export default prisma

// prisma.query.users(null, '{ id name }').then(data => console.log(JSON.stringify(data, undefined, 2)))
// prisma.query.comments(null, '{ id text author {id name} }').then(data => console.log(JSON.stringify(data, undefined, 2)))

// const createPost = async(authorId, data) => {
//    const userExists = await prisma.exists.User({ id: authorId })

//    if (!userExists) throw new Error('user not found')

//    const newPost = await prisma.mutation.createPost({
//       data: {
//          ...data,
//          author: {
//             connect: {
//                id: authorId
//             }
//          }
//       }
//    }, '{ author { id name posts { id title body } } }')

//    return JSON.stringify(newPost.author, undefined, 2)
// }

// createPost('cju15sizw00g10849xl55ij4j', {
//    title: 'New Post',
//    body: '',
//    published: false
// })
//    .then(data => console.log(data))
//    .catch(err => console.warn(err))

// const updatePost = async(postId, data) => {
//    const postExists = await prisma.exists.Post({ id: postId })

//    if (!postExists) throw new Error('post not found')

//     const updatedPost = await prisma.mutation.updatePost({
//       where: {
//             id: postId
//          },
//          data: {
//             ...data
//          }
//       }, '{ author { id name posts { id title published } } }')

//    return JSON.stringify(updatedPost.author, undefined, 2)
// }

// updatePost('cju1b7knc0177084981jyo214', {
//    title: 'Not New Anymore 111',
//    body: '',
//    published: false
// })
//    .then(data => console.log(data))
//    .catch(err => console.warn(err))
