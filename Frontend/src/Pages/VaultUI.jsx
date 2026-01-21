import { useState, useEffect } from "react";
import {useParams} from "react-router-dom"


// React icons
import { MdOutlineDeleteSweep } from "react-icons/md";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import { PiDownloadBold } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { GrAddCircle } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

// Password modal and dialog box component
import PasswordModal from "../Components/PasswordModal";
import DialogBox from "../Components/DialogBox";
import PopUp from "../Components/PopUp";

const Vault = () =>{
    const {id} = useParams();
    const [Sidebar, setSidebar] = useState("hidden");
    const [vaults, setVaults] = useState([]);
    const [creds, setCreds] = useState([]);
    // const [retrievalStatus, setRetrievalStatus] = useState("");
    // const [VaultBgColor, setVaultBgColor] = useState();
    
    // Password modal state for decryption
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [selectedCredId, setSelectedCredId] = useState(null);
    const [isCreatingCred, setIsCreatingCred] = useState(false); // Track if creating cred
    
    // Create cred modal state
    const [isCreateCredModalOpen, setIsCreateCredModalOpen] = useState(false);
    const [newCredPurpose, setNewCredPurpose] = useState("");
    const [newCredValue, setNewCredValue] = useState("");
    const [newCredAlgorithm, setNewCredAlgorithm] = useState("AES-256-GCM");
    const [createCredError, setCreateCredError] = useState("");

    // Feedback modal state
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    
    const [username, setUsername] = useState("");



    // To load the creds and user profile once the page has been loaded
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

        const FetchUser = async () =>{
            const request = await fetch("/user/getUser");
            const data = await request.json();
            if(request.ok){
                setUsername(()=>data.username);
            }
        }

        fetchCreds();
        FetchUser();
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

    // Create credential function
    const createCred = async (password) => {
        try {
            const request = await fetch("/cred/createCred", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    password,
                    purpose: newCredPurpose,
                    value: newCredValue,
                    algorithm: newCredAlgorithm,
                    vaultId: id
                })
            });
            const data = await request.json();
            return data;
        } catch (error) {
            return { error: error.message || "Failed to create credential" };
        }
    }

    // Handle create cred form submission
    const handleCreateCredSubmit = async (e) => {
        e.preventDefault();
        
        if (!newCredPurpose.trim() || !newCredValue.trim()) {
            setCreateCredError("Purpose and value are required");
            return;
        }
        
        // Open password modal to get encryption password
        setIsCreateCredModalOpen(false);
        setIsCreatingCred(true);
        setIsPasswordModalOpen(true);
        setPasswordError("");
    }

    // Handle password submission for creating credential
    const handleCreateCredPasswordSubmit = async (password) => {
        setIsPasswordModalOpen(false);
        setPasswordError("");
        
        try {
            const result = await createCred(password);
            
            if (result.error) {
                setPasswordError(result.error);
                setIsPasswordModalOpen(true);
                return;
            }
            
            if (result.cred) {
                // Refresh the creds list
                const request = await fetch("/cred/GetCreds", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ id: id })
                });
                const data = await request.json();
                if (request.ok && data.creds) {
                    setCreds(data.creds);
                }
                
                // Reset form
                setNewCredPurpose("");
                setNewCredValue("");
                setNewCredAlgorithm("AES-256-GCM");
                setCreateCredError("");
                setIsCreatingCred(false);
                alert("Credential created successfully!");
            } else {
                setPasswordError("Failed to create credential");
                setIsPasswordModalOpen(true);
            }
        } catch (error) {
            console.error("Create credential error:", error);
            setPasswordError("An error occurred while creating credential");
            setIsPasswordModalOpen(true);
        }
    }


    const HandleFeedbackSubmit = async () =>{
        setIsFeedbackOpen(false);
    }



    return(
        <>
            <div className="ParentContainer flex h-[100vh] w-[100vw] m-0 relative bg-white">
                <div className={`SideBar w-[322px] h-full gap-y-3 overflow-y-auto bg-[#000] ${Sidebar} self-start px-4 py-7 absolute lg:relative z-10 left-0 flex flex-col items-center`}>
                    <div className="SideBarHeader p-4 flex items-center justify-between w-full h-16 gap-x-1.5 bg-[#FCFF31] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                        
                        <div className="ProfilePicAndUsername flex items-center gap-x-1">
                            <CgProfile className="profile-pic h-8 w-8"/>
                            <h2>{username}</h2>
                        </div>
                        
                        <button onClick={()=>{
                            if(Sidebar==="hidden"){
                                return setSidebar("block")
                            }else{
                                return setSidebar("hidden")
                            }
                        }} className="lg:hidden NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><BsLayoutTextSidebar/></button>
                    
                    </div>

                    {vaults.map((vault)=>(
                        <div className="vaultNode px-4 py-4 h-44 w-full bg-white rounded-3xl shadow-[4px_8px_4px_4px_rgba(0, 0, 0, 0.25)]" key={vault._id}>
                            
                            <h1 onClick={()=> window.location.href = `/Vault/${vault._id}`} 
                            className={`text-2xl jersey-25 ${window.location.pathname === `/Vault/${vault._id}` ? "text-blue-500" : "text-black"} hover:underline inline`}>
                                {vault.name}
                            </h1>

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
                        }} className="NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><BsLayoutTextSidebar/><p className="hidden lg:block">Vaults</p></button>
                        <button onClick={()=>window.location.href="/app"} className="NavButton rounded-[26px] px-[28px] py-[12px] flex items-center gap-x-1.5 bg-[#e5eafa] shadow-[0_4px_12px_rgba(0,0,0,0.4)]"><AiOutlineHome/><p className="hidden lg:block">Vaults Dashboard</p></button>
                    </div>


                    <div className="creds h-3/4 flex flex-col grow w-full p-3 gap-y-2">
                        {
                            creds.map((cred)=>(
                                <div key={cred._id} className="cred h-24 max-h-28 grow bg-[#f2f2f2] border-[1px] border-black rounded-2xl flex justify-between items-center px-5 shadow-[4px_4px_7px_2px_rgba(0,0,0,0.25))]">
                                    <span className="title jersey-25 text-2xl">{cred.purpose}</span>
                                    <div className="credBtns flex items-center gap-x-1">
                                        <button 
                                            onClick={() => handleCopyClick(cred._id)}
                                            className="CopyBtn px-3 py-1.5 bg-[#1c1c1c] text-white rounded-[4px] hover:bg-[#2c2c2c]"
                                        >
                                            Copy
                                        </button>
                                        <button className="DeleteBtn p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:text-white bg-red-600 text-white hover:font-semibold rounded-[4px] flex-1/6"><MdDelete/></button>
                                    </div>
                                </div>
                            ))
                        }
                        <button 
                            onClick={() => setIsCreateCredModalOpen(true)}
                            className="cred h-24 max-h-28 grow bg-[#f2f2f2] border-[1px] border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_7px_2px_rgba(0,0,0,0.25))] hover:bg-gray-100"
                        >
                            <span className="text-black text-4xl font-bold">+</span>
                        </button>
                    </div>
                    
                    
                    <div className="buttons h-1/6 w-[fit-content] mx-auto bg-[rgb(242,242,242)] border-2 p-5 flex gap-x-5 justify-between items-center border-black rounded-[39px] mb-[14px]">
                        <div className="DeleteAllBtn VaultUI-Footer-Utility-Button">
                            <MdOutlineDeleteSweep className="VaultUI-Footer-Svg-Icon"/>
                            <p className="hidden lg:block">Delete all</p>
                        </div>

                        <div className="FeedbackBtn VaultUI-Footer-Utility-Button" onClick={() => setIsFeedbackOpen(true)}>
                            <VscFeedback className="VaultUI-Footer-Svg-Icon"/>
                            <p className="hidden lg:block">Feedback</p>    
                        </div>
                        
                        <div className="AddCredBtn VaultUI-Footer-Utility-Button" onClick={() => setIsCreateCredModalOpen(true)}>
                            <GrAddCircle className="VaultUI-Footer-Svg-Icon"/>
                            <p className="hidden lg:block">Add a cred</p>
                        </div>
                        
                        <div className="DownloadAllBtn VaultUI-Footer-Utility-Button">
                            <PiDownloadBold className="VaultUI-Footer-Svg-Icon"/>
                            <p className="hidden lg:block">Download all creds</p>
                        </div>
                        
                        <div className="Settings VaultUI-Footer-Utility-Button">
                            <IoSettingsOutline className="VaultUI-Footer-Svg-Icon"/>
                            <p className="hidden lg:block">Settings</p>
                        </div>
                        
                    </div>
                </div>
            </div>

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError("");
                    if (isCreatingCred) {
                        setIsCreatingCred(false);
                    } else {
                        setSelectedCredId(null);
                    }
                }}
                onSubmit={isCreatingCred ? handleCreateCredPasswordSubmit : handlePasswordSubmit}
                title={isCreatingCred ? "Enter Master Password to Encrypt Credential" : "Enter Master Password to Decrypt Credential"}
                error={passwordError}
            />

            <DialogBox
                isOpen={isCreateCredModalOpen}
                onClose={() => {
                    setIsCreateCredModalOpen(false);
                    setCreateCredError("");
                    setNewCredPurpose("");
                    setNewCredValue("");
                    setNewCredAlgorithm("AES-256-GCM");
                }}
                title="Create New Credential"
            >
                <form onSubmit={handleCreateCredSubmit} className="w-full flex flex-col gap-y-6">
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="purpose" className="text-sm">Purpose/Name:</label>
                        <input
                            type="text"
                            id="purpose"
                            value={newCredPurpose}
                            onChange={(e) => setNewCredPurpose(e.target.value)}
                            className="bg-[#1a1919] px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                            placeholder="e.g., Email Password, Bank PIN"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="value" className="text-sm">Value:</label>
                        <input
                            type="password"
                            id="value"
                            value={newCredValue}
                            onChange={(e) => setNewCredValue(e.target.value)}
                            className="bg-[#1a1919] px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                            placeholder="Enter credential value"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="algorithm" className="text-sm">Algorithm:</label>
                        <select
                            id="algorithm"
                            value={newCredAlgorithm}
                            onChange={(e) => setNewCredAlgorithm(e.target.value)}
                            className="bg-[#1a1919] px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                        >
                            <option value="AES-256-GCM">AES-256-GCM</option>
                            <option value="Twofish">Twofish</option>
                            <option value="Camellia">Camellia</option>
                            <option value="AES-256-CBC">AES-256-CBC</option>
                            <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                        </select>
                    </div>

                    {createCredError && (
                        <p className="text-red-500 text-sm">{createCredError}</p>
                    )}

                    <div className="flex gap-x-2 justify-end">

                        <button
                            type="button"

                            onClick={() => {
                                setIsCreateCredModalOpen(false);
                                setCreateCredError("");
                                setNewCredPurpose("");
                                setNewCredValue("");
                                setNewCredAlgorithm("AES-256-GCM");
                            }}

                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </DialogBox>

            <DialogBox isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} title="Give us your feedback" onSubmit={HandleFeedbackSubmit}>
                <div className="FeedbackBoxContainer flex flex-col gap-y-4">
                    <label htmlFor="feedback">Tell us what do you think we can improve?</label>
                    <textarea  id="feedback" className="resize-none border-2 rounded-[8px] border-[#c3bebe] bg-[#404040b3]"></textarea>
                    <div className="flex items-center gap-x-2">
                        <input type="submit" value="Submit" className="px-3 py-1.5 rounded-[8px] p-0.5 text-amber-50 bg-red-700 sm:bg-red-500 hover:bg-red-700"/>
                        <input type="reset" value="Clear" className="px-3 py-1.5 rounded-[8px] text-black bg-amber-50"/>
                    </div>
                </div>
            </DialogBox>
        </>
    )
}

export default Vault;