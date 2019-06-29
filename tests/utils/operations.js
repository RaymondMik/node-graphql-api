import { gql } from 'apollo-boost'

export const createUser = gql`
    mutation ($data: CreateUserInput!) {
        createUser(data: $data){
            token
            user {
                id
                name
                email
            }
        }
    }
`

export const loginUser = gql`
    mutation ($data: LoginUserInput!) {
        loginUser(data: $data) {
            token
        }
    }
`

export const getUsers = gql`
    query {
        users {
            id
            name
            email
        }
    }
`

export const getPosts = gql`
    query {
        posts {
            id
            title
            published
            author {
                id
                name
                email
            }
        }
    }
`

export const updatePost = gql`
    mutation ($id: ID!, $data: UpdatePostInput!) {
        updatePost(id: $id, data: $data) {
            id
            title
            body
            published
        }
    }
`

export const createPost = gql`
    mutation ($data: CreatePostInput!) {
        createPost(data: $data) {
            id
            title
            body
            published
        }
    }
`

export const deletePost = gql`
    mutation ($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`

export const createComment = gql`
    mutation ($data: CreateCommentInput!) {
        createComment(data: $data) {
            text
            post {
                id
            }
        }
    }
`

export const deleteComment = gql`
    mutation ($id: ID!) {
        deleteComment(id: $id) {
            id
        }
    }
`
