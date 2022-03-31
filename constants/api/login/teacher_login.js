import {API} from '../index';

const teacher_login = ({ id, password}) => {

    const endpoint = `/teacher/login`;
    
    const data = 
    {
      id: id,
      password: password
    };

    API.post(endpoint,data)
    .then(responseCallback)
    .catch(errorHandlingCallback);
}

const responseCallback = (response) => {
    alert(response.body); //TODO: remove this line of code once your done with this callback
    //handle successful response here
}

const errorHandlingCallback = (error) => {
    alert(error.toString()); //TODO: remove this line of code once your done with this callback
    //handle error response here
}

export default teacher_login;