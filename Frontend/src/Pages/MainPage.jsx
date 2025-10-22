import {useState, useRef, useCallback, useMemo} from "react";
import "../../../public/css/output.css";
import "../Components/Home.css"


const MainPage = () =>{
    const [vaultBoxes, setVaultBoxes] = useState([]);
    const FetchedVaults = useMemo(()=>{
        fetch("/vault/getVaults", {credentials: "include"}).then((res)=>res.json()).then(
            (res)=>{
                if(res.ok){
                    return(
                        <div className="vaults">
                            <h1>Vaults will display here</h1>
                        </div>
                    )
                }else{
                    return(
                        <div className="NoVaultParent w-full mx-auto h-72">
                            <div className="NoVaultBox h-full w-96">
                                <div className="UpperBar pt-2 px-2 w-full h-14 flex items-center justify-end">
                                    <svg width="35" height="43" viewBox="0 0 35 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.5 0.5C26.8757 0.5 34.5 8.32165 34.5 18C34.5 27.6784 26.8757 35.5 17.5 35.5C8.12434 35.5 0.5 27.6784 0.5 18C0.5 8.32165 8.12434 0.5 17.5 0.5Z" fill="#F4FFAA" stroke="#F4FFAA"/>
                                    <path d="M14.8746 27H10.3919L14.8609 19.046L10.5969 10.9827H15.9816L17.1843 14.003L17.7856 15.7387L18.4416 14.0303L19.7399 10.9827H24.2089L19.9586 18.2123L24.4003 27H19.0976L17.6216 23.31L17.1023 21.6427L16.4326 23.31L14.8746 27Z" fill="#0B0C00"/>
                                    </svg>
                                </div>
                                <div className="dialog h-52 w-full text-center">
                                    <h2 className="jersey-25">No vaults to be found here</h2>
                                    <p>Click to get started</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            }
        ).catch((error)=>{
            console.log(error)
        })
        ,[vaultBoxes]
})
    
    return(
        <>
            <div className="ParentFlexBox bg-linear-258 from-[#FF8400] to-[#FFF8AA] w-screen h-screen flex flex-col">
                <div className="navBar jersey-25 bg-linear-270 from-[#FF8400] to-[#FFF8AA] mt-2 mx-auto w-11/12 px-12 py-3 flex items-center justify-between border-2 border-black rounded-3xl">
                    <div className="VaultsAndSettings h-full flex items-center gap-x-2">
                        <button className="px-7 py-3.5 rounded-2xl navbar-vault-btn border-2 border-black 
                        {if(window.location.href='/app'){
                            bg-[#ff8400]
                        }}
                        ">Vaults</button>
                        <button className="px-7 py-3.5 rounded-2xl navbar-settings-btn border-2 border-black">Settings</button>
                    </div>
                    <div className="Logout-btn h-full">
                        <button className="px-7 py-3.5 rounded-2xl border-2 border-black">Logout</button>
                    </div>
                </div>
                <div className="MainPanel w-full">
                    {vaultBoxes}
                </div>
            </div>
        </>
    );
}

export default MainPage;