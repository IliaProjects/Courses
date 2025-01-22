import axios from "axios"
import Cookies from "js-cookie";
import Logout from "../classes/Logout";
import ApiUrl from "./ApiUrl";

const baseUrl = ApiUrl

const getCourseSection = (sectionId, dispatch) => {
    var then = true;
    axios({
        method: 'get',
        url: baseUrl + "CourseSections/Get",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            id: sectionId,
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

const getCourseSections = (data, sortBy, page, dispatch) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "CourseSections/Search",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            'sortBy': sortBy.Enum,
            'page': page
        },
        data: data
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

const unauthorizedGetCourseSectionsNoPage = (courseId, sortBy, callback) => {
    var then = true;
    axios({
        method: 'get',
        url: baseUrl + "CourseSections/UnauthorizedSearchNoPage", 
        params: { 
            'courseId': courseId,
            'sortBy': sortBy
        },
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
          'Content-type': 'application/json',
        },
    })
    .catch((e) => {
        if(e.response.status == 401){
            Logout();
        }
        if(e.response.status == 403){
            alert('У вас недостаточно прав');
        }
    })
    .then((e) =>
    {
        if(then){
            callback(e.data)
        }
    })
}

const getCourseSectionsNoPage = (data, sortBy, dispatch) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "CourseSections/SearchNoPage",
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            'sortBy': sortBy.Enum,
        },
        data: data
    })
    .catch((e) => {
        if(e.response.status == 401){
            Logout();
        }
        if(e.response.status == 403){
            alert('У вас недостаточно прав');
        }
        then = false
    })
    .then((e) =>
    {   
        if (then) {
            dispatch(e.data);
        }
    })
}

const postSection = (data, dispatch) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "CourseSections/Post",
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

const putSection = (data, dispatch) => {
    var then = true;
    axios({
        method: 'put',
        url: baseUrl + "CourseSections/Put",
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

const deleteSection = (sectionId, dispatch) => {
    var then = true;
    axios({
        method: 'delete',
        url: baseUrl + "CourseSections/Delete", 
        headers: {
          'Authorization': 'Bearer ' + Cookies.get('token'),
        },
        params: {
            id: sectionId,
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

const openAccess = (data, dispatch) => {
    
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "CourseSections/OpenAccess",
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

const closeAccess = (data, dispatch) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "CourseSections/CloseAccess",
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

const changeOrder = (data, dispatch) => {
    var then = true;
    axios({
        method: 'put',
        url: baseUrl + "CourseSections/ChangeOrder",
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

export 
    {
        unauthorizedGetCourseSectionsNoPage,
        getCourseSection,
        getCourseSections, 
        getCourseSectionsNoPage,
        postSection, 
        deleteSection, 
        putSection, 

        openAccess, 
        closeAccess,
        changeOrder
    }