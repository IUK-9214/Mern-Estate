import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import About from './pages/About'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './Component/Header'
import PrivateRoute from './Component/PrivateRoute'
import CreateListing from './pages/CreateListing'

function App() {
  

  return <BrowserRouter>
  <Header/>
  <Routes>
<Route path='/' element={<Home/>}/>
<Route path='/sign-in' element={<Signin/>}/>
<Route path='/sign-up' element={<SignUp/>}/>
<Route path='/about' element={<About/>}/>

<Route element={<PrivateRoute/>}>
<Route path='/create-listing' element={<CreateListing/>}/>
<Route path='/profile' element={<Profile/>}/>
</Route>

  </Routes>
  </BrowserRouter>
  
}

export default App
