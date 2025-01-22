import React from "react";
import "./css/Courses.css"

class Course extends React.Component {

    course = this.props.course
    render(){
        return (
            <div className="course-item">
                <img src={this.course.image}/>
                <div className="course-texts">
                    <div className="course-name">
                        <span>{this.course.name}</span>
                    </div>
                    <div className="course-description">
                        <span>{this.course.description}</span>
                    </div>
                </div>
            </div>
        );
    };
}

export default Course