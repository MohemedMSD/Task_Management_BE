import React from 'react'
import { Outlet } from 'react-router-dom'
import { Footer, Header, SideBar } from '../../components'

const Dashboard = () => {
  
  if (!localStorage.getItem('user')) {
    window.location.href ='/guest/login'
  }

  return (
    <div className="relative flex">
        <SideBar />

        <div className="flex-1 flex flex-col h-screen bg-white">

          <Header/>

          <div className="sm:px-10 w-screen lg:w-[calc(100vw_-_280px)] px-6 py-5 h-screen overflow-y-scroll hide-scrollbar">
            
              <Outlet/>
              
          </div>

          <Footer/>
        </div>

      </div>
  )
}

export default Dashboard