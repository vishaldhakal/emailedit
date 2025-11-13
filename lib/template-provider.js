"use client";

import { createContext, useState } from "react";
import { Header } from "@/components/Header";

export const TemplateContext = createContext();

export function TemplateProvider({ children }) {
  const [latestComponents, setLatestComponents] = useState([]);

  return (
    <TemplateContext.Provider value={{ latestComponents, setLatestComponents }}>
      <Header />
      {children}
    </TemplateContext.Provider>
  );
}
