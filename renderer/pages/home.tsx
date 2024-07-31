import React, { useCallback, useState } from "react";
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
    if (!cardName) return;
    const newCards = cards.filter(
      (card) => matchCardName(card.name, cardName)
      // &&
      //   card.legalities.commander === "legal"
    );

    if (newCards) {
      setFilteredCards(newCards);
    }
  }, [cards, cardName]);

  const updateBrowserSourceURL = (newUrl, duration) => {
    if (obs) {
      const browserSourceSettings = {
        url: `http://localhost:8888/card?cardUrl=${newUrl ?? ""}&duration=${
          duration ?? 5
        }&salt=${Math.random()}`,
        width: 1920,
        height: 1080,
      };

      return obs.call("SetInputSettings", {
        inputName: "SPELLTABLE-ASSISTANT",
        inputSettings: browserSourceSettings,
      });
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-full min-w-[700px]">
      <Head>
        <title>Spelltable Assistant Dashboard</title>
      </Head>
      <h1 className="text-4xl text-center">Spelltable Assistant</h1>
      <div className="flex items-center justify-center my-4">
        <input
          className="border-2 border-gray-300 mr-4 px-4 py-2 rounded-full"
          type="text"
          value={cardName}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
          onClick={handleButtonClick}
        >
          Scryfall Search
        </button>
      </div>
      {filteredCards && filteredCards.length > 0 && (
        <>
          <hr className="my-4 border-b-2 border-gray-300 w-full" />
        </>
      )}
      <div className="grid grid-cols-4 gap-4 text-2xl w-full text-center bg-none">
        {filteredCards && filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <div
              className="col-span-1 w-full flex items-center justify-center flex-col bg-gray-200 rounded-lg p-4 drop-shadow-md"
              key={card.id}
            >
              {card.card_faces ? (
                <MDFC
                  card1={card.card_faces[0].image_uris.normal}
                  card2={card.card_faces[1].image_uris.normal}
                  updateBrowserSourceURL={updateBrowserSourceURL}
                />
              ) : (
                <>
                  <img
                    className="rounded-[5%] w-full"
                    src={card?.image_uris?.normal}
                  />

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
          <div className="col-span-8 text-center">
            {filteredCards && filteredCards.length === 0
              ? "No cards found"
              : ""}
          </div>
        )}
      </div>
    </div>
  );
}
