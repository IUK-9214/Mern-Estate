import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingItem from '../Component/ListingItem';
import api from '../api/axios';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        setShowMore(false);

        const searchQuery = urlParams.toString();
        const res = await api.get(`/listing/get?${searchQuery}`);
        const data = res.data;

        setShowMore(data.length > 8);
        setListings(data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (['all', 'rent', 'sell'].includes(e.target.id)) {  // ✅ 'sell' not 'sale'
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (['parking', 'furnished', 'offer'].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', sidebardata.parking);
    if (sidebardata.furnished) urlParams.set('furnished', sidebardata.furnished);
    if (sidebardata.offer) urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    try {
      const startIndex = listings.length;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', startIndex);

      const res = await api.get(`/listing/get?${urlParams.toString()}`);
      const data = res.data;

      if (data.length < 9) setShowMore(false);
      setListings((prev) => [...prev, ...data]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load more listings');
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            {['all', 'rent', 'sell'].map((t) => (  // ✅ 'sell' not 'sale'
              <div key={t} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={t}
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.type === t}
                />
                <span>
                  {t === 'all' ? 'Rent & Sale' : t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </div>
            ))}
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            {['parking', 'furnished'].map((amenity) => (
              <div key={amenity} className='flex gap-2'>
                <input
                  type='checkbox'
                  id={amenity}
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata[amenity]}
                />
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={'createdAt_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {error && <p className='text-red-500 text-xl'>{error}</p>}

          {!loading && !error && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}

          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
          )}

          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='text-green-700 hover:underline p-7 text-center w-full'
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}