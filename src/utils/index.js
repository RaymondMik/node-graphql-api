import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

/**
 * Get User ID via JSON Web token user authentication
 * @param {Object} request 
 * @param {Boolean} requiresAuth 
 */
export const getUserId = (request, requiresAuth = true) => {
   const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

   if (!header && requiresAuth) throw new Error('authentication required')
   if (!header && !requiresAuth) return null

   const token = header.replace('Bearer ', '')
   const decoded = jwt.verify(token, process.env.JWT_SECRET)

   return decoded.userId
}

/**
 * Generate JSON Web Token
 * @param {String} userId
 * @param {String} expiresIn 
 */
export const getJwt = (userId, expiresIn) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn })

/**
 * Generate hashed password and check if password is valid (at least 8 chars long)
 * @param {String} plainTextPassword 
 */
export const hashPassword = (plainTextPassword) => {
   if (plainTextPassword.length < 8) throw new Error('password is too short')
   const hashedPassword = bcrypt.hash(plainTextPassword, 10)

   return hashedPassword
}
