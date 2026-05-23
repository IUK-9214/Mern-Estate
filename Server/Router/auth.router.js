import express from 'express'
import { Singup,SingIn } from '../Controller/Auth.js'


const router=express.Router()



router.post("/signup",Singup)
router.post("/signin",SingIn)
router.post("/google",Google)




export default router