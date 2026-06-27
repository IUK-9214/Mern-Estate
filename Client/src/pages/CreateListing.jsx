import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function CreateListing() {
  const { currentuser } = useSelector(state => state.user)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    parking: false,
    furnished: false,
    offer: false,
    imageUrls: [],
  })

  
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    if (type === 'checkbox') {
      if (id === 'sell' || id === 'rent') {
        setFormData({ ...formData, type: id })
      } else {
        setFormData({ ...formData, [id]: checked })
      }
    } else {
      setFormData({ ...formData, [id]: value })
    }
  }


  const handleImgChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length + selectedImages.length > 6) {
      setError('You can upload a maximum of 6 images')
      return
    }

    setError(null)

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImages((prev) => [
          ...prev,
          { previewUrl: reader.result, base64: reader.result, status: 'pending' },
        ])
      }
      reader.readAsDataURL(file)
    })

    e.target.value = '' 
  }

  const handleRemoveSelected = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    const pending = selectedImages.filter((img) => img.status === 'pending')
    if (pending.length === 0) {
      setError('Please select at least one image first')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    const uploadedUrls = []

    for (let i = 0; i < selectedImages.length; i++) {
      const img = selectedImages[i]
      if (img.status !== 'pending') continue

      setSelectedImages((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'uploading' } : item))
      )

      try {
        const res = await api.post('/uploadimage', { imageUrl: img.base64 })
        uploadedUrls.push(res.data.imageUrl)
        setSelectedImages((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'done' } : item))
        )
      } catch (err) {
        setSelectedImages((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: 'error' } : item))
        )
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...uploadedUrls],
      }))
      setSuccess(`${uploadedUrls.length} image(s) uploaded successfully!`)
    } else {
      setError('All uploads failed. Please try again.')
    }

    setLoading(false)
  }

 
  const handleRemoveUploaded = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.imageUrls.length === 0) {
      setError('Please upload at least one image')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await api.post('/listing', {
        ...formData,
        userRef: currentuser._id,
      })

      navigate(`/listing/${res.data._id}`)
    } catch (error) {
      setError(error?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const statusBadge = (status) => {
    if (status === 'uploading') return 'Loading'
    if (status === 'done') return 'Done'
    if (status === 'error') return 'Error'
    return ''
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>

      {error && <p className='text-red-500 text-center text-sm mb-2'>{error}</p>}
      {success && <p className='text-green-500 text-center text-sm mb-2'>{success}</p>}

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>

  
        <div className='flex flex-col gap-4 flex-1'>
          <input
            className='border p-3 rounded-lg'
            type='text'
            placeholder='Name'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className='border p-3 rounded-lg'
            id='description'
            placeholder='Description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            className='border p-3 rounded-lg'
            type='text'
            placeholder='Address'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />

          
          <div className='flex gap-6 flex-wrap'>
            {[
              { label: 'Sell', id: 'sell' },
              { label: 'Rent', id: 'rent' },
              { label: 'Parking', id: 'parking' },
              { label: 'Furnished', id: 'furnished' },
              { label: 'Offer', id: 'offer' },
            ].map(({ label, id }) => (
              <div key={id} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id={id}
                  className='w-5 h-5'
                  onChange={handleChange}
                  checked={
                    id === 'sell'
                      ? formData.type === 'sell'
                      : id === 'rent'
                      ? formData.type === 'rent'
                      : formData[id]
                  }
                />
                <span>{label}</span>
              </div>
            ))}
          </div>

       
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-20' type='number' id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-20' type='number' id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-28' type='number' id='regularPrice' min='1' required onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs text-gray-500'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input className='p-3 border border-gray-300 rounded-lg w-28' type='number' id='discountPrice' min='1' required onChange={handleChange} value={formData.discountPrice} />
              <div className='flex flex-col items-center'>
                <p>Discount Price</p>
                <span className='text-xs text-gray-500'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images
            <span className='font-normal text-gray-500 ml-2'>
              First image will be the cover (max 6)
            </span>
          </p>

         
          <div className='flex gap-4'>
            <input
              onChange={handleImgChange}
              className='p-3 border border-gray-300 rounded-lg w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              onClick={handleUpload}
              type='button'
              disabled={loading || selectedImages.filter(i => i.status === 'pending').length === 0}
              className='p-3 text-green-700 border border-green-700 rounded-lg uppercase hover:shadow-lg disabled:opacity-50 whitespace-nowrap'
            >
              {loading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

       
          {selectedImages.length > 0 && (
            <div>
              <p className='text-sm text-gray-500 mb-2'>Selected — click × to remove before uploading</p>
              <div className='grid grid-cols-3 gap-2'>
                {selectedImages.map((img, i) => (
                  <div key={i} className='relative'>
                    <img
                      src={img.previewUrl}
                      alt={`selected-${i}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 ${
                        img.status === 'done' ? 'border-green-400' :
                        img.status === 'error' ? 'border-red-400' :
                        img.status === 'uploading' ? 'border-yellow-400' :
                        'border-gray-200'
                      }`}
                    />
                    <span className='absolute top-1 left-1 text-sm'>{statusBadge(img.status)}</span>
                    {img.status === 'pending' && (
                      <button
                        type='button'
                        onClick={() => handleRemoveSelected(i)}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

         
          {formData.imageUrls.length > 0 && (
            <div>
              <p className='text-sm text-gray-500 mb-2'>
                Uploaded ({formData.imageUrls.length}) — click × to remove
              </p>
              <div className='grid grid-cols-3 gap-2'>
                {formData.imageUrls.map((url, i) => (
                  <div key={i} className='relative'>
                    <img
                      src={url}
                      alt={`uploaded-${i}`}
                      className='w-full h-24 object-cover rounded-lg border-2 border-green-400'
                    />
                    {i === 0 && (
                      <span className='absolute bottom-1 left-1 bg-slate-700 text-white text-xs px-1 rounded'>
                        Cover
                      </span>
                    )}
                    <button
                      type='button'
                      onClick={() => handleRemoveUploaded(i)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>

      </form>
    </main>
  )
}

export default CreateListing