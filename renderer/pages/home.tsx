import React, { use, useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { AppProvider, useAppContext } from "../components/AppContext";
import MDFC from "../components/MDFC";

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
  const [filteredCards, setFilteredCards] = useState(undefined);
  //useCallback to handle the input change

  const handleInputChange = useCallback((event) => {
    setCardName(event.target.value);
  }, []);

  const handleButtonClick = useCallback(() => {
    const newCards = cards.filter(
      (card) =>
        matchCardName(card.name, cardName) &&
        card.legalities.commander === "legal"
    );
    console.log(newCards);

    if (newCards) {
      setFilteredCards(newCards);
    }
  }, [cards, cardName]);

  //useEffect to update the browser source URL
  useEffect(() => {
    updateBrowserSourceURL();
  }, [filteredCards]);

  const updateBrowserSourceURL = () => {
    if (obs) {
      const sourceName = "SPELLTABLE-ASSISTANT";
      const browserSourceSettings = {
        url: `http://localhost:8888/card?cardUrl=${
          filteredCards?.image_uris?.large ?? ""
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

  return (
    <>
      <Head>
        <title>Spelltable Assistant Dashboard</title>
      </Head>
      <input type="text" value={cardName} onChange={handleInputChange} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleButtonClick}
      />
      <div className="grid grid-cols-8 gap-4 text-2xl w-full text-center bg-none">
        {filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div
              className="col-span-1 w-full flex items-center justify-center flex-col"
              key={card.id}
            >
              {card.card_faces ? (
                <MDFC
                  card1={card.card_faces[0].image_uris.small}
                  card2={card.card_faces[1].image_uris.small}
                />
              ) : (
                <img
                  className="rounded-[30px] w-full"
                  src={card?.image_uris?.small}
                />
              )}
              <span className="truncate text-xs mt-1">{card?.name}</span>
            </div>
          ))
        ) : (
          <div>No cards found</div>
        )}
      </div>
    </>
  );
}
