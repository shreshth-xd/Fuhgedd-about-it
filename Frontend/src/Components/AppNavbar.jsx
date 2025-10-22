import { useState } from "react";

const AppNavBar = () =>{
    return(
        <div className="navBar jersey-25 bg-[#FFF8AA] mt-2 mx-auto w-11/12 px-12 py-3 flex items-center justify-between border-[3px] border-black rounded-3xl">
            <div className="VaultsAndSettings h-full flex items-center gap-x-2">
                <button className="px-7 py-3.5 rounded-2xl navbar-vault-btn border-2 border-black 
                {if(window.location.href='/app'){
                    bg-[#ff8400]
                }}
                ">Vaults</button>
                <button className="px-7 py-3.5 rounded-2xl navbar-settings-btn border-2 border-black 
                bg-linear-90 from-[#FFF8AA_30%] to-[#FF8400]">Settings</button>
            </div>
            <div className="Logout-btn h-full">
                <button className="px-7 py-3.5 rounded-2xl border-2 border-black 
                bg-linear-90 from-[#FFF8AA_30%] to-[#FF8400]
                ">Logout</button>
            </div>
        </div>
    )
}

export default AppNavBar;