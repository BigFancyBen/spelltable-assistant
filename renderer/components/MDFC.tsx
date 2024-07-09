import React, { useState } from "react";

export default function MDFC({ card1, card2 }) {
  const [frontFaceIsShowing, setFrontFaceIsShowing] = useState(true);
  console.log(card1, card2);
  return (
    <div className="relative w-full">
      {frontFaceIsShowing ? (
        <img
          className="rounded-[30px]"
          src={card1}
          alt="Card img"
          width={672}
          height={936}
          onClick={() => setFrontFaceIsShowing(false)}
        />
      ) : (
        <img
          className="rounded-[30px]"
          src={card2}
          alt="Card Image"
          width={672}
          height={936}
          onClick={() => setFrontFaceIsShowing(true)}
        />
      )}
      <img
        src="/images/flip.svg"
        className="absolute bottom-8 right-8 w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => setFrontFaceIsShowing(!frontFaceIsShowing)}
      />
    </div>
  );
}
