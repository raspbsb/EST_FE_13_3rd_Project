import { createContext, useContext, useState, useRef } from "react";

const AiSummaryContext = createContext(null);

export function AiSummaryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);

  const openAndScroll = () => {
    setIsOpen(true);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AiSummaryContext.Provider value={{ isOpen, setIsOpen, sectionRef, openAndScroll }}>
      {children}
    </AiSummaryContext.Provider>
  );
}

export function useAiSummary() {
  return useContext(AiSummaryContext);
}
