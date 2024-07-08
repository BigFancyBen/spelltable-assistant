import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import { OBSProvider } from "../components/OBSContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <OBSProvider>
      <Component {...pageProps} />
    </OBSProvider>
  );
}

export default MyApp;
