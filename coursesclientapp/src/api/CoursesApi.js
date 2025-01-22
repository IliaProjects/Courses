import axios from "axios"
import Cookies from "js-cookie";
import Logout from "../classes/Logout";
import ApiUrl from "./ApiUrl";

const baseUrl = ApiUrl

const getCourse = (courseId, callback) => {
    var then = true;
    axios({
        method: 'get',
        params: {
            id: courseId
        },
        url: baseUrl + "Courses/Get",
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token')
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
            callback(e.data);
        }
    })
}

const getAllCourses = (page, sortBy, callback) => {
    var then = true;
    axios({
        method: 'get',
        params: {
            page: page,
            'sortBy': sortBy
        },
        url: baseUrl + "Courses/GetAll",
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token')
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
            callback(e.data);
        }
    })
}

const searchCourses = (model, page, sortBy, callback) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "Courses/Search", 
        params: { 
            'page': page,
            'sortBy': sortBy
        },
        data: model,
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

const postCourse = (data, callback) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "Courses/Post",
        data: data,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
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
            callback();
        }
    })
}

const putCourse = (data, callback) => {
    var then = true;
    axios({
        method: 'put',
        url: baseUrl + "Courses/Put",
        data: data,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
            "Content-Type": "application/json; charset=utf8"
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
            callback();
        }
    })
}

const deleteCourse = (key, callback) => {
    var then = true;
    axios({
        method: 'delete',
        url: baseUrl + "Courses/Delete",
        params: {
            id: key,
        },
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
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
            callback();
        }
    })
}

export {getCourse, postCourse, getAllCourses, putCourse, deleteCourse, searchCourses }