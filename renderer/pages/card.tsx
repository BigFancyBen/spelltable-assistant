import React, { use, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "../components/AppContext";
import { useRouter } from "next/router";
import { matchCardName } from "./home";

export default function NextPage() {
  const cardSrc = useRouter().query.cardUrl as string;
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="flex justify-center items-center h-full">
      {!showCard && <>Loading Card</>}
      <Image
        className="rounded-[30px]"
        src={cardSrc}
        alt="Card Image"
        width={672}
        height={936}
        onLoadingComplete={() => setShowCard(true)}
      />
    </div>
  );
}
