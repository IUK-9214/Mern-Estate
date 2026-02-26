import React from 'react'

function Header() {
  return (
  <Header>
    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-slate-500'>SoloTech</span>
        <span className='text-slate-700'>Company</span>
    </h1>
    <form>
        <input type="text" placeholder='Search...' />
    </form>
  </Header>
  )
}

export default Header