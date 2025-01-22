import axios from "axios"
import Cookies from "js-cookie";
import Logout from "../classes/Logout";
import ApiUrl from "./ApiUrl";

const baseUrl = ApiUrl + "Lessons"

const getSectionLessons = (sectionId, dispatch) => {
    var then = true;
    axios({
        method: 'get',
        url: baseUrl + "/GetLessonsSection",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            sectionId: sectionId
        },
    })
    .catch((e) => {
        if(e.response.status == 401){
            Logout();
        }
        if(e.response.status == 403){
            alert('У вас недостаточно прав');
        }
        then = false
        console.log(e)
    })
    .then((e) =>
    {   
        if (then) {
            dispatch(e.data);
        }
    })
}

const postLesson = (data, dispatch) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "/Post",
        data: data,
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
    })
    .catch((e) => {
        if(e.response.status == 401){
            Logout();
        }
        if(e.response.status == 403){
            alert('У вас недостаточно прав');
        }
        then = false
        console.log(e)
    })
    .then((e) =>
    {   
        if (then) {
            dispatch();
        }
    })
}

const deleteLesson = (id, dispatch) => {
    var then = true;
    axios({
        method: 'delete',
        url: baseUrl + "/Delete", 
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            id: id,
        }
    })
    .catch((e) => {
        if(e.response.status == 401){
            Logout();
        }
        if(e.response.status == 403){
            alert('У вас недостаточно прав');
        }
        then = false
        console.log(e)
    })
    .then((e) =>
    {   
        if (then) {
            dispatch();
        }
    })
}

export {
    getSectionLessons,
    postLesson,
    deleteLesson
}