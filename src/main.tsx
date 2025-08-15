import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, Router, RouterProvider } from 'react-router-dom'
import PageHome from './pages/PageHome'
import Pagetest from './pages/Pagetest'
import PageError from './pages/PageError'
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
      <Route path='/test' element={<Pagetest/>}/> 

      </Route>
  
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
