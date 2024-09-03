import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Axios from "../../constant/axios";
import { IoMdCloseCircleOutline } from 'react-icons/io'
import {Loading, TaskModal } from "../../components";

const Tasks = () => {
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  if (user.role === 'user') {
    window.location.href = '/'
  }
  const [IsLoading, setIsLoading] = useState(true)
  const [errorMessage, seterrorMessage] = useState('')

  const [RunOneTime, setRunOneTime] = useState(true)

  const [Tasks, setTasks] = useState([])
  const [FilteredTasks, setFilteredTasks] = useState([])
  const [currentTasks, setcurrentTasks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState();

  const [SearchQuery, setSearchQuery] = useState('');
  const [SearchDate, setSearchDate] = useState('');

  const [ShowModalCreate, setShowModalCreate] = useState(false);
  const [ShowModalUpdate, setShowModalUpdate] = useState(false);
  const [ShowModalShow, setShowModalShow] = useState(false);

  const [TaskInfo, setTaskInfo] = useState()

  const [itemsPerPage, setitemsPerPage] = useState(5)
  const [baseUrl, setbaseUrl] = useState('')

  useEffect(()=>{

      // run just in reload page
      if (RunOneTime) {

        setIsLoading(true)

        Axios.get('/tasks')
        .then((res) => {

          setIsLoading(false)

            if (res.status === 200) {
              
              if (res.data.data.length > 0) {

                setTasks(res.data.data)
                setFilteredTasks(res.data.data)

              }else{

                seterrorMessage('No Tasks Exists')

              }

            }

        })
        .catch(rej => {
          setIsLoading(false)
          seterrorMessage('Something Wrong! Try Again')
        })
        setRunOneTime(false)
    
      }

      // const itemsPerPage = 5; // Adjust this value based on your requirements

      // Calculate the total number of pages
      const total_pages = Math.ceil(FilteredTasks.length / itemsPerPage)
      
      settotalPages(total_pages);
              
      // Slice the list of Tasks to display only the items for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // set Tasks do listed in One page
      setcurrentTasks(FilteredTasks.slice(startIndex, endIndex))

  }, [currentPage, Tasks, RunOneTime, FilteredTasks])
  
  const goToPreviousPage = () => {
      setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
      setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const goToPage = (page) => {

      if(page > currentPage){

          setCurrentPage(prevPage => Math.min(prevPage + page - currentPage, totalPages));

      }else if (page < currentPage) {

          let pageNumber = currentPage - page
          setCurrentPage(prevPage => Math.min(prevPage - pageNumber, totalPages));

      }

  };

  const dataFilter = (e) => {

    setSearchQuery(e.target.value)
    
    let filteredData = [];
    
    if(SearchDate === '' || e.target?.dateValue === ''){
      
      filteredData = Tasks.filter(item =>
        item.status.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.title.toLowerCase().includes(e.target.value.toLowerCase()) 
      );

    }else{
      
      filteredData = FilteredTasks.filter(item =>
        item.status.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.title.toLowerCase().includes(e.target.value.toLowerCase()) 
      );

    }
    
    // when the search input empty return all product 
    if (e.target.value ==='') {

      if (SearchDate === '') {
        setFilteredTasks(Tasks)
      }else{
        dataFilterByDate({target : {value : SearchDate, queryValue : ''}})
      }

    }else{

      setFilteredTasks(filteredData)
      goToPage(1)

    }

  }

  const dataFilterByDate = (e) => {

    setSearchDate(e.target.value)

    let filteredData = [];

    if (SearchQuery === '' || e.target?.queryValue === '') {
      
      filteredData = Tasks.filter(item =>
        item.finished_at === e.target.value
      );

    }else{

      filteredData = FilteredTasks.filter(item =>
        item.finished_at === e.target.value
      );

    }
    
    // when the search input empty return all product 
    if (e.target.value ==='') {
        
      if (SearchQuery === '') {
        setFilteredTasks(Tasks)
      }else{
        dataFilterByDate({target : {value : SearchQuery}})
      }

    }else{

      setFilteredTasks(filteredData)
      goToPage(1)

    }

  }

  const prepareToUpdateOrShow = (TaskID, action) => {
    
    Axios.get('/tasks/' + TaskID)
    .then((res) => {
        
      if (res.status === 200) {
            
        setTaskInfo(res.data.data);
        
        if (action === 'update') {
          setShowModalUpdate(true)
        }else if(action === 'show'){
          setShowModalShow(true)
        }

      }

    })
    .catch((rej) => console.log(rej))

  }

  const resetDateInput = () => {

    setSearchDate('')

    if (SearchQuery === '') {

      setFilteredTasks(Tasks)

    }else{
      
      dataFilter({target : {value : SearchQuery, dateValue : ''}})

    }

  }

  const deleteTask = (TaskID) => {

    Swal.fire({
      title : 'Are you sure to delete this item ?',
      showCancelButton : true,
      showConfirmButton : true,
      confirmButtonText : 'Yes',
      icon : 'warning'
    })
    .then((res) => {

      if (res.isConfirmed) {
        
        Axios.delete('/tasks/' + TaskID)
        .then((res) => {

          if (res.status === 200) {
            
            const updatedTasks = Tasks.filter((item) => 
              item.id !== TaskID
            )

            if (updatedTasks.length === 0) {
              seterrorMessage('No Tasks Existing')
            }
            
            setTasks(updatedTasks)
            setFilteredTasks(updatedTasks)

            if (currentPage === totalPages && currentTasks.length === 1) {
              
              goToPreviousPage()

            }

            toast.success('The Task Deleted Successfully')

          }

        })
        .catch((rej) => {
          
          console.log(rej);

        })

      }

    })

  }


  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Tasks Management
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-primary_text font-semibold text-[22px]">Tasks</h2>
          <button onClick={() => setShowModalCreate(true)} className="bg-second rounded-lg text-white font-semibold p-2">
            Add Task
          </button>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-between flex-wrap">
          
          <div className=''>
            <label className='mr-2'>Filter By Date : </label>
            <input
              type="date"
              value={SearchDate}
              onChange={(e) => dataFilterByDate(e)}
              className="p-1 mr-2 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
            <button onClick={() => resetDateInput()}><IoMdCloseCircleOutline/></button>
          </div>

          <div>
            <label>Search : </label>
            <input
              type="text"
              value={SearchQuery}
              onChange={(e) => dataFilter(e)}
              className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
            />
          </div>

        </div>
        <div className="overflow-x-scroll hide-scrollbar relative">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  #
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Title
                </th>
                <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  status
                </th>
                <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Finished at
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className={`${IsLoading || errorMessage ? 'h-[34vh]' : ''}`}>
              {
                IsLoading && <Loading />
              }
              {
                !IsLoading && errorMessage && <p className="absolute text-[21px] text-second font-bold -translate-y-[50%] text-center w-full left-0 top-[50%]">{errorMessage}</p>
              }
              {
                  !IsLoading && currentTasks.length > 0 && currentTasks?.map((item, i) => (
                    <tr key={item.id} className="hover:bg-gray-200">
                      <td className="py-4 px-6 border-b border-grey-light">{i + 1 + (itemsPerPage * (currentPage - 1))}</td>
                      <td className="py-4 px-6 border-b border-grey-light">{item.title}</td>
                      <td className="py-4 px-6 border-b border-grey-light text-center">{item.status.name}</td>
                      <td className="py-4 px-6 border-b border-grey-light text-center">{item.finished_at}</td>
                      <td className="py-4 border-b border-grey-light">
                        <button onClick={() => prepareToUpdateOrShow(item.id, 'show')}><FaEye className="hover:text-second text-primary_text" fontSize={22}/></button>
                        <button onClick={() => prepareToUpdateOrShow(item.id, 'update')} className="ml-4 mr-3"><FaEdit className="hover:text-second text-primary_text" fontSize={22}/></button>
                        <button onClick={() => deleteTask(item.id)} ><MdDelete className="hover:text-second text-primary_text" fontSize={22}/></button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        <div className="border-b p-5 border-gray-300 px-3 flex items-center gap-4 justify-center">
            
          <ol className="flex justify-center gap-1 text-[16px] font-medium">
            <li>
              <button
                onClick={() => goToPreviousPage()}
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
              >
                <span className="sr-only">Prev Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>

            {
                Array.from({length: totalPages}, (_, index) => index + 1)
                .map(item => (
                    <li key={item}>
                      <button
                        onClick={() => goToPage(item)}
                        href="#"
                        className={`block ${currentPage === item ? 'border-second bg-second text-white' : 'border-gray-100 bg-white text-gray-900'} size-8 rounded border text-center leading-8 `}
                      >
                        {item}
                      </button>
                    </li>
        
                ))
            }
            <li>
              <button
                onClick={()=>goToNextPage()}
                className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
              >
                <span className="sr-only">Next Page</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          </ol>

        </div>
      </div>

      {ShowModalCreate && <TaskModal user={user} seterrorMessage={seterrorMessage} closeModal={setShowModalCreate} header='Add Task' action="create" Tasks={Tasks} baseUrl={baseUrl} setTasks={setTasks} setFilteredTasks={setFilteredTasks} />}
      {ShowModalUpdate && <TaskModal user={user} seterrorMessage={seterrorMessage} closeModal={setShowModalUpdate} header='Update Task' action="update" task={TaskInfo} baseUrl={baseUrl} Tasks={Tasks} setTasks={setTasks} setFilteredTasks={setFilteredTasks}/>}
      {ShowModalShow && <TaskModal user={user} closeModal={setShowModalShow} header='Show Task' action="show" task={TaskInfo} baseUrl={baseUrl} />}
    </div>
  )
}

export default Tasks