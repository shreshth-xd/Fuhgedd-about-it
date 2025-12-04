import { useState, useEffect } from "react";
import {useParams} from "react-router-dom"


import { MdOutlineDeleteSweep } from "react-icons/md";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import { PiDownloadBold } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { GrAddCircle } from "react-icons/gr";
import PasswordModal from "../Components/PasswordModal";
import { MdDelete } from "react-icons/md";

const Vault = () =>{
    const {id} = useParams();
    console.log(id)
    const [Sidebar, setSidebar] = useState("block");
    const [vaults, setVaults] = useState([]);
    const [creds, setCreds] = useState([]);
    const [retrievalStatus, setRetrievalStatus] = useState("");
    const [VaultBgColor, setVaultBgColor] = useState();
    
    // Password modal state for decryption
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [selectedCredId, setSelectedCredId] = useState(null);


    useEffect(()=>{
        if(!id) return

        const fetchCreds = async () =>{
            try{
                const request = await fetch("/cred/GetCreds", {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({"id":id})
                });
                const data = await request.json();
                if(request.ok && data.creds.length>0){
                    setCreds(data.creds)
                    setRetrievalStatus("Creds fetched successfully")
                }else{
                    console.log(data.Status);
                }
            }catch(error){
                console.log(error)
            }
        }
        
        const FetchVaults = async () =>{
                const request = await fetch("/vault/getVaults");
                const data = await request.json();
                if(request.ok){
                    setVaults(data.vaults || [])
                }
        }

        fetchCreds();
        FetchVaults();
    }, [id])

    // Decrypt credential function
    const decryptCred = async (credId, password) => {
        try {
            const request = await fetch("/cred/decryptCred", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ credId, password })
            });
            const data = await request.json();
            return data;
        } catch (error) {
            return { error: error.message || "Decryption failed" };
        }
    }

    // Handle copy button click - opens password modal
    const handleCopyClick = (credId) => {
        setSelectedCredId(credId);
        setIsPasswordModalOpen(true);
        setPasswordError("");
    }

    // Handle password submission for decryption
    const handlePasswordSubmit = async (password) => {
        if (!selectedCredId) return;
        
        setPasswordError("");
        setIsPasswordModalOpen(false);
        
        try {
            const result = await decryptCred(selectedCredId, password);
            
            if (result.error) {
                setPasswordError(result.error);
                setIsPasswordModalOpen(true);
                return;
            }
            
            if (result.decryptedValue) {
                // Copy to clipboard
                navigator.clipboard.writeText(result.decryptedValue).then(() => {
                    alert(`Copied ${result.purpose || 'credential'} to clipboard!`);
                });
            } else {
                setPasswordError("Failed to decrypt credential");
                setIsPasswordModalOpen(true);
            }
        } catch (error) {
            console.error("Decryption error:", error);
            setPasswordError("An error occurred during decryption");
            setIsPasswordModalOpen(true);
        }
    }

    return(
        <>
            <div className="ParentContainer flex h-[100vh] w-[100vw] m-0 relative bg-[#e6fafc]">
                <div className={`SideBar w-[322px] h-full gap-y-3 overflow-y-auto bg-[#1d3660] ${Sidebar} self-start px-4 py-7 relative z-10 left-0 flex flex-col items-center`}>
                    <div className="SideBarHeader flex items-center justify-center w-full h-32 bg-[#FCFF31] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                        <h1 className="text-2xl jersey-25">Vaults</h1>
                    </div>

                    {vaults.map((vault)=>(
                        <div className="vaultNode px-4 py-4 h-44 w-full bg-white rounded-3xl shadow-[4px_8px_4px_4px_rgba(0, 0, 0, 0.25)]" key={vault._id}>
                            <h1 className="text-2xl jersey-25">{vault.name}</h1>
                            <h2>Cred count: {vault.creds.length}</h2>
                        </div>
                    ))}

                </div>
                <div className="FrontElements flex grow flex-col w-full">
                    <div className="NavBar gap-x-4 jersey-25 w-full h-[75px] bg-gray-400 px-4.5 py-1 flex items-center">
                        <button onClick={()=>{
                            if(Sidebar==="hidden"){
                                return setSidebar("block")
                            }else{
                                return setSidebar("hidden")
                            }
                        }} className="NavButton rounded-[26px] px-[28px] py-[12px] flex xl:hidden items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><BsLayoutTextSidebar/><p className="hidden lg:block">Sidebar</p></button>
                        <button onClick={()=>window.location.href="/app"} className="NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><AiOutlineHome/><p className="hidden lg:block">Home</p></button>
                    </div>


                    <div className="creds h-3/4 flex grow w-full p-3">
                        {
                            creds.map((cred)=>(
                                <div key={cred._id} className="cred h-24 max-h-28 mx-auto grow w-4xl bg-white rounded-2xl flex justify-between items-center px-5 shadow-[4px_4px_7px_2px_rgba(0,0,0,0.25))]">
                                    <span className="title jersey-25 text-2xl">{cred.purpose}</span>
                                    <div className="credBtns flex items-center gap-x-1">
                                        <button 
                                            onClick={() => handleCopyClick(cred._id)}
                                            className="CopyBtn px-3 py-1.5 bg-[#1c1c1c] text-white rounded-[8px] hover:bg-[#2c2c2c]"
                                        >
                                            Copy
                                        </button>
                                        <button onClick={()=>removeCred(cred.id)} className="DeleteBtn p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:text-white bg-red-600 text-white hover:font-semibold rounded-[4px] flex-1/6 mb-1"><MdDelete/></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    
                    
                    <div className="buttons h-1/6 bg-gray-400">
                        <div className="DeleteAllBtn"></div>
                        <div className="FeedbackBtn"></div>
                        <div className="AddCredBtn"></div>
                        <div className="DownloadAllBtn"></div>
                        <div className="Settings"></div>
                    </div>
                </div>
            </div>

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError("");
                    setSelectedCredId(null);
                }}
                onSubmit={handlePasswordSubmit}
                title="Enter Master Password to Decrypt Credential"
                error={passwordError}
            />
        </>
    )
}

export default Vault;