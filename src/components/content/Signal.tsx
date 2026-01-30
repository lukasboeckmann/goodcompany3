import React from 'react';

export default function Signal() {
    return (
        <div className="pointer-events-auto w-full max-w-[400px] flex flex-col gap-[30px] font-mono text-[#ececec]">
            <div className="text-[10px] opacity-50 tracking-[0.2em]">
                SIGNAL STATUS: ACTIVE
            </div>

            <div className="flex flex-col gap-[25px]">
                <div className="flex flex-col gap-[10px]">
                    <label className="text-[12px] tracking-[0.1em]">SOURCE_ID:</label>
                    <input
                        type="email"
                        placeholder="[ YOUR MAIL ]"
                        className="bg-transparent border-none border-b border-[#ececec] text-[#ececec] py-[5px] outline-none font-mono text-[14px]"
                    />
                </div>
                <div className="flex flex-col gap-[10px]">
                    <label className="text-[12px] tracking-[0.1em]">ENCODE_MSG:</label>
                    <input
                        type="text"
                        placeholder="[ YOUR MESSAGE ]"
                        className="bg-transparent border-none border-b border-[#ececec] text-[#ececec] py-[5px] outline-none font-mono text-[14px] placeholder:text-[#888]"
                    />
                </div>
                <button
                    className="mt-[20px] bg-transparent border border-[#ececec] p-[15px] text-[#ececec] cursor-pointer font-mono text-[12px] tracking-[0.2em] uppercase transition-all duration-200 hover:bg-[#ececec] hover:text-[#0c0c0c]"
                >
                    [ SEND SIGNAL ]
                </button>
            </div>

            <div className="mt-auto text-center opacity-30">
                <a href="mailto:hello@goodcompany.com" className="text-[#ececec] no-underline text-[10px]">hello@goodcompany.com</a>
            </div>
        </div>
    );
}
