import { useState } from "react";

// React icons:
import { FaVault } from "react-icons/fa6";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";


const AppNavBar = () =>{
    const currLocation = window.location.href;

    return(
        <div className="AppNavBar jersey-25 bg-[#292928] w-full px-8 py-3 flex items-center justify-between text-white">
                <button className={`lg:px-7 lg:py-3.5 px-4 py-2  rounded-2xl navbar-vault-btn border-2 hover:border-white
                ${currLocation==='http://localhost:5173/app' ? 'bg-[#d9d9d3] text-[#161614]' : 'bg-[#161614]' }
                `}>
                    <FaVault className="icon"/>
                    <label htmlFor="vaults" className="AppNavBarBtnText">
                        Vaults
                    </label>                    
                </button>

                
                <button className={`lg:px-7 lg:py-3.5 px-4 py-2 rounded-2xl border-2 hover:border-white`} onClick={async ()=>{
                    const LogOutReq = await fetch("/user/logout", {credentials: "include"})
                    if(LogOutReq.ok){
                        window.location.href = "/"
                    }
                }}>

                    <IoLogOut className="icon"/>
                    <label htmlFor="logout" className="AppNavBarBtnText">
                        Logout
                    </label>    
                    
                </button>
        </div>
    )
}

export default AppNavBar;