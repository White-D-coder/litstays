'use client';

import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';

export type StayDates = { checkIn: string; checkOut: string };
const StayContext = createContext<{ dates: StayDates; setDates: Dispatch<SetStateAction<StayDates>> } | null>(null);

export function StayProvider({ children }: { children: ReactNode }) {
  const [dates, setDates] = useState<StayDates>({ checkIn: '', checkOut: '' });
  return <StayContext.Provider value={{ dates, setDates }}>{children}</StayContext.Provider>;
}

export function useStay() {
  const context = useContext(StayContext);
  if (!context) throw new Error('StayProvider is required');
  return context;
}
