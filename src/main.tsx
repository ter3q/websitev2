import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//@ts-ignore
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, Router, RouterProvider } from 'react-router-dom'
import PageHome from './pages/PageHome'
import PageProfile from './pages/PageProfile'
import PageError from './pages/PageError'
import Pagecontact from './pages/Pagecontact'
import Header from './component/Header'
const Layout = () => {
  return(
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} errorElement={<PageError/>}>
      <Route path='/' element={<PageHome/>}/>
      <Route path='/profile' element={<PageProfile/>}/> 
      <Route path='/contact' element={<Pagecontact/>}/> 
      </Route>
  
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
