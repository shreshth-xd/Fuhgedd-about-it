import React from "react";
import "../../../public/css/output.css";

const Navbar = () =>{
    return(
        <div className="sm:flex justify-center p-0 m-0 w-[100%] max-w-[100%]">
        <nav className="w-[100%] sm:w-[90%] sm:shadow-[0px_4px_14px_0px_rgba(0,0,0,0.25)] md:h-[101px] lg:h-[101px] lg:w-[1253px] lg:max-w-[1253px] xl:h-[123px] xl:w-[1395px] xl:max-w-[1395px] sm:m-[19px] sm:py-[32px] sm:px-[39px] sm:border-4 sm:border-[#a6a6a6] sm:rounded-[36px] bg-[#fcff31] sm:bg-[#f2f2f2] flex sm:justify-between items-center">
        
            <div className="hamburger-section justify-start flex sm:hidden">
                <div className="hamburger-btn justify-self-center"><svg width="69" height="69" viewBox="0 0 69 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6701 22.0515H58.3299M10.6701 34.8556H58.3299M10.6701 47.6598H58.3299" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>

            <div className="My-vault hidden sm:block">
                <a href="#" className="text-black decoration-[none]">
                    <button className="navigation-button px-[36px] py-[13px] border-[#000000] rounded-[36px] text-[20px]">
                        My Vault
                    </button>
                </a>
            </div>

            <div className="sign-in-sign-up hidden sm:flex gap-x-[20px]">
                <a href="/learn" className="text-black decoration-[none]">
                    <button className="navigation-button px-[36px] py-[13px] border-[#000000] rounded-[36px] text-[20px]">
                        Learn
                    </button>
                </a>

                <a href="http://localhost:3000/sign-in" className="text-black decoration-[none]">
                    <button className="navigation-button px-[36px] py-[13px] border-[#000000] rounded-[36px] text-[20px]">
                        Sign In
                    </button>
                </a>
                
                <a href="http://localhost:3000/sign-up" className="text-black decoration-[none]">
                    <button className="navigation-button px-[36px] py-[13px] border-[#000000] rounded-[36px] text-[20px]">
                        Sign Up
                    </button>
                </a>
            </div>
        </nav>
    </div>
    );
}

export default Navbar;