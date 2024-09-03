import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa';
import { IoIosNotifications, IoMdCloseCircleOutline } from 'react-icons/io'
import Axios from '../constant/axios';

const Notification = () => {

    const [Notifications, setNotifications] = useState([]);
    const [ShowNotificationsMenu, setShowNotificationsMenu] = useState(false);

    useEffect(() => {
        Axios.get('/notifications')
        .then((res) => {

            if (res.status === 200) {

                setNotifications(res.data.data)

            }

        })
        .catch((rej) => console.log(rej))

    }, [])

    const deleteNotification = (id) => {

        Axios.delete('/notifications/' + id )
        .then((res) => {

            if (res.status === 200) {
                
                let newArray = []
                newArray = Notifications.filter((item) => 
                    item.id !== id
                )

                setNotifications(newArray)

                if (newArray.length === 0) {
                    setShowNotificationsMenu(false)
                }

            }

        })
        .catch((rej) => console.log(rej))

    }

  return (
    <div onClick={()=> !ShowNotificationsMenu && setShowNotificationsMenu(true)}  className='relative cursor-pointer'>
            <IoIosNotifications className="text-primary_text hover:text-second" fontSize={35}/>
            {Notifications?.length > 0 && <div className='absolute h-3 w-3 bg-second top-1 right-2 rounded-full'/>}
            <div className={`${ShowNotificationsMenu ? 'flex-col' : 'hidden'} flex absolute z-20 top-14 right-0 bg-gray-100 w-[280px] sm:w-[400px] text-gray-500 rounded-lg px-2 pt-2 pb-3`}>
                <div className='flex items-center justify-between'>
                    <h4 className='text-[18px] font-bold text-primary_text'>Notification </h4>
                    <button onClick={()=> setShowNotificationsMenu(false)} className='self-end text-end'><IoMdCloseCircleOutline fontSize={23}/></button>
                </div>

                <div className='flex border-b border-gray-600'>
                    <button className='border-b-2 border-gray-600 font-bold w-1/2 py-2  text-primary_text'>Recu</button>
                </div>
                <div className={Notifications.length >= 4 ? 'h-[59vh] overflow-x-scroll hide-scrollbar' : ''}>
                    
                    {
                        Notifications?.map((item) => (
    
                                    <div key={item.id} className='flex items-center justify-between py-1 border-b border-gray-300'>

                                        <div className='w-full'>

                                            <div className='flex items-center justify-between'>
                                                <h6 className='text-second font-semibold' onClick={() => prepareToUpdateOrShow(item.order.id)}>{item.title}<span className='text-primary_text font-normal ml-1 text-[12px]'>{(item.date).slice(2, 16)}</span></h6>
                                                <IoMdCloseCircleOutline onClick={() => deleteNotification(item.id, 'receive')} />
                                            </div>
                                            <p className='text-primary_text py-1'>{item.content}</p>
                                            <div className='w-full flex items-center'>
                                            
                                            <p className='text-primary_text p-1 text-center'><span className='font-semibold'>From : </span> {item.from} </p>
                                            
                                            </div>

                                        </div>
            
                                    </div>
                    ))
                    }
                    {
                        Notifications.length === 0 && <p className='text-primary_text text-center'>You Don't Have Notifications</p>
                    }

                </div>
            </div>
    </div>
  )
}

export default Notification