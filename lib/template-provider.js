"use client";

import { createContext, useState } from "react";

export const TemplateContext = createContext();

export function TemplateProvider({ children }) {
  const [latestComponents, setLatestComponents] = useState([]);

  return (
    <TemplateContext.Provider value={{ latestComponents, setLatestComponents }}>
      {children}
    </TemplateContext.Provider>
  );
}
