import { useState } from "react";

const Vault = () =>{
    return(
        <>
            <div className="ParentContainer flex gap-x-10 h-[100vh] w-[100vw] m-0 p-8 bg-[linear-gradient(257.89deg,rgba(0,0,0,0.83)_25.09%,rgba(49,49,49,0.83)_85.57%)]">
                <div className="SideBar w-[322px] h-[98%] rounded-3xl md:block self-start bg-[#f0f0f0] px-4 py-7">
                    <div className="SideBarHeader w-full h-32 bg-[#D9D9D9] rounded-2xl">

                    </div>
                </div>
                <div className="FrontElements flex grow flex-col gap-y-2">
                    <div className="NavBar jersey-25 w-full h-[75px] bg-white rounded-3xl px-4.5 py-1 flex items-center">
                        <button className="NavButton rounded-[26px] px-[28px] py-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">Home</button>
                    </div>
                    <div className="vaults flex-[55%] bg-red-600 rounded-3xl"></div>
                    <div className="buttons flex-1/6 bg-white rounded-4xl">
                        <div className="DeleteAllBtn"></div>
                        <div className="FeedbackBtn"></div>
                        <div className="AddCredBtn"></div>
                        <div className="DownloadAllBtn"></div>
                        <div className="Settings"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Vault;