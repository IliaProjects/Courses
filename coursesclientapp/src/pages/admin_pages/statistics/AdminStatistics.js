import React from "react";
import { FaChartBar } from "react-icons/fa";
import '../css/AdminCourses.css'

const AdminStatistics = (props) => {
            
        return (<div className="admin-courses-container">
                    <div className="admin-header">
                        <div className="heder-title">
                            <FaChartBar/>
                            <h3>Статистика</h3>
                        </div>
                    </div>
                    <div className="courses-flexbox-empty">
                        <span>Статистики нет...</span>
                    </div>
                </div>);
}

export default AdminStatistics