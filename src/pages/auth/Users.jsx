import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import Axios from "../../constant/axios";
import {Loading, UserModal } from "../../components";

const Users = () => {
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)

  if (user.role === 'user') {
    window.location.href = '/'
  }

  const [IsLoading, setIsLoading] = useState(true)
  const [errorMessage, seterrorMessage] = useState('')

  const [RunOneTime, setRunOneTime] = useState(true)

  const [Users, setUsers] = useState([])
  const [FilteredUsers, setFilteredUsers] = useState([])
  const [currentUsers, setcurrentUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState();

  const [SearchQuery, setSearchQuery] = useState('');

  const [UserInfo, setUserInfo] = useState()

  const [ShowModalShow, setShowModalShow] = useState(false);

  const [itemsPerPage, setitemsPerPage] = useState(5)

  useEffect(()=>{

      // run just in reload page
      if (RunOneTime) {

        setIsLoading(true)

        Axios.get('/users')
        .then((res) => {

          setIsLoading(false)

            if (res.status === 200) {
              
              if (res.data.length > 0) {

                setUsers(res.data)
                setFilteredUsers(res.data)

              }else{

                seterrorMessage('No Users Exists')

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
      const total_pages = Math.ceil(FilteredUsers?.length / itemsPerPage)
      
      settotalPages(total_pages);
              
      // Slice the list of Users to display only the items for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // set Users do listed in One page
      setcurrentUsers(FilteredUsers?.slice(startIndex, endIndex))

  }, [currentPage, Users, RunOneTime, FilteredUsers])
  
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
      
      const filteredData = Users.filter(item =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) 
      );
      
      // when the search input empty return all User 
      if (e.target.value ==='') {
        
        setFilteredUsers(Users)

      }else{

        setFilteredUsers(filteredData)
        goToPage(1)

      }

  }

  const prepareToShow = (UserID) => {

    Axios.get('/users/' + UserID)
    .then((res) => {
        
      if (res.status === 200) {
            
        setUserInfo(res.data.data);
        
        setShowModalShow(true)
            
      }

    })
    .catch((rej) => console.log(rej))

  }

  const deleteUser = (UserID) => {

    Swal.fire({
      title : 'Are you sure to delete this item ?',
      showCancelButton : true,
      showConfirmButton : true,
      confirmButtonText : 'Yes',
      icon : 'warning'
    })
    .then((res) => {

      if (res.isConfirmed) {
        
        Axios.delete('/users/' + UserID)
        .then((res) => {

          if (res.status === 200) {
            
            const updatedUsers = Users.filter((item) => 
              item.id !== UserID
            )
            if (updatedUsers.length === 0) {
              seterrorMessage('No Users Existing')
            }
            
            setUsers(updatedUsers)
            setFilteredUsers(updatedUsers)

            if (currentPage === totalPages && currentUsers.length === 1) {
              
              goToPreviousPage()

            }

            toast.success('User Deleted Successfully')

          }

        })
        .catch((rej) => {
          
          if (rej.response.status === 422) {
            
            Swal.fire({
              title : 'Note!',
              text : rej.response.data.message,
              icon : 'error'
            })

          }

        })

      }

    })

  }

  return (
    <div>
      <h1 className="text-primary_text mb-5 font-bold text-[19px] sm:text-[25px] ">
        Users Management
      </h1>

      <div className="border rounded-xl border-gray-200 shadow-lg">
        <div className="flex rounded-t-lg items-center justify-between p-3 bg-gray-200">
          <h2 className="text-primary_text font-semibold text-[22px]">Users</h2>
        </div>

        <div className="py-4 border-b border-gray-300 px-3 flex items-center gap-4 justify-end">
          <label>Search : </label>
          <input
            type="text"
            value={SearchQuery}
            onChange={(e) => dataFilter(e)}
            className="p-1 rounded-md border border-gray-300 focus:border-primary_text outline-none"
          />
        </div>
        <div className="overflow-x-scroll hide-scrollbar relative">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
              <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  #
                </th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Name
                </th>
                <th className="py-4 text-center px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">
                  Email
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
                  !IsLoading && currentUsers.length > 0 && currentUsers?.map((item, i) => (
                      <tr key={item.id} className="hover:bg-gray-200">
                        <td className="py-4 px-6 border-b border-grey-light">{i + 1 + (itemsPerPage * (currentPage - 1))}</td>
                        <td className="py-4 px-6 border-b border-grey-light">{item.name}</td>
                        <td className="py-4 px-6 border-b border-grey-light text-center">{item.email}</td>
                        <td className="p-4 border-b border-grey-light">
                          <button onClick={() => prepareToShow(item.id)}><FaEye className="hover:text-second text-primary_text mr-2" fontSize={22}/></button>
                          
                          <button onClick={() => deleteUser(item.id)} ><MdDelete className="hover:text-second text-primary_text" fontSize={22}/></button>
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

      {ShowModalShow && <UserModal closeModal={setShowModalShow} header='Show User' User={UserInfo} />}
    </div>
  )
}

export default Users