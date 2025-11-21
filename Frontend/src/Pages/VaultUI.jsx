import { useState } from "react";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import {useParams} from "react-router-dom"

const Vault = () =>{
    const [Sidebar, setSidebar] = useState("hidden");

    return(
        <>
            <div className="ParentContainer flex h-[100vh] w-[100vw] m-0 relative">
                <div className={`SideBar w-[322px] h-full bg-[#000] ${Sidebar} self-start px-4 py-7 relative z-10 left-0`}>
                    <div className="SideBarHeader w-full h-32 bg-[#FCFF31] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                    </div>
                </div>
                <div className="FrontElements flex grow flex-col">
                    <div className="NavBar gap-x-4 jersey-25 w-full h-[75px] bg-gray-400 px-4.5 py-1 flex items-center">
                        <button onClick={()=>{
                            if(Sidebar==="hidden"){
                                return setSidebar("block")
                            }else{
                                return setSidebar("hidden")
                            }
                        }} className="NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><BsLayoutTextSidebar/><p className="hidden lg:block">Sidebar</p></button>
                        <button onClick={()=>window.location.href="/app"} className="NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><AiOutlineHome/><p className="hidden lg:block">Home</p></button>
                    </div>


                    <div className="vaults h-3/4 bg-[#e6fafc]">
                        {/* To render the actual vaults themselves */}
                        {/* Gonna use the useeffect() hook to load and show up the requested vault, with the dependency array of
                        hook being the vault id itself, so if user tries to open a new vault, it actually does change the opened vault */}
                        
                    </div>
                    
                    
                    <div className="buttons h-1/6 bg-gray-300">
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