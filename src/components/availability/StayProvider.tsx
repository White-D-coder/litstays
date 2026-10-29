'use client';

import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';

export type StayDates = { checkIn: string; checkOut: string };
const StayContext = createContext<{ dates: StayDates; setDates: Dispatch<SetStateAction<StayDates>>; guests: string; setGuests: Dispatch<SetStateAction<string>> } | null>(null);

export function StayProvider({ children }: { children: ReactNode }) {
  const [dates, setDates] = useState<StayDates>({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState('');
  return <StayContext.Provider value={{ dates, setDates, guests, setGuests }}>{children}</StayContext.Provider>;
}

export function useStay() {
  const context = useContext(StayContext);
  if (!context) throw new Error('StayProvider is required');
  return context;
}
