import React from 'react'
import { useSelector } from 'react-redux'

function Profile() {

  const currentUser=useSelector(state=>state.user)
 
  return (
    <div>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form className='flex flex-col gap-3'>

       <img src={currentUser.avatar} alt="profile-Pic"
       className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
       <input type="text" placeholder='user Name' id='username'
       className='border p-3 rounded-lg' />
       <input type="email" placeholder='Email@gamil.com' id='email'
       className='border p-3 rounded-lg' />
       <input type="password" placeholder='Password' id='password'
       className='border p-3 rounded-lg' />
       <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>SignOut</span>
      </div>
   
    </div>
  )
}

export default Profile