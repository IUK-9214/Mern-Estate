import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'


function Signin() {

  const [FormData,setFormData]=useState({})
  const [error ,setError]=useState(null);
  const  [loading,setLoading]=useState(false)
const navigate =useNavigate();

  const HandleChange=(e)=>{
    setFormData({
      ...FormData,
      [e.target.id]:e.target.value,
    })
  }
const HandleSubmit=async(e)=>{
  e.preventDefault();
 try {
   setLoading(true)
const res =await fetch('/api/signin',{
  method:'POST',
  headers:{
    'Content-Type':'application/json',
  },
  body:JSON.stringify(FormData),
});
const data=await res.json();
if(data.success===false){
  setLoading(false)
  setError(data.message);
  return;
}
setLoading(false)
setError(null)
navigate('/');
 } catch (error) {
  setLoading(false);
  setError(error.message); 
 }
}

  return (

    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form
      onSubmit={HandleSubmit}
      className='flex flex-col gap-4'>
        <input onChange={HandleChange}  type="email" placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input  onChange={HandleChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg  uppercase hover:opacity-95 disabled::opacity-80'>{loading?"Loading...":"Sign In"}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Do not have an account ? </p>
        <Link className='text-blue-700' to={"/sign-up"}> Sign Up</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Signin