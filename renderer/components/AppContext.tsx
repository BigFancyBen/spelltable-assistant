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
        <div>
          {!obs && <div>"Connecting To OBS"</div>}
          {!jsonData && <div>Loading Card Data...</div>}
        </div>
      )}
    </AppContext.Provider>
  );
};
