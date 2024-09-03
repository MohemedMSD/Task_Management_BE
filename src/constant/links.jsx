import { FaHome, FaTasks, FaUsers } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";

export const links = [
    { name : 'Home', to : '/', icon : <FaHome fontSize={35} className='mr-3'/>, role : false},
    { name: 'Users', to: '/users', icon : <FaUsers fontSize={35} className='mr-3'/>, role : true },
    { name: 'Tasks', to: '/tasks', icon : <FaTasks fontSize={35} className='mr-3'/>, role : true },
    { name: 'My Tasks', to: '/my-tasks', icon : <MdTaskAlt fontSize={35} className='mr-3'/>, role : false },
];