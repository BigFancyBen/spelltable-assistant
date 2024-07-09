import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function NextPage() {
  const router = useRouter();
  const cardSrc = router.query.cardUrl as string;
  const duration = router.query.duration as string;
  const [cardUrl, setCardUrl] = useState("");
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setCardUrl(cardSrc);
    setShowCard(true);
  }, []);

  useEffect(() => {
    setCardUrl(cardSrc);
  }, [cardSrc]);

  useEffect(() => {
    let timer;
    if (showCard) {
      timer = setTimeout(() => {
        setShowCard(false);
        setCardUrl("");
      }, parseInt(duration));
    }
    return () => clearTimeout(timer);
  }, [showCard]);

  return (
    <div className="flex justify-center items-center h-full">
      {cardUrl && (
        <Image
          className="rounded-[5%]"
          src={cardUrl}
          alt="Card Image"
          width={672}
          height={936}
          onLoad={() => setShowCard(true)}
        />
      )}
    </div>
  );
}
