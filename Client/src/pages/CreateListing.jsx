import React from 'react'

function CreateListing() {
  return (
   <main>
    <h1 className='text-3xl font-semibold text-center my-7'>Create Listing </h1>
   <form className=''>
    
    <div className='flex flex-col sm:flex -row gap-3'>
      <input className='border p-3 rounded-lg ' type="text" placeholder='Name' name="name" id="name" maxLength='62' minLength='10' required />
      <textarea type="text" id='description' placeholder='Description ' className='border p-3 rounded-lg ' required />
    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required />
    <div className='flex gap-6 flex-wrap '>
      <div className='flex gap-2'>
        <input type='checkbox' id='sell' className='w-5'/>
        <span>Sell</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='Rent' className='w-5'/>
        <span>Rent</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='parking' className='w-5'/>
        <span>Parking</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='furnished' className='w-5'/>
        <span>Furnished</span>
      </div>
      <div className='flex gap-2'>
        <input type='checkbox' id='offer' className='w-5'/>
        <span>Offer</span>
      </div>
    </div>
    <div className='flex flex-wrap gap-6'>
      <div className='flex items-center gap-2'>
        <input className='p-3 border  border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required/>
        <p>Beds</p>
      </div>
      <div className='flex items-center gap-2'>
        <input className=' border p-3 border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required/>
        <p>Baths</p>
      </div>
      <div className='flex items-center gap-2'>
        <input className=' border p-3 border-gray-300 rounded-lg' type="number" id='regularPrice' min='1' max='10' required/>
        <div className='flex flex-col items-center'>
        <p>Regular Price</p>
        <span className='text-sm'>($ / month) </span>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <input className='p-3 border  border-gray-300 rounded-lg' type="number" id='discountPrice' min='1' max='10' required/>
        <div className='flex flex-col items-center'>
        <p>Discount Price</p>
        <span className='text-sm'>($ / month) </span>
        </div>
      </div>
    </div>
    </div>
 <div className='flex flex-col flex-1 '>

      
    </div>
 <div className='flex flex-col flex-1  gap-4'>
    <p className='font-semibold'>Images <span className='font-normal text-gray-600 ml-2'>The first image will be the cover </span></p>
    <div className='flex gap-4'>
      <input className='p-3 border-gray-700 rounded w-full ' type="file" name="images" accept='images/*' id="images" multiple/
      >
        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>Upload</button>
    </div>
    </div>
   </form>
   
   </main>
  )
}

export default CreateListing