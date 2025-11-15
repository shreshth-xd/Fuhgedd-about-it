import { useState, useEffect } from "react";
import "../../../public/css/output.css";
import "../Components/Home.css";
import AppNavBar from "../Components/AppNavbar";
import DialogBox from "../Components/DialogBox";
import { v4 as uuidv4 } from "uuid";
import ErrorBox from "../Components/PopUp";

// React icons
import { MdDelete } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDeleteSweep } from "react-icons/md";

const MainPage = () => {
    
    const [vaultBoxes, setVaultBoxes] = useState([]); //Array of vault objects
    const [status, setStatus] = useState(""); // To track the status of fetching of the vaults
    const [isVaultBoxOpen, setIsVaultBoxOpen] = useState(false); //To toggle the vault creation window
    const [showPassword, setShowPassword] = useState(false);
    
    const [vaultName, setVaultName] = useState("")
    
    
    // For generating keys for each credential input field:
    const [credId, setCredId] = useState(1);

    
    // The array of objects to hold the actual credential data:
    const [credFields, setCredFields] = useState([
        {id: credId, Name: "", Value: "", Algorithm: "SHA256"}
    ]);


    // To display the error received by the vault creation Fetch API
    const [isVaultCreationErrorBoxOpen, setIsVaultCreationErrorBoxOpen] = useState(false);
    const [vaultCreationStatus, setVaultCreationStatus] = useState();


    // Constants to check if the user has only the permitted number of creds or vaults
    const isLimitExceed = credFields.length>=5;
    const isVaultLimitExceed = vaultBoxes.length>=6;


    const addCred = () => {
        setCredId(previousId =>{
                const newId = previousId+1;
                setCredFields(currFields =>{
                    if(isLimitExceed===true) return currFields;
                    return [...currFields, {id: newId, Name:"", Value: "", Algorithm: "SHA256"}]
                });

                return newId;
            }
        )
    };

    // Keeping only the remvove cred function over here, because user doesn't gets to actually "delete" a cred
    // until he actuall opens that respective vault
    const removeCred = (id) =>{
        setCredFields(curr=>
            curr.filter(field => field.id!==id)
        )
    }

    const deleteVault = async (vault_id) =>{        
        try{
            const req = await fetch(`/vault/deleteVault/${vault_id}`, {
                method: "DELETE",
                credentials: "include"
            })
            const res = await req.json();
            if(req.ok){
                setVaultBoxes(currVaults => 
                    currVaults.filter(vault => vault._id!==vault_id)
                )
            }else{
                setVaultCreationStatus(res.Status);
                setIsVaultCreationErrorBoxOpen(true);
            }
        }catch(error){
            console.log(error)
            setVaultCreationStatus(error);
            setIsVaultCreationErrorBoxOpen(true);
        }
    }

    // To handle the value change in cred name and algo dropdown input fields:
    const handleCredName = (id, value) =>{
        setCredFields(prev=> 
            prev.map(field =>
                field.id === id ? {...field, Name: value} : field
            )
        )
    }

    const handleInput = (id, value) =>{
        setCredFields(prev=> 
            prev.map(field =>
                field.id === id ? {...field, Value: value} : field
            )
        )
    }




    const handleAlgoChange = (id, value) =>{
        setCredFields(currs =>
            currs.map(field=>
                field.id === id ? {...field, Algorithm: value} : field
            )
        )
    }


    const encryptCreds = async (creds) =>{
        try{
            const encryptionRequest = await fetch("/cred/encryptCreds", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(creds),
                credentials: "include"
            });
            return await encryptionRequest.json();
        }catch(error){
            return error;
        }
    }



    // To create a vault and register it to the DB
    const createVault = async (e) =>{
        e.preventDefault();
        // console.log(credFields)
        

        // Making a request to encrypt the credential's values before inserting them into a newly created vault
        let EncryptedCreds = await encryptCreds(credFields);
        console.log(EncryptedCreds)
        

        const VaultId = uuidv4();
        const dataPayload = {"vault":vaultName, "creds":EncryptedCreds}
        // console.log(dataPayload)
        try {
            const res = await fetch("/vault/createVault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataPayload),
                credentials: "include"
            });
            const data = await res.json();

            if(res.ok){
                // Gonna update the vaultBoxes state as soon as we receive the vaults on the assurance of our request:
                setStatus("")
                setVaultBoxes(currVaultsOnPage => {
                    
                    return [...currVaultsOnPage, {vault: data.vault}]
                })
            
                setStatus("success");
                setIsVaultBoxOpen(false)
            }else{
                const creationStatus = data.Status;
                setVaultCreationStatus(creationStatus);
                setIsVaultCreationErrorBoxOpen(true);
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    



    useEffect(() => {
        const fetchVaults = async () => {
            try {
                const res = await fetch("/vault/getVaults", { credentials: "include" });
                const data = await res.json();

                if (res.ok && data.vaults && data.vaults.length > 0) {
                    setVaultBoxes(data.vaults); // Update vaults if they exist
                    setStatus("success");
                } else if (res.ok && (!data.vaults || data.vaults.length === 0)) {
                    setStatus("empty"); // No vaults found
                } else {
                    setStatus("error"); // Error fetching vaults
                }
            } catch (error) {
                console.log("Error fetching vaults:", error);
                setStatus("error");
            }
        };

        fetchVaults();
    }, []); // Empty dependency array to run only once on mount

    return (
        <>
        <div className="ParentFlexBox bg-[linear-gradient(135deg,#1f1f1f,#2c2c2c)] w-full h-screen flex flex-col gap-y-5 relative">
            <AppNavBar/>

            <div className="main-page w-full h-full">
                <div className="vaults border-2 border-white max-w-6xl mx-auto p-6 h-full overflow-hidden rounded-4xl bg-linear-180 from-[#161616] to-[#313131]">
                    {status === "success" && (
                        <div className="flex flex-col gap-y-2.5">
                            {vaultBoxes.map((vault) => (    
                                    <div key={vault._id} className="vault-box h-auto w-full bg-[#2c2c2c] px-3 py-2 rounded-[6px]">
                                        <div className="dialog w-full flex justify-between items-center text-gray-200">
                                            <h2 onClick={()=>{window.location.href = "/Vault"}}>{vault.name}</h2>
                                            <div className="flex gap-x-1.5">
                                                <button onClick={()=>deleteVault(vault._id)} className="DeleteBtn p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:text-white bg-red-600 text-white hover:font-semibold rounded-[4px] mb-1"><MdDelete/></button>
                                                <button className="CredSettingsBtn p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:text-black bg-white text-black hover:font-semibold rounded-[4px] mb-1"><IoSettingsOutline/></button>
                                            </div>
                                        </div>
                                    </div>
                            ))}
                            <div className="AddIcon h-auto p-2 flex w-full justify-center items-center gap-x-1.5 text-white">
                                <button className={`text-center rounded-[4px] px-1 py-3 ${isVaultLimitExceed ? "invisible" : "block"} bg-[#282828] grow shrink h-[35px] flex items-center justify-center`} onClick={()=>setIsVaultBoxOpen(true)}>Add vault</button>
                                <button onClick={()=>setVaultBoxes((currVaults)=> [])} className="DeleteAllBtn px-1 py-3 flex items-center justify-center grow shrink form-btn xl:h-[35px] bg-red-500 hover:font-semibold rounded-[4px]"><MdDeleteSweep/></button>
                            </div>
                        </div>
                    )}

                    {status === "empty" && (
                            <div className="NoVaultParent w-full h-auto mt-34">
                                <div className="NoVaultBox h-72 w-96 mx-auto">
                                    <div className="UpperBar pt-2 px-2 w-full h-14 flex items-center justify-end border-2 border-black bg-linear-90 from-[#1a4bbf] to-[#020887]">
                                        <svg width="35" height="43" viewBox="0 0 35 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.5 0.5C26.8757 0.5 34.5 8.32165 34.5 18C34.5 27.6784 26.8757 35.5 17.5 35.5C8.12434 35.5 0.5 27.6784 0.5 18C0.5 8.32165 8.12434 0.5 17.5 0.5Z" fill="#F4FFAA" stroke="#F4FFAA"/>
                                            <path d="M15.4229 27V18.1577L14.6029 17.652V16.1897L17.5413 15.3833H19.8236V27H15.4229ZM17.4046 14.126L15.1633 11.871V11.3927L17.4046 9.15133H17.9239L20.2609 11.3927V11.871L17.9239 14.126H17.4046Z" fill="#0B0C00"/>
                                        </svg>
                                    </div>
                                    <div className="dialog h-32 w-full text-center border-2 border-black rounded-b-lg pt-8 bg-linear-90 from-[#1a4bbf] to-[#020887]">
                                        <h2 className="jersey-25 text-gray-950">No vaults to be found here</h2>
                                        <p className="hover:text-white text-white md:text-black hover:font-medium inline" onClick={()=>{return setIsVaultBoxOpen(true)}}>Click to get started</p>
                                    </div>
                                </div>
                            </div>
                    )}

                    {status === "error" && (
                                    <div className="NoVaultParent w-full h-auto mt-34 text-white">
                                        <div className="NoVaultBox h-72 w-96 mx-auto">
                                            <div className="UpperBar pt-2 px-2 w-full h-14 flex items-center justify-end border-2 border-black bg-linear-90 from-[#1a4bbf] to-[#020887]">
                                                <svg width="35" height="43" viewBox="0 0 35 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.5 0.5C26.8757 0.5 34.5 8.32165 34.5 18C34.5 27.6784 26.8757 35.5 17.5 35.5C8.12434 35.5 0.5 27.6784 0.5 18C0.5 8.32165 8.12434 0.5 17.5 0.5Z" fill="#F4FFAA" stroke="#F4FFAA"/>
                                                    <path d="M15.4229 27V18.1577L14.6029 17.652V16.1897L17.5413 15.3833H19.8236V27H15.4229ZM17.4046 14.126L15.1633 11.871V11.3927L17.4046 9.15133H17.9239L20.2609 11.3927V11.871L17.9239 14.126H17.4046Z" fill="#0B0C00"/>
                                                </svg>
                                            </div>
                                            <div className="dialog h-32 w-full text-center border-2 border-black rounded-b-lg pt-8">
                                                <h2 className="jersey-25">There was an error in retrieving the vaults</h2>
                                                <p>Please try again later</p>
                                            </div>
                                        </div>
                                    </div>
                    )}

                </div>  
            </div>
        
            <DialogBox
                isOpen={isVaultBoxOpen}
                onClose={() => {
                    setIsVaultBoxOpen(false)
                }}
            >
                <form onSubmit={createVault} className="w-full flex flex-col gap-y-8">
                    <div className="name flex flex-col gap-y-1.5">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="purpose" placeholder="ex.- Passwords, Seed phrases, Private keys, etc." value={vaultName} onChange={(e)=>setVaultName(e.target.value)} className="border-b-[1px] border-white focus:outline-[0.2px] bg-[#151515] px-0.5 py-1"/>
                    </div>

                    <div className="Credentials flex flex-col gap-y-1">
                        <label htmlFor="credential">Credentials:</label>
                        <div className="flex flex-col gap-y-0.5">
                            
                            {credFields.map((cred)=>{
                                return (
                                    <div key={cred.id} className="flex-col items-center mb-2.5 gap-y-0.5">
                                        
                                        <div className="CredNameAndDeleteBtn flex items-center gap-x-1">
                                            <input type="text" placeholder="Name" value={cred.Name} onChange={(e) => handleCredName(cred.id, e.target.value)} className="credential focus:outline-0 fo bg-[#1a1919] px-0.5 py-1 w-full mb-1 text-gray-200 grow"/>
                                            <button onClick={()=>removeCred(cred.id)} className="DeleteBtn p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:text-white bg-red-600 text-white hover:font-semibold rounded-[4px] flex-1/6 mb-1"><MdDelete/></button>
                                        </div>

                                        <div className="DataFields flex items-center gap-x-1">
                                            <input type={showPassword ? "text" : "password"} placeholder="Credential's value" value={cred.Value} onChange={(e) => handleInput(cred.id, e.target.value)} name="credential" className="credential focus:outline-0 fo bg-[#1a1919] px-0.5 py-1 w-full mb-1 grow text-gray-500"/>
                                            <select name="algoName" value={cred.Algorithm} onChange={(e) => handleAlgoChange(cred.id, e.target.value)} id="algoName" className="focus:outline-0 bg-[#151515] px-0.5 py-1 flex-1/6 text-gray-400 mb-1">
                                                <option className="flex items-center justify-between px-1 py-1.5">
                                                    SHA256
                                                </option>
                                                <option className="flex items-center justify-between px-1 py-1.5">
                                                    BCrypt
                                                </option>
                                            </select>
                                        </div>

                                    </div>
                                )
                            })}
                            <button type="button" className={`border-b-[1px] border-white bg-[#151515] hover:bg-[#1a1919] px-0.5 py-1 w-full  ${isLimitExceed ? "invisible" : "block"}`} onClick={addCred}>+</button>

                        </div>
                        <span className="text-blue-500 text-[15px]" onClick={()=>{
                            return setShowPassword(showPassword => !showPassword)
                        }}>
                            {showPassword ? "Hide values" : "Show values"}
                        </span>

                    </div>
                    

                    <div className="buttons flex items-center gap-x-2 flex-wrap">
                        <button type="submit" onClick={createVault} className="p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:bg-[#151515] md:text-white bg-white text-[#151515] hover:bg-white hover:text-[#151515] hover:font-semibold rounded-[4px]">Submit</button>
                        <button type="reset" className="p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:bg-[#151515] md:text-white bg-white text-[#151515] hover:bg-white hover:text-[#151515] hover:font-semibold rounded-[4px]">Reset</button>
                    </div>
                    
                </form>

            </DialogBox>

                <ErrorBox
                    isOpen={isVaultCreationErrorBoxOpen}
                    onClose={()=> 
                        setIsVaultCreationErrorBoxOpen(false)
                }>               
                    <p>{vaultCreationStatus}</p>
                </ErrorBox>
        
        </div>

        
        </>
    );
    console.log(credFields)
};


export default MainPage;