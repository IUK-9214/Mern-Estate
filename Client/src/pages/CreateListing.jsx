import React from 'react'

function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>

      <form className='flex flex-col sm:flex-row gap-6'>

        {/* Left column — text inputs */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            className='border p-3 rounded-lg'
            type='text'
            placeholder='Name'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            className='border p-3 rounded-lg'
            id='description'
            placeholder='Description'
            required
          />
          <input
            className='border p-3 rounded-lg'
            type='text'
            placeholder='Address'
            id='address'
            required
          />

          {/* Checkboxes */}
          <div className='flex gap-6 flex-wrap'>
            {['Sell', 'Rent', 'Parking', 'Furnished', 'Offer'].map((label) => (
              <div key={label} className='flex items-center gap-2'>
                <input type='checkbox' id={label.toLowerCase()} className='w-5 h-5' />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Number inputs */}
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-20' type='number' id='bedrooms' min='1' max='10' required />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-20' type='number' id='bathrooms' min='1' max='10' required />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-28' type='number' id='regularPrice' min='1' required />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs text-gray-500'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-28' type='number' id='discountPrice' min='1' required />
              <div className='flex flex-col items-center'>
                <p>Discount Price</p>
                <span className='text-xs text-gray-500'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column — image upload + submit */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images
            <span className='font-normal text-gray-500 ml-2'>The first image will be the cover</span>
          </p>
          <div className='flex gap-4'>
            <input
              className='p-3 border border-gray-300 rounded-lg w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-80'
            >
              Upload
            </button>
          </div>

          <button
            type='submit'
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            Create Listing
          </button>
        </div>

      </form>
    </main>
  )
}

export default CreateListing