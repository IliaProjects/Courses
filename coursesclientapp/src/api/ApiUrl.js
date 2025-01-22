import React from "react"
const ApiUrl = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
    "https://localhost:7021/api/" :
    "http://test-self.com/api/"

export default ApiUrl