import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function UpdateListing() {
  const { currentuser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [selectedFiles, setSelectedFiles] = useState([])   
  const [imageUploadError, setImageUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);

  useEffect(() => {
    if (!params.listingId) return;
    const fetchListing = async () => {
      try {
        const res = await api.get(`/listing/get/${params.listingId}`);
        setFormData(res.data);
      } catch (error) {
        console.log(error?.response?.data?.message || 'Failed to fetch listing');
      }
    };
    fetchListing();
  }, [params.listingId]);

  
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload up to 6 images per listing');
      return;
    }

    setImageUploadError(null);
    setSelectedFiles(files);
  };

  
  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setImageUploadError('Please select images first');
      return;
    }

    if (selectedFiles.length + formData.imageUrls.length > 6) {
      setImageUploadError('You can only upload up to 6 images per listing');
      return;
    }

    try {
      setUploading(true);
      setImageUploadError(null);

      // Convert each file to base64
      const base64Promises = selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(base64Promises);

      
      const uploadPromises = base64Images.map((imageUrl) =>
        api.post('/uploadimage', { imageUrl })
      );

      const results = await Promise.all(uploadPromises);
      const cloudinaryUrls = results.map((res) => res.data.imageUrl);

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(cloudinaryUrls),
      }));

      setSelectedFiles([]);
      fileRef.current.value = '';   

    } catch (error) {
      setImageUploadError(error?.response?.data?.message || 'Image upload failed (2mb max per image)');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');

      setLoading(true);
      setError(null);

      const res = await api.put(`/listing/update/${params.listingId}`, {
        ...formData,
        userRef: currentuser._id,
      });

      setLoading(false);

      if (res.data.success === false) {
        setError(res.data.message);
        return;
      }

      navigate('/profile');
    } catch (error) {
      setError(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='regularPrice' min='50' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
              </div>
            </div>
            {formData.offer && (
              <div className='flex items-center gap-2'>
                <input type='number' id='discountPrice' min='0' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} />
                <div className='flex flex-col items-center'>
                  <p>Discounted price</p>
                  {formData.type === 'rent' && <span className='text-xs'>($ / month)</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>

          
          <div className='flex gap-4'>
            <input
              ref={fileRef}
              type='file'
              id='images'
              accept='image/*'
              multiple
              className='p-3 border border-gray-300 rounded w-full'
              onChange={handleImagesChange}
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageUpload}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {imageUploadError && (
            <p className='text-red-700 text-sm'>{imageUploadError}</p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={index} className='flex justify-between p-3 border items-center'>
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Updating...' : 'Update listing'}
          </button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  );
}