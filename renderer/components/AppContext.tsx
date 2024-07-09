import React, { createContext, useContext, useEffect, useState } from "react";
import OBSWebSocket from "obs-websocket-js";

// Define types for context and provider props
type AppContextType = {
  obs: OBSWebSocket | null;
  cards: any | null;
};

type AppProviderProps = {
  children: React.ReactNode;
};

// Create context with initial state
const AppContext = createContext<AppContextType>({ obs: null, cards: null });

// Custom hook to use OBS context
export const useAppContext = () => useContext(AppContext);

// OBS Provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [obs, setObs] = useState<OBSWebSocket | null>(null);
  const [jsonData, setJsonData] = useState<any>(null);
  useEffect(() => {
    const obsInstance = new OBSWebSocket();
    obsInstance
      .connect("ws://127.0.0.1:4455", "hldwdq9CYsb4wCW8")
      .then(() => {
        console.log("Connected to OBS WebSocket");
        setObs(obsInstance);
        obsInstance.call("GetCurrentProgramScene").then((data) => {
          // if no browser source create one
          obsInstance
            .call("CreateInput", {
              sceneName: data.currentProgramSceneName,
              inputName: "SPELLTABLE-ASSISTANT",
              inputKind: "browser_source",
              inputSettings: {
                url: `http://localhost:8888/card`,
                width: 1920,
                height: 1080,
              },
            })
            .catch((error) => {
              //expected to happen if browser source already exists
            });
        });
      })
      .catch((error) => {
        console.log("Failed to connect to OBS WebSocket", error);
      });

    // Clean-up on unmount
    return () => {
      if (obsInstance) {
        obsInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/scryfall/cards.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ obs, cards: jsonData }}>
      {obs && jsonData ? (
        children
      ) : (
        <div className="flex w-full flex-col h-[50vh] justify-center items-center">
          {!obs && <div>Connecting To OBS...</div>}
          {!jsonData && <div>Loading Card Data...</div>}
        </div>
      )}
    </AppContext.Provider>
  );
};
