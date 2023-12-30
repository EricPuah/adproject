// BusContext.js
import React, { createContext, useContext, useState } from 'react';

const BusContext = createContext();

export const BusProvider = ({ children }) => {
  const [selectedBus, setSelectedBus] = useState(null);

  return (
    <BusContext.Provider value={{ selectedBus, setSelectedBus }}>
      {children}
    </BusContext.Provider>
  );
};

export const useBusContext = () => {
  return useContext(BusContext);
};
