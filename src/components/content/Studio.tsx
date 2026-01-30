import React, { useState } from 'react';

export default function Studio({ activeStudioInstance, setActiveStudioInstance, instanceId, isZoomedOut }: any) {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
            <div
                className={`relative border bg-black overflow-hidden transition-colors duration-300 ${activeStudioInstance === instanceId ? 'border-[#333]' : 'border-[#1a1a1a]'}`}
                style={{
                    width: '95%',
                    maxWidth: '800px', // Mobile logic handled by container width usually
                    aspectRatio: '16/9'
                }}
                onMouseEnter={(e) => {
                    if (activeStudioInstance !== instanceId) e.currentTarget.style.borderColor = '#333';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#1a1a1a';
                }}
            >
                {isZoomedOut ? (
                    <div className="w-full h-full relative">
                        <img
                            src="https://img.youtube.com/vi/6zMS8ZRzQ1o/maxresdefault.jpg"
                            alt="Studio Session"
                            className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[50px] h-[50px] rounded-full border-2 border-[#ececec] flex items-center justify-center">
                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[16px] border-l-[#ececec] ml-[4px]" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <iframe
                            width="100%" height="100%"
                            src={`https://www.youtube.com/embed/6zMS8ZRzQ1o?controls=0&rel=0&modestbranding=1${activeStudioInstance === instanceId ? '&autoplay=1' : ''}`}
                            title="Studio Session"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={`w-full h-full transition-all duration-500 ${activeStudioInstance === instanceId ? 'filter-none opacity-100 pointer-events-auto' : 'brightness-90 opacity-70 pointer-events-none'}`}
                        ></iframe>

                        {/* OVERLAY */}
                        {activeStudioInstance !== instanceId && (
                            <div
                                onClick={() => setActiveStudioInstance(instanceId)}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
                            >
                                <span className="font-mono text-[12px] tracking-[0.1em] text-[#ececec] bg-black/60 px-[10px] py-[5px] border border-[#333]">
                                    [ PLAY_STUDIO_SESSION ]
                                </span>
                            </div>
                        )}

                        {/* STOP BUTTON */}
                        {activeStudioInstance === instanceId && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveStudioInstance(null); }}
                                className="absolute top-[20px] right-[20px] bg-black/80 text-[#ececec] border border-[#333] font-mono text-[10px] px-[10px] py-[5px] cursor-pointer z-20 tracking-[0.1em]"
                            >
                                [ STOP_SESSION ]
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-[20px] w-[95%] max-w-[800px] flex justify-between font-mono text-[10px] color-[#555] transition-opacity duration-500" style={{ opacity: activeStudioInstance === instanceId ? 0.3 : 1 }}>
                <span>REC_DATE: 2024_SESSION_04</span>
                <span className="block">LOCATION: STUDIO_HIDDEN</span>
                <span>FORMAT: 4K_RAW_GRAIN</span>
            </div>
        </div>
    );
}
