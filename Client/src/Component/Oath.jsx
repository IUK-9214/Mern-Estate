import React from 'react'
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

function Oath() {

const handleGoogleClick =async ()=>{
try {
    
     const provider=new GoogleAuthProvider()
     const auth=getAuth()

} catch (error) {
console.log("Not logged-in through Google ",error)    
}

}

  return (
    <button  onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue With Google</button>
  )
}

export default Oath