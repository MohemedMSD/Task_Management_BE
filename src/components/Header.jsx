import React from 'react'
import {Profile, Notification} from './'

const Header = () => {
    return (
        <header className='flex p-3 items-center gap-5 justify-end bg-gray-100'>
    
            <Profile/>
    
            <Notification/>
    
        </header>
    )
}

export default Header