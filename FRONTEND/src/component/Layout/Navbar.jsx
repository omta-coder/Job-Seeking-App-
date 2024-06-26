import React, { useContext, useState } from 'react'
import { Context } from '../../main'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false)
  const {isAutherized,setIsAutherized,user} = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      const response = await axios.get("http://localhost:4000/api/v1/user/logout",{withCredentials:true});
      toast.success(response.data.message);
      setIsAutherized(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAutherized(true);
    }
  }

  return (
    <nav className={isAutherized ? "navbarShow" : "navbarHide"}>
      <div className="container">
        <div className="logo">
          <img src="/JobZee-logos__white.png" alt="" />
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
          <Link to={"/"} onClick={()=>setShow(false)}>HOME</Link>
          </li>
          <li>
          <Link to={"/job/getall"} onClick={()=>setShow(false)}>ALL JOBS</Link>
          </li>
          <li>
          <Link to={"/application/me"} onClick={()=>setShow(false)}>
          {user && user.role === "Employer" ? "APPLICATN'S APPLICATIONS": "MY APPLICATIONS"}
          </Link>
          </li>
          {user && user.role === "Employer" ? (<>
          <li>
          <Link to={"/job/post"} onClick={()=>setShow(false)}>POST NEW JOB</Link>
          </li>
          <li>
          <Link to={"/job/me"} onClick={()=>setShow(false)}>VIEW YOUR JOBS</Link>
          </li>
          </>) : (<></>) }
          <button onClick={handleLogout}>Logout</button>
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={()=>setShow(!show)} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar