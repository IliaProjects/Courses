import axios from "axios"
import Cookies from "js-cookie";
import Logout from "../classes/Logout";
import ApiUrl from "./ApiUrl";

const baseUrl = ApiUrl + "Users"

const getUser = (userId, callback) => {
    var then = true;
    axios({
        method: 'get',
        url: baseUrl + "/Get",
        params: {
            id: userId,
        },
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
            callback(e.data);
        }
    })
}

const getAllUsers = (adminsFirst, sortBy, page, callback) => {
    var then = true;
    axios({
        method: 'get',
        url: baseUrl + "/GetAll",
        params: {
            adminsFirst: adminsFirst,
            sortBy: sortBy,
            page: page,
        },
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
            callback(e.data);
        }
    })
}

const searchUsers = (model, selection, adminsFirst, sortBy, page, callback) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "/Search",
        params: { 
            model: model,
            selection: selection,
            adminsFirst: adminsFirst,
            sortBy: sortBy,
            page: page,
            usersOnly: false,
        },
        data : model,
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
    .then((e) => {
        if (then) {
            callback(e.data)
        }
    })
}

const searchUsersUsersOnly = (model, selection, adminsFirst, sortBy, page, callback) => {
    var then = true;
    axios({
        method: 'post',
        url: baseUrl + "/Search",
        params: { 
            model: model,
            selection: selection,
            adminsFirst: adminsFirst,
            sortBy: sortBy,
            page: page,
            usersOnly: true,
        },
        data : model,
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
    .then((e) => {
        if (then) {
            callback(e.data)
        }
    })
}

const putUser = (model, callback) => {
    var then = true
    axios({
        method: 'put',
        url: baseUrl + "/Put",
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
        then = false;
    })
    .then((e) =>
    {
        if(then){
            callback()
        }
    })
}

const deleteUser = (id, callback) => {
    var then = true
    axios({
        method: 'delete',
        url: baseUrl + "/Delete",
        params: {
            id: id,
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
        then = false;
    })
    .then((e) =>
    {
        if(then){
            callback()
        }
    })
}

export { getUser, getAllUsers, searchUsers, searchUsersUsersOnly, putUser, deleteUser }