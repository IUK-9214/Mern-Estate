import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {

  const { currentuser } = useSelector(state => state.user)  
    return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>SoloTech</span>
            <span className='text-slate-700'>Company</span>
          </h1>
        </Link>

        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            type="text"
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64' />
          <FaSearch className='text-slate-600' />
        </form>

        <ul className='flex gap-4 items-center'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>About</li>
          </Link>
          <Link to='/profile'>
            {currentuser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentuser.avatar}        
                alt="profile pic"
                onError={(e) => {               
                  e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }}
              />
            ) : (
              <li className='text-slate-700 hover:underline cursor-pointer'>Sign in</li>
            )}
          </Link>
        </ul>

      </div>
    </header>
  )
}

export default Header