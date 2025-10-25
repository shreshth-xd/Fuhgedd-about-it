import { useState, useEffect } from "react";
import "../../../public/css/output.css";
import "../Components/Home.css";
import AppNavBar from "../Components/AppNavbar";
import DialogBox from "../Components/DialogBox";

const MainPage = () => {
    const [vaultBoxes, setVaultBoxes] = useState([]);
    const [status, setStatus] = useState(""); // To track the status of the fetch
    const [isVaultBoxOpen, setIsVaultBoxOpen] = useState(false);
    

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
        <div className="ParentFlexBox bg-linear-258 from-[#e1ff00] to-[#f8ffaa] w-full h-screen flex flex-col">
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
                            <div className="UpperBar pt-2 px-2 w-full h-14 flex items-center justify-end border-2 border-black bg-linear-90 from-[#fffbaa_24.52%] to-[#ffea00]">
                                <svg
                                    width="35"
                                    height="43"
                                    viewBox="0 0 35 43"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M17.5 0.5C26.8757 0.5 34.5 8.32165 34.5 18C34.5 27.6784 26.8757 35.5 17.5 35.5C8.12434 35.5 0.5 27.6784 0.5 18C0.5 8.32165 8.12434 0.5 17.5 0.5Z"
                                        fill="#F4FFAA"
                                        stroke="#F4FFAA"
                                    />
                                    <path
                                        d="M14.8746 27H10.3919L14.8609 19.046L10.5969 10.9827H15.9816L17.1843 14.003L17.7856 15.7387L18.4416 14.0303L19.7399 10.9827H24.2089L19.9586 18.2123L24.4003 27H19.0976L17.6216 23.31L17.1023 21.6427L16.4326 23.31L14.8746 27Z"
                                        fill="#0B0C00"
                                    />
                                </svg>
                            </div>
                            <div className="dialog h-32 w-full text-center border-2 border-black rounded-b-lg pt-8 bg-linear-90 from-[#fcffaa_37.44%] to-[#f6ff00_97.12%]">
                                <h2 className="jersey-25">No vaults to be found here</h2>
                                <p className="hover:text-blue-600 hover:font-medium inline" onClick={()=>{return setIsVaultBoxOpen(true)}}>Click to get started</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === "error" && (
                                <div className="NoVaultParent w-full h-auto mt-34">
                                    <div className="NoVaultBox h-72 w-96 mx-auto">
                                        <div className="UpperBar pt-2 px-2 w-full h-14 flex items-center justify-end border-2 border-black bg-linear-90 from-[#fffbaa_24.52%] to-[#ffea00]">
                                            <svg
                                                width="35"
                                                height="43"
                                                viewBox="0 0 35 43"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M17.5 0.5C26.8757 0.5 34.5 8.32165 34.5 18C34.5 27.6784 26.8757 35.5 17.5 35.5C8.12434 35.5 0.5 27.6784 0.5 18C0.5 8.32165 8.12434 0.5 17.5 0.5Z"
                                                    fill="#F4FFAA"
                                                    stroke="#F4FFAA"
                                                />
                                                <path
                                                    d="M14.8746 27H10.3919L14.8609 19.046L10.5969 10.9827H15.9816L17.1843 14.003L17.7856 15.7387L18.4416 14.0303L19.7399 10.9827H24.2089L19.9586 18.2123L24.4003 27H19.0976L17.6216 23.31L17.1023 21.6427L16.4326 23.31L14.8746 27Z"
                                                    fill="#0B0C00"
                                                />
                                            </svg>
                                        </div>
                                        <div className="dialog h-32 w-full text-center border-2 border-black rounded-b-lg pt-8 bg-linear-90 from-[#fcffaa_37.44%] to-[#f6ff00_97.12%]">
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
            </DialogBox>
        
        </div>

        
        </>
    );
};

export default MainPage;
