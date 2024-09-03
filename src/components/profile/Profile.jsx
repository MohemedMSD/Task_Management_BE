import React, { useState } from 'react'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { Navigate, NavLink } from 'react-router-dom';
import Axios from '../../constant/axios';
import {ProfileModal} from '../../components';
import { FaUser } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';

const Profile = () => {
    
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    const [ShowProfileMenu, setShowProfileMenu] = useState(false);
    const [ProfilModal, setProfilModal] = useState(false);

    const logout = () => {

        Axios.post('/logout')
        .then((res) => {

            if (res.status === 200) {
                setUser();
                <Navigate to='/guest/login'/>
            }

        })
        .catch((rej) => console.log(rej))

    }

  return (
    <div onClick={()=> !ShowProfileMenu && setShowProfileMenu(true)} className='relative cursor-pointer rounded-full bg-gray-600 w-8 h-8 flex justify-center items-center text-white'>
            {
                user.profile ?
                <img className="h-full w-full rounded-full" src={ localStorage.getItem('baseUrl') + '/uploads/' + user.profile} alt="profile" />
                : 
                <p className="font-bold uppercase">{user.name.slice(0,1)}</p>
            }
            
            <div className={`${ShowProfileMenu ? 'flex-col items-center' : 'hidden'} flex absolute z-20 -bottom-52 right-0 translate-x-[22%] sm:translate-x-0 bg-gray-100 w-[850%] sm:w-[150px] text-gray-500 rounded-lg px-2 pt-2 pb-4`}>
                
                <button onClick={()=> setShowProfileMenu(false)} className='self-end text-end'><IoMdCloseCircleOutline fontSize={23}/></button>
                <div className='rounded-full border bg-gray-600 w-9 h-9 flex justify-center items-center text-white'>
                    {
                        user.profile ?
                        <img className="h-full w-full rounded-full" src={ localStorage.getItem('baseUrl') + '/uploads/' + user.profile} alt="profile" />
                        : 
                        <p className="font-bold uppercase">{user.name.slice(0,1)}</p>
                    }
                </div>
                <h4 className='py-2 font-semibold text-[18px]'>{JSON.parse(localStorage.getItem('user')).name}</h4>
                <hr className='border-black w-full'/>
                <ul className='flex text-[17px] w-full flex-col justify-center items-center'>

                    <li className=' cursor-pointer hover:text-primary_text border-b py-1 w-full text-center'>
                        <button className='flex items-center w-full gap-2 justify-center' onClick={()=> setProfilModal(true)} ><FaUser/> <span>Profile</span></button>
                    </li>

                    <li className='cursor-pointer hover:text-primary_text pt-1'><button className='flex items-center w-full gap-2 justify-center' onClick={() => logout()}><MdLogout/> Logout</button></li>

                </ul>
            </div>
            
        {ProfilModal && <ProfileModal hundleClick={setProfilModal} />}
    </div>
    
  )
}

export default Profile