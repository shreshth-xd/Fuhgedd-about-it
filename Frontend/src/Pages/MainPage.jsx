import { useState, useEffect } from "react";
import "../../../public/css/output.css";
import "../Components/Home.css";
import AppNavBar from "../Components/AppNavbar";
import DialogBox from "../Components/DialogBox";
import { v4 as uuidv4 } from "uuid";
// import {Key} from "lucide-react"

const MainPage = () => {
    const [vaultBoxes, setVaultBoxes] = useState([]);
    const [status, setStatus] = useState(""); // To track the status of the fetch
    const [isVaultBoxOpen, setIsVaultBoxOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // For generating keys for each credential input field:
    // const [algo, setAlgo] = useState("SHA256");
    const [credId, setCredId] = useState(1);
    const [credFields, setCredFields] = useState([
        {id: credId, Value: "", Algorithm: ""}
    ]);
    const isLimitExceed = credFields.length>=5;

    const addCred = () => {
        setCredId(previousId =>{
                const newId = previousId+1;
                setCredFields(currFields =>{
                    if(isLimitExceed===true) return currFields;
                    return [...currFields, {id: newId, Value: "", Algorithm: ""}]
                });

                return newId;
            }
        )
    };

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
    
    const createVault = (e) =>{
        e.preventDefault();
        console.log("Sending vault creation request and credential data to server...")
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
        <div className="ParentFlexBox bg-[#232323] w-full h-screen flex flex-col">
            <AppNavBar/>

            <div className="main-page w-full h-full">
                {status === "success" && (
                    <div className="vaults">
                        <h1>Vaults will display here</h1>
                        {/* Render vaults dynamically */}
                        {vaultBoxes.map((vault, index) => (
                            <div key={index} className="vault-box">
                                <p>{vault.name}</p>
                            </div>
                        ))}
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
                            <div className="dialog h-32 w-full text-center border-2 border-black rounded-b-lg pt-8 bg-linear-90 from-[#1a4bbf] to-[#020887_97.12%]">
                                <h2 className="jersey-25">No vaults to be found here</h2>
                                <p className="hover:text-white hover:font-medium inline" onClick={()=>{return setIsVaultBoxOpen(true)}}>Click to get started</p>
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
        
            <DialogBox
                isOpen={isVaultBoxOpen}
                onClose={() => {
                    setIsVaultBoxOpen(false)
                }}
            >
                <form onSubmit={createVault} className="w-full flex flex-col gap-y-8">
                    <div className="name flex flex-col gap-y-1.5">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="purpose" className="border-b-[1px] border-white focus:outline-[0.2px] bg-[#151515] px-0.5 py-1"/>
                    </div>

                    <div className="Credentials flex flex-col gap-y-1.5">
                        <label htmlFor="credential">Credentials:</label>
                        <div>
                            
                            {credFields.map((cred)=>{
                                return (
                                    <div key={cred.id} className="flex items-center">
                                        <input type={showPassword ? "text" : "password"} value={cred.Value} onChange={(e) => handleInput(cred.id, e.target.value)} name="credential" className="credential focus:outline-0 fo bg-[#1a1919] px-0.5 py-1 w-full mb-1"/>
                                        <select name="algoName" value={cred.Algorithm} onChange={(e) => handleAlgoChange(cred.id, e.target.value)} id="algoName" className="focus:outline-0 bg-[#151515] px-0.5 py-1">
                                            <option className="flex items-center justify-between px-1 py-1.5">
                                                SHA256
                                            </option>
                                            <option className="flex items-center justify-between px-1 py-1.5">
                                                BCrypt
                                            </option>
                                        </select>
                                    </div>
                                )
                            })}
                            <button type="button" className={`border-b-[1px] border-white bg-[#151515] hover:bg-[#1a1919] px-0.5 py-1 w-full  ${isLimitExceed ? "invisible" : "block"}`} onClick={addCred}>+</button>
                        </div>
                        <span className="text-blue-500 text-[12px]" onClick={()=>{
                            return setShowPassword(showPassword => !showPassword)
                        }}>
                            {showPassword ? "Hide values" : "Show values"}
                        </span>

                    </div>
                    
                    {/* <div className="algoName flex flex-col gap-y-1.5">
                        <label htmlFor="algoName">Encryption algorithm:</label>
                        <select name="algoName" id="algoName" className="border-b-[0.02px] border-white focus:outline-0 bg-[#151515] px-0.5 py-1">
                            <option className="flex items-center justify-between px-1 py-1.5">
                                SHA256
                            </option>
                            <option className="flex items-center justify-between px-1 py-1.5">
                                BCrypt
                            </option>
                        </select>
                    </div> */}

                    <div className="buttons flex items-center gap-x-2 flex-wrap">
                        <button type="submit" onClick={createVault} className="p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:bg-[#151515] md:text-white bg-white text-[#151515] hover:bg-white hover:text-[#151515] hover:font-semibold rounded-[4px]">Submit</button>
                        <button type="reset" className="p-2 flex items-center justify-center form-btn xl:h-[35px] xl:w-[90px] md:bg-[#151515] md:text-white bg-white text-[#151515] hover:bg-white hover:text-[#151515] hover:font-semibold rounded-[4px]">Reset</button>
                    </div>
                    
                </form>
            </DialogBox>
        
        </div>

        
        </>
    );
};

export default MainPage;
