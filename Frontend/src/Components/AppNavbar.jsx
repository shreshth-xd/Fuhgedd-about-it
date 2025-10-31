import { useState } from "react";

const AppNavBar = () =>{
    const currLocation = window.location.href;

    return(
        <div className="navBar jersey-25 bg-[#161614] mt-2 mx-auto w-11/12 px-12 py-3 flex items-center justify-between rounded-3xl text-white">
            <div className="VaultsAndSettings h-full flex items-center gap-x-2">
                <button className={`px-7 py-3.5 rounded-2xl navbar-vault-btn border-2 hover:border-white
                
                ${currLocation==='http://localhost:5173/app' ? 'bg-[#d9d9d3] text-[#161614]' : 'bg-[#161614]' }
                `}>Vaults</button>
                <button className={`px-7 py-3.5 rounded-2xl navbar-settings-btn border-2 hover:border-white 
                
                ${currLocation==='http://localhost:5173/settings' ? 'bg-[#d9d9d3] text-[#161614]' : 'bg-[#161614]' }
                `}>Settings</button>
            </div>
            <div className="Logout-btn h-full">
                <button className={`px-7 py-3.5 rounded-2xl border-2 hover:border-white

                ${currLocation==='http://localhost:5173/logout' ? 'bg-[#d9d9d3] text-[#161614]' : 'bg-[#161614]' }
                `}>Logout</button>
            </div>
        </div>
    )
}

export default AppNavBar;