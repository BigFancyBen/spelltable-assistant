import React, { use, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { AppProvider, useAppContext } from "../components/AppContext";

export function matchCardName(cardName, query) {
  const sanitizedQuery = query.replace("%20", " ");
  return cardName.toLowerCase().includes(sanitizedQuery.toLowerCase());
}

export default function Home() {
  return (
    <AppProvider>
      <HomePageContent />
    </AppProvider>
  );
}

export function HomePageContent() {
  const { obs, cards } = useAppContext();
  // const resculpt = cards.find((card) => card.name === "Resculpt");
  //state for a text input for card name
  const [cardName, setCardName] = useState("");
  //state for the card object
  const [card, setCard] = useState(undefined);
  //useCallback to handle the input change

  const handleInputChange = useCallback((event) => {
    setCardName(event.target.value);
  }, []);

  const handleButtonClick = useCallback(() => {
    const newCard = cards.find((card) => matchCardName(card.name, cardName));
    if (newCard) {
      setCard(newCard);
    }
  }, [cards, cardName]);

  //useEffect to update the browser source URL
  useEffect(() => {
    updateBrowserSourceURL();
  }, [card]);

  const updateBrowserSourceURL = () => {
    if (obs) {
      const sourceName = "SPELLTABLE-ASSISTANT";
      const browserSourceSettings = {
        url: `http://localhost:8888/card?cardUrl=${
          card?.image_uris?.large ?? ""
        }`,
        width: 1920,
        height: 1080,
      };

      // Create the browser source input
      return obs.call("SetInputSettings", {
        inputName: sourceName,
        inputSettings: browserSourceSettings,
      });
    }
  };

  console.log(obs, cards);

  return (
    <>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center bg-none">
        {card && (
          <>
            <img src={card?.image_uris?.normal} alt={card?.name} />
            <span>{card?.name}</span>
          </>
        )}
        <input type="text" value={cardName} onChange={handleInputChange} />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleButtonClick}
        />
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link
          href={`http://localhost:8888/card?cardUrl=${
            card?.image_uris?.large ?? ""
          }`}
        >
          Go to page
        </Link>
      </div>
    </>
  );
}
