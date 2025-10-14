import React, { useState } from "react";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmedPassword) {
            alert("Passwords do not match!");
            return;
        }

        const dataPayload = { username, email, password };

        try {
            const res = await fetch("http://localhost:3000/user/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataPayload),
            });

            if (res.ok) {
                window.location.href = "/sign-in";
            } else {
                alert("Sign-up failed. Try again!");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="form-parent my-0 xl:h-[650] w-[100%] mx-auto flex justify-center relative z-10 top-[-20px]">
            <form onSubmit={handleSignUp} className="form h-auto w-3/4 md:w-2/4 bg-[#f3f3f3] text-black flex flex-col rounded-[15px] relative p-0.5">
                <div className="form-heading w-3/4 h-8 mx-auto flex justify-center items-center mt-10">
                    {/* Logo SVG */}
                </div>

                <div className="fields flex flex-col gap-y-2.5 relative mt-10 mb-4 px-10">
                    <label className="text-xl">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-[#d9d9d9] border border-black rounded-[8px] h-[40px] px-1.5" required />

                    <label className="text-xl">E-mail</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#d9d9d9] border border-black rounded-[8px] h-[40px] px-1.5" required />

                    <label className="text-xl">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-[#d9d9d9] border border-black rounded-[8px] h-[40px] px-1.5" required />

                    <label className="text-xl">Confirm Password</label>
                    <input type="password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} className="bg-[#d9d9d9] border border-black rounded-[8px] h-[40px] px-1.5" required />

                    <p className="form-btn xl:h-[35px] xl:w-full mt-1 text-sm">
                        Already have an account? <a href="/sign-in" className="text-blue-600">Click here</a>
                    </p>
                </div>

                <div className="buttons flex justify-between items-center w-2/4 mx-auto mb-6 gap-x-2">
                    <button type="submit" className="p-2 form-btn xl:h-[35px] xl:w-[90px] bg-[#f5f5f5] border-2 border-black rounded-[8px]">Submit</button>
                    <button type="reset" className="p-2 form-btn xl:h-[35px] xl:w-[90px] bg-[#f5f5f5] border-2 border-black rounded-[8px]">Reset</button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
