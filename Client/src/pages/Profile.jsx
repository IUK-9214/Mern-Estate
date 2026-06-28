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
  const [listings, setListings] = useState([])

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

  const handleShowListings = async () => {
    try {
      setError(null)
      const res = await api.get(`/user/${currentuser._id}/listings`)  // ✅ fixed
      setListings(res.data)
    } catch (error) {
      setError("Error showing listings")
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      await api.delete(`/listing/delete/${listingId}`)
      setListings(prev => prev.filter(listing => listing._id !== listingId))
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to delete listing")
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

      <button
        onClick={handleShowListings}
        className='text-green-700 w-full'>
        Show listings
      </button>

      {listings && listings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {listings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/update-listing/${listing._id}`)}
                  className='text-green-700 uppercase'
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Profile