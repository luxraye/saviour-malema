import { createContext, useCallback, useContext, useState } from "react";

const DonationContext = createContext(null);

export function DonationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [prefillAmount, setPrefillAmount] = useState(250);

  const openDonation = useCallback((amount = 250) => {
    setPrefillAmount(amount);
    setOpen(true);
  }, []);

  const closeDonation = useCallback(() => setOpen(false), []);

  return (
    <DonationContext.Provider value={{ open, prefillAmount, openDonation, closeDonation }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonationModal() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonationModal must be used within DonationProvider");
  return ctx;
}
