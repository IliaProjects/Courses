import axios from "axios"
import Cookies from "js-cookie";
import Logout from "../classes/Logout";
import ApiUrl from "./ApiUrl";

const baseUrl = ApiUrl


const getProfile = (dispatch) => {
        var then = true;
        axios.get(baseUrl + "Profile/Get", {
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
                dispatch(e.data);
            }
        })
    }

const putProfile = (data, dispatch) => {
    var then = true;
    axios({
        method: 'put',
        url: baseUrl + "Profile/Edit",
        data: data,
        headers: {
            'Authorization': 'Bearer ' + Cookies.get('token'),
        }
    })
    .catch((e) => {
        console.log("hi from catch")
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
        console.log("hi from then")
        if (then) {
            dispatch(e.data);
        }
    })


    // axios.put(baseUrl + "/Profile/Edit",
    // {
    //     data
    // },
    // {
    //     headers: {
    //       'Authorization': 'Bearer ' + Cookies.get('token'),
    //     }
    // })
    // .catch((e) => {
    //     if(e.response.status == 401){
    //         Logout();
    //     }
    //     if(e.response.status == 403){
    //         alert('У вас недостаточно прав');
    //     }
    //     then = false
    //     console.log(e)
    // })
    // .then((e) =>
    // {   
    //     if (then) {
    //         //dispatch(e.data);
    //     }
    // })
}

export { getProfile }
export { putProfile }