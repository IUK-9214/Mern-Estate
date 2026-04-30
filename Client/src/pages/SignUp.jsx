import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function SignUp() {

  const [FormData,setFormData]=useState({})

  const HandleChange=(e)=>{
    setFormData({
      ...FormData,
      [e.target.id]:e.target.value,
    })
  }
const HandleSubmit=(e)=>{
  e.preventDefault();
  
}

  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input  onChange={HandleChange}  type="text" placeholder='UserName' className='border p-3 rounded-lg' id='username' />
        <input onChange={HandleChange}  type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input  onChange={HandleChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button className='bg-slate-700 text-white p-3 rounded-lg  uppercase hover:opacity-95 disabled::opacity-80'>sign up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account ? </p>
        <Link className='text-blue-700' to={"/sign-in"}> Sign In</Link>
      </div>
    </div>
  )
}

export default SignUp