import axios from 'axios';

const Axios = axios.create({
	baseURL: import.meta.env.VITE_APP_PATH,
	headers: {
        'Content-Type': 'text/json',
		"Accept": "application/json",
		"Authorization" : localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : ''
	},
});

export default Axios;