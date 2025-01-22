import React, { useState } from "react"
import css from "./AdminOrders.module.css"
import Toastr from "../../../things/Toastr"
import { BsEnvelopeExclamationFill } from "react-icons/bs";
import Paginator from "../../../components_common/Paginator";

const AdminOrders = (props) => {
    const [pager, setPager] = useState(null)
    const [page, setPage] = useState(1)

    return(<div className={css.adminOrdersPage}>
        <Toastr />
        <div className={css.adminHeader}>
            <div className={css.headerTitle}>
                <BsEnvelopeExclamationFill />
                <h3>Заявки пользователей</h3>
            </div>
        </div>
        
        <Paginator pager={pager} setPageNr={setPage}/> 
        
    </div>)
}

export default AdminOrders