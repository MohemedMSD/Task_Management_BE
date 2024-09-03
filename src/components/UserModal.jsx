import React, { useState } from 'react'
import { useEffect } from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'

const UserModal = ({closeModal, header, User}) => {

    const [Name, setName] = useState('')

    const [Email, setEmail] = useState('')

    const [Profile, setProfile] = useState('')

    const [Tasks, setTasks] = useState([])

    useEffect(()=>{
        setEmail(User?.email)
        setName(User?.name)
        setProfile(User?.profile)
        setTasks(User?.tasks)
    }, [])

  return (
    <div className="fixed top-0 h-screen right-0 w-full flex justify-center items-center">
      <div className="fixed top-0 right-0 z-30 w-full h-screen bg-slate-500 opacity-60" />

      <div className="bg-white max-h-[97%] w-[98%] sm:w-[70%] lg:w-[55%] z-50 rounded-lg  hide-scrollbar overflow-y-scroll">

        <div className="flex items-center justify-between p-3">
          <h1 className="text-[28px] font-bold">{header}</h1>
          <button onClick={() => closeModal(false)}><IoMdCloseCircleOutline fontSize={25}/></button>
        </div>

        <hr className="border-gray-600" />

        <div className="flex flex-col gap-3 p-2 sm:p-5">

          <div className="border border-gray-400 p-2 rounded-lg">
            <h1 className="text-[26px] text-primary_text font-bold">
              User Information :
            </h1>
            <form action="" encType="multipart/form-data" className="relative flex flex-col gap-4 mt-3 p-2">
              <input type="hidden" name="_method" value="put"/>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Name</label>
                    <input
                    type="text"
                    disabled={true}
                    value={Name}
                    className='border-gray-400 border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none'
                    />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Email</label>
                    <input
                    type="text"
                    disabled={true}
                    value={Email}
                    className='border-gray-400 border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none'
                    />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-3 items-center">
                    <div className="font-bold">Tasks </div>
                    <ul className='w-3/4 flex flex-col gap-2'>
                        {
                            Tasks.length > 0 ? Tasks?.map((item) => (
                                <li className='border-gray-400 border flex justify-between rounded-lg py-2 px-3'><span className='font-semibold'>{item.title}</span><span>{item.status.name}</span></li>
                            ))
                            :
                            <p className='text-red-500 text-center'>He doesn't have Tasks</p>
                        }
                    </ul>
                </div>
              </div>

                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-[20%] font-semibold bg-gray-500 text-white rounded-md">Close</button>

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}

export default UserModal