import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { logout, updateUserSuccess } from '../redux/user/userSlice.js'
 import { persistor } from '../redux/store.js' 
 import { Link } from 'react-router-dom'

function Profile() {

  const { currentuser } = useSelector(state => state.user)  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [imageUrl, setImageUrl] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const fileRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageUrl) {
      setError("Please select an image first")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await api.post("/profileimage", {
        imageUrl: imageUrl,
  
      })

      dispatch(updateUserSuccess(res.data.user))  
      setSuccess("Profile image updated successfully!")

    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }



const handleSignOut = async () => {
    try {
        await api.get("/signout")
    } catch (error) {
        console.log("signout error", error)
    } finally {
        dispatch(logout())        
        await persistor.purge()   
        navigate("/sign-in")
    }
}

const handleDeleteAccount = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This cannot be undone.")
    if (!confirm) return

    try {
        await api.delete(`/delete/${currentuser._id}`)
    } catch (error) {
        console.log("delete error", error)
    } finally {
        dispatch(logout())        
        await persistor.purge()   
        navigate("/sign-in")
    }
}

  const handleImgChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result)
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>

        <input onChange={handleImgChange} type='file' ref={fileRef} hidden accept='image/*' />

        <img
          onClick={() => fileRef.current.click()}
          src={previewUrl || currentuser?.avatar}   
          alt="profile-Pic"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

        {error && <p className='text-red-500 text-center text-sm'>{error}</p>}
        {success && <p className='text-green-500 text-center text-sm'>{success}</p>}

        <input type="text" placeholder='Username' className='border p-3 rounded-lg' />
        <input type="email" placeholder='Email@gmail.com' className='border p-3 rounded-lg' />
        <input type="password" placeholder='Password' className='border p-3 rounded-lg' />

        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
        to={'/create-listing'}
        className='bg-green-700 text-white rounded-lg uppercase p-3 text-center hover:opacity-95'>
          Create listing 
        </Link>

      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAccount} className='text-red-700 cursor-pointer hover:underline'>
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer hover:underline'>
          Sign Out
        </span>
      </div>

    </div>
  )
}

export default Profile