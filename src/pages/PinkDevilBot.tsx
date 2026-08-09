import React from 'react';

export const PinkDevilBot = ({ isThinking }: { isThinking: boolean }) => {
  return (
    <div className={`relative w-20 h-20 bg-pink-400 rounded-3xl border-4 border-[#0A0A0A] shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] flex flex-col items-center justify-center mx-auto z-10 ${!isThinking ? 'animate-[bounce_3s_infinite]' : ''}`}>
      {/* Left Horn */}
      <div className="absolute -top-4 left-3 w-4 h-6 bg-pink-400 border-4 border-[#0A0A0A] rounded-t-xl -z-10 -rotate-12"></div>
      
      {/* Right Horn */}
      <div className="absolute -top-4 right-3 w-4 h-6 bg-pink-400 border-4 border-[#0A0A0A] rounded-t-xl -z-10 rotate-12"></div>

      {/* Eyes */}
      <div className="flex gap-2 mt-2">
        <div className="w-6 h-6 bg-white border-4 border-[#0A0A0A] rounded-full relative flex items-center justify-center overflow-hidden">
          {/* Pupil */}
          <div 
            className={`w-2.5 h-2.5 bg-[#0A0A0A] rounded-full absolute ${isThinking ? 'animate-[spin_1s_linear_infinite]' : ''}`} 
            style={isThinking ? { transformOrigin: '4px 6px' } : {}}
          ></div>
        </div>
        <div className="w-6 h-6 bg-white border-4 border-[#0A0A0A] rounded-full relative flex items-center justify-center overflow-hidden">
          {/* Pupil */}
          <div 
            className={`w-2.5 h-2.5 bg-[#0A0A0A] rounded-full absolute ${isThinking ? 'animate-[spin_1s_linear_infinite]' : ''}`} 
            style={isThinking ? { transformOrigin: '4px 6px' } : {}}
          ></div>
        </div>
      </div>
      
      {/* Mouth */}
      <div className={`mt-2 w-5 h-1.5 bg-[#0A0A0A] rounded-full transition-all duration-300 ${isThinking ? 'scale-y-[2] rounded-md w-4' : ''}`}></div>
    </div>
  );
};
