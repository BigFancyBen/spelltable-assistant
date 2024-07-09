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
  const [cardName, setCardName] = useState("");
  const [filteredCards, setFilteredCards] = useState(undefined);

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

  useEffect(() => {
    // updateBrowserSourceURL();
  }, [filteredCards]);

  const updateBrowserSourceURL = (newUrl, duration) => {
    if (obs) {
      const sourceName = "SPELLTABLE-ASSISTANT";
      const browserSourceSettings = {
        url: `http://localhost:8888/card?cardUrl=${newUrl ?? ""}&duration=${
          duration ?? 5
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
                  cardName={card.name}
                  card1={card.card_faces[0].image_uris.normal}
                  card2={card.card_faces[1].image_uris.normal}
                  updateBrowserSourceURL={updateBrowserSourceURL}
                />
              ) : (
                <>
                  <img
                    className="rounded-[30px] w-full"
                    src={card?.image_uris?.normal}
                  />
                  <span className="truncate text-xs mt-1">{card?.name}</span>
                  <div>
                    <button
                      className="bg-gray-300 rounded-lg px-2 py-1 mx-1 text-sm cursor-pointer hover:bg-gray-400 transition-colors duration-300"
                      onClick={() =>
                        updateBrowserSourceURL(card?.image_uris?.large, 5000)
                      }
                    >
                      5s
                    </button>
                    <button
                      className="bg-gray-300 rounded-lg px-2 py-1 mx-1 text-sm cursor-pointer hover:bg-gray-400 transition-colors duration-300"
                      onClick={() =>
                        updateBrowserSourceURL(card?.image_uris?.large, 10000)
                      }
                    >
                      10s
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div>No cards found</div>
        )}
      </div>
    </>
  );
}
