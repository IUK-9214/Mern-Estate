import express from 'express'
import { Singup,SingIn, Google, uploadProfileImage, deleteAccount, signOut } from '../Controller/Auth.js'
import { verifyToken } from '../Middleware/verifyToken.js'

const router=express.Router()



router.post("/signup",Singup)
router.post("/signin",SingIn)
router.post("/auth/google",Google)

router.post('/profileimage', verifyToken, uploadProfileImage)
router.delete('/delete/:id', verifyToken, deleteAccount)   
router.get('/signout', signOut) 



export default router