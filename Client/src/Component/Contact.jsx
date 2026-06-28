import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await api.get(`/user/${listing.userRef}`);
        setLandlord(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // ✅ Opens Gmail compose in a new browser tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(landlord.email)}&su=${encodeURIComponent(`Regarding ${listing.name}`)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-60'
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
}