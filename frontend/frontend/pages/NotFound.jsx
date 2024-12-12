import { useState } from "react"
import api from "../api"
import { Navigate, useNavigate } from "react-router-dom"
// import "../style/Login.css"

function NotFound()
{
    return (
        <div><h1>404 Not Found</h1></div>
    );
}

export default NotFound