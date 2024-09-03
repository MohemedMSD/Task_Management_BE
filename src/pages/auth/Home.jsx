import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaAlignRight, FaArrowRight, FaTasks, FaUsers } from 'react-icons/fa'
import { MdOutlineTask, MdOutlineTaskAlt, MdTask } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import Axios from '../../constant/axios'

const Home = () => {
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [users, setusers] = useState(0)
  const [tasks, settasks] = useState(0)
  const [my_tasks, setmy_tasks] = useState(0)

  useEffect(()=>{

    Axios.get('/users-details')
    .then((res) => {

      if (res.status === 200) {
        
        setmy_tasks(res.data.myTasks || 0)

        if (res.data.tasks) {
          settasks(res.data.tasks || 0)
        }

        if (res.data.users) {
          setusers(res.data.users || 0)
        }

      }

    })

  }, [])

  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Home
      </h1>

      <div className="flex flex-wrap h-[49vh] justify-start gap-x-[5%] gap-y-[5%] rounded-xl">
        {
          user.role === 'manager' && (
            <>
              <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-second to-[#508aff] rounded-lg justify-between flex h-[150px] flex-col'>
                <h2 className='text-start text-[25px] font-bold text-white z-10'>Users</h2>
                <FaUsers fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
                <p className='text-white font-bold text-[45px]'>{users}</p>
                <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/users'>
                  Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
                </NavLink>
              </div>
              
              <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-primary_text to-[#4d5154] rounded-lg justify-between flex  h-[150px] flex-col'>
                <h2 className='text-start text-[25px] font-bold text-white z-10'>Tasks</h2>
                <FaTasks  fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
                <p className='text-white font-bold text-[45px]'>{tasks}</p>
                <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/tasks'>
                  Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
                </NavLink>
              </div>
            </>
          )
        }
        <div className='p-3 relative shadow-lg w-[100%] sm:w-[30%] bg-gradient-to-br from-gray-400 to-gray-300 rounded-lg justify-between flex  h-[150px] flex-col'>
          <h2 className='text-start text-[25px] font-bold text-white z-10'>My Tasks</h2>
          <MdOutlineTaskAlt fontSize={90} className=' absolute hover:scale-110 transition-transform  text-white top-7 right-5 opacity-60'/>
          <p className='text-white font-bold text-[45px]'>{my_tasks}</p>
          <NavLink className="flex gap-1 items-center font-semibold text-white justify-center" to='/my-tasks'>
            Show more <FaArrowRight className='mt-[3px]' fontSize={12}/>
          </NavLink>
        </div>
      </div>

    </div>
  )
}

export default Home