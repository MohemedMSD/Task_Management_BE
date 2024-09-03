import React, { useEffect, useState } from "react";
import Axios from "../constant/axios";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import toast from "react-hot-toast";

const TaskModal = ({action, user, closeModal, seterrorMessage, header, Tasks, setTasks, setFilteredTasks, task}) => {
    
    const [ProductID, setProductID] = useState(0);

    const [Title, setTitle] = useState('');
    const [ErrTitle, setErrTitle] = useState('');

    const [Finished_at, setFinished_at] = useState('');
    const [ErrFinished_at, setErrFinished_at] = useState('');

    const [Description, setDescription] = useState('');
    const [ErrDescription, setErrDescription] = useState('');

    const [AssignedUser, setAssignedUser] = useState('');
    const [ErrAssignedUser, setErrAssignedUser] = useState('');

    const [Status_id, setStatus_id] = useState('');
    const [ErrStatus_id, setErrStatus_id] = useState('');

    const [Status, setStatus] = useState([]);
    const [Users, setUsers] = useState([]);

    useEffect(() => {
    
        Axios.get('/status')
        .then((res) => {

            if (res.status === 200) {
                setStatus(res.data)
            }

        }).catch(rej => console.log(rej))

        Axios.get('/users')
        .then((res) => {

            if (res.status === 200) {
                setUsers(res.data)
            }

        }).catch(rej => console.log(rej))
      
        if (action === 'update' || action === 'show' || action === 'Show My Task' || action === 'Update Status' && task) {
          
          setTitle(task?.title)
          setDescription(task?.description)
          setFinished_at(task?.finished_at)
          setStatus_id(task?.status?.id)
          setAssignedUser(task?.user?.id || undefined)

        }

    }, [action, task])
    
    const createTask = (e) => {
        e.preventDefault()

        Axios.post('/tasks', {
            title : Title,
            description : Description,
            finished_at : Finished_at,
            statu_id : Status_id,
            user_id : AssignedUser
        })
        .then((res) => {
          
          if (res.status === 201) {
        
            console.log(true);
            setTasks([...Tasks, res.data.data])

            setFilteredTasks([...Tasks, res.data.data])

            seterrorMessage('')

            toast.success('Task Added Successfully')

            closeModal(false)


          }

        })
        .catch((rej) => {
          
          if (rej.response.status === 422) {
            
            const messages = rej.response.data;

            setErrTitle(messages?.title)
            setErrDescription(messages?.description)
            setErrFinished_at(messages?.finished_at)
            setErrStatus_id(messages?.status_id)
            setErrAssignedUser(messages?.user_id)

          }

        })

    }

    const updateTask = (e, id) => {
      e.preventDefault()

      let url = '/tasks/';

      if (user.role !== 'manager') {
        url = '/task-update/'
      }
      
      Axios.put(url + id, {
        title : Title,
        description : Description,
        finished_at : Finished_at,
        statu_id : Status_id,
        user_id : AssignedUser
        })
      .then((res) => {
        
        const UpdatedTasks = Tasks.map((item) => {
          
          if (item.id === id) {
            return res.data.data
          }

          return item

        })

        setTasks(UpdatedTasks)
        setFilteredTasks(UpdatedTasks)
        toast.success('Task updated Successfully')
        closeModal(false)

      })
      .catch((rej) => {
          
        if (rej.response.status === 422) {
          
          const messages = rej.response.data;

          setErrTitle(messages?.title)
          setErrDescription(messages?.description)
          setErrFinished_at(messages?.finished_at)
          setErrStatus_id(messages?.status_id)
          setErrAssignedUser(messages?.user_id)

        }

      })

    }



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
              Task Information : {!AssignedUser && action === 'update' && <span className="text-second"><i>Unassigned</i></span>}
            </h1>
            <form action="" encType="multipart/form-data" className="relative flex flex-col gap-4 mt-3 p-2">
              <input type="hidden" name="_method" value="put"/>
              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Title</label>
                    <input
                    type="text"
                    disabled={action === 'show' || user.role === 'user'}
                    value={Title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={` ${ErrTitle ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrTitle && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrTitle}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Description</label>
                    <textarea
                    value={Description}
                    disabled={action === 'show' || user.role === 'user'}
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    className={` ${ErrDescription ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrDescription && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrDescription}</p>}
              </div>

              <div className="flex flex-col">
                <div className="flex  gap-3 items-center">
                    <label className=" w-1/4">Finished At</label>
                    <input
                    type="date"
                    disabled={action === 'show' || user.role === 'user'}
                    value={Finished_at}
                    onChange={(e) => setFinished_at(e.target.value)}
                    className={` ${ErrFinished_at ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`}
                    />
                </div>
                { ErrFinished_at && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrFinished_at}</p>}
              </div>

              <div className="flex flex-col">

                <div className="flex gap-3 items-center">
                    <label className=" w-1/4">Status</label>
                    <select disabled={action === 'show'} onChange={(e) => setStatus_id(e.target.value)} 
                        className={` ${ErrStatus_id ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`} name="category">
                        <option disabled defaultValue={true}>Select Status</option>
                        {
                            Status?.map((item) => (
                                <option key={item.id} value={item.id} selected={Status_id === item.id} >{item.name}</option>
                            ))
                        }
                    </select>
                </div>

                { ErrStatus_id && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrStatus_id}</p>}

              </div>

                {
                    user.role === 'manager' && action !== 'Update Status' ? (
                        <div className="flex flex-col">
            
                            <div className="flex gap-3 items-center">
                                <label className=" w-1/4">Assigned User</label>
                                <select disabled={action === 'show'} onChange={(e) => setAssignedUser(e.target.value)} 
                                className={` ${ErrAssignedUser ? 'border-second' : 'border-gray-400'} border w-3/4  rounded-lg py-2 px-3 focus:border-primary_text outline-none`} name="category">
                                    <option disabled defaultValue={true}>Select User</option>
                                    {
                                        Users?.map((item) => (
                                            <option key={item.id} value={item.id} selected={AssignedUser === item.id} >{item.name}</option>
                                        ))
                                    }
                                    {
                                        !AssignedUser && action === 'show' && <option selected={true} >Unassigned</option>
                                    }
                                </select>
                            </div>
            
                            { ErrAssignedUser && <p className="text-second font-semibold ml-[25%] px-4 py-1">{ErrAssignedUser}</p>}
            
                        </div>
                    )
                    : ''
                }
              {
                action === 'create'  && <button onClick={(e) => createTask(e)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
              }

              {
                action === 'update' || action === 'Update Status' ? <button onClick={(e) => updateTask(e, task.id)} className="p-2 mx-auto w-[20%] font-semibold bg-second text-white rounded-md">Save</button>
                : ''
              }
              {
                action === 'show' || action === 'Show My Task' ?
                <button onClick={(e) => closeModal(false)} className="p-2 mx-auto w-[20%] font-semibold bg-gray-500 text-white rounded-md">Close</button>
                : ''
              }

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaskModal;
