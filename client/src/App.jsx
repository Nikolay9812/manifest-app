import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import ScrollToTop from './components/ScrollToTop'
import FooterCom from './components/FooterCom'
import PrivateRoute from './components/PrivateRoute'
import CreateManifest from './components/CreateManifest'
import UpdateManifest from './components/UpdateManifest'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute/>}>
                    <Route path='/dashboard' element={<Dashboard />} />
                </Route>
                <Route element={<OnlyAdminPrivateRoute/>}>
                    <Route path='/create-manifest' element={<CreateManifest />} />
                    <Route path='/update-manifest/:manifestId' element={<UpdateManifest />} />
                </Route>
      </Routes>
      <FooterCom/>
    </BrowserRouter>
  )
}
