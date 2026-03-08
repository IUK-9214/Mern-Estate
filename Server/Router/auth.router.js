import express from 'express'
import { Singup } from '../Controller/Auth.js'


const router=express.Router()



router.post("/signup",Singup)




export default router