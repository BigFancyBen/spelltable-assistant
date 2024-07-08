import React, { createContext, useContext, useEffect, useState } from "react";
import OBSWebSocket from "obs-websocket-js";

// Define types for context and provider props
type OBSContextType = {
  obs: OBSWebSocket | null;
};

type OBSProviderProps = {
  children: React.ReactNode;
};

// Create context with initial state
const OBSContext = createContext<OBSContextType>({ obs: null });

// Custom hook to use OBS context
export const useOBS = () => useContext(OBSContext);

// OBS Provider component
export const OBSProvider: React.FC<OBSProviderProps> = ({ children }) => {
  const [obs, setObs] = useState<OBSWebSocket | null>(null);

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

  return (
    <OBSContext.Provider value={{ obs }}>
      {obs ? children : <div>Connecting to OBS...</div>}
    </OBSContext.Provider>
  );
};
