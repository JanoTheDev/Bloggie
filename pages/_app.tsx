import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { config } from "dotenv";
import axios from "axios";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
