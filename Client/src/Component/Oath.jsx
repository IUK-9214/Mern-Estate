import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'  

function Oath() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)

      
      const res = await api.post("/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,   
      })

      dispatch(signInSuccess(res.data))  
      navigate("/")

    } catch (error) {
      console.log("Not logged-in through Google ", error)
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
      Continue With Google
    </button>
  )
}

export default Oath