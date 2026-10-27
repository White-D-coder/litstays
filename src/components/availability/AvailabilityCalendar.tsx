'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { addDays, dateInZone, isUnavailable, nightsBetween, stayError, type AvailabilityData } from '@/lib/availability-rules';
import { fetchAvailability } from '@/lib/availability-client';
import { useStay } from './StayProvider';
import { Arrow } from '../ui/Icons';

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const weekdayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
function shiftMonth(month: string, amount: number) {
  const date = new Date(`${month}-01T12:00:00Z`); date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 7);
}
function monthLabel(month: string) { return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T12:00:00Z`)); }
function dayLabel(date: string) { return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)); }
function shortDate(date: string) { return date ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)) : 'Choose a date'; }
function monthCells(month: string) {
  const date = new Date(`${month}-01T12:00:00Z`);
  const offset = (date.getUTCDay() + 6) % 7;
  const length = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).getUTCDate();
  return Array.from({ length: Math.ceil((offset + length) / 7) * 7 }, (_, i) => i < offset || i >= offset + length ? null : `${month}-${String(i - offset + 1).padStart(2, '0')}`);
}

export default function AvailabilityCalendar() {
  const { dates, setDates } = useStay();
  const [month, setMonth] = useState(() => dateInZone(Date.now(), 'Asia/Kolkata').slice(0, 7));
  const [twoMonths, setTwoMonths] = useState(() => window.matchMedia('(min-width: 1050px)').matches);
  const [data, setData] = useState<AvailabilityData | null>(null);
  const [requestPhase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [notice, setNotice] = useState('Choose a check-in date, then a check-out date.');
  const [focused, setFocused] = useState(() => dateInZone(Date.now(), 'Asia/Kolkata'));
  const container = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const requestGeneration = useRef(0);
  const today = dateInZone(Date.now(), data?.timeZone || 'Asia/Kolkata');
  const firstVisible = `${month}-01`;
  const lastVisible = `${shiftMonth(month, twoMonths ? 2 : 1)}-01`;
  const from = dates.checkIn && dates.checkIn < firstVisible ? dates.checkIn : firstVisible;
  const to = dates.checkOut && dates.checkOut >= lastVisible ? addDays(dates.checkOut, 1) : lastVisible;
  const phase = requestPhase === 'ready' && (data?.range.from !== from || data?.range.to !== to) ? 'loading' : requestPhase;
  const load = useCallback((signal?: AbortSignal) => {
    const generation = ++requestGeneration.current;
    return fetchAvailability(from, to, { signal }).then(response => {
      if (signal?.aborted || generation !== requestGeneration.current) return;
      setData(response); setPhase('ready');
    }).catch(() => {
      if (signal?.aborted || generation !== requestGeneration.current) return;
      setData(null); setPhase('error');
    });
  }, [from, to]);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1050px)');
    const onChange = () => setTwoMonths(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);
  useEffect(() => {
    const interval = setInterval(() => { setPhase('loading'); void load(); }, Math.max(15, data?.refreshAfterSeconds || 60) * 1000);
    return () => clearInterval(interval);
  }, [data?.refreshAfterSeconds, load]);
  useEffect(() => {
    if (phase === 'ready' && pendingFocus.current) {
      container.current?.querySelector<HTMLButtonElement>(`[data-day="${pendingFocus.current}"]`)?.focus();
      pendingFocus.current = null;
    }
  }, [phase]);

  function canChoose(day: string) {
    if (phase !== 'ready' || !data || day < today || day < data.range.from || day >= data.range.to) return false;
    if (dates.checkIn && !dates.checkOut && day > dates.checkIn) return !stayError(dates.checkIn, day, data.unavailable, data.minStayNights);
    if (day === dates.checkOut && dates.checkIn && !stayError(dates.checkIn, day, data.unavailable, data.minStayNights)) return true;
    return !isUnavailable(day, data.unavailable);
  }
  function choose(day: string) {
    if (!data || !canChoose(day)) return;
    setFocused(day);
    if (dates.checkIn && dates.checkOut && day === dates.checkOut && isUnavailable(day, data.unavailable)) return;
    if (!dates.checkIn || dates.checkOut || day <= dates.checkIn) {
      setDates({ checkIn: day, checkOut: '' }); setNotice('Now choose your check-out date.');
    } else {
      const error = stayError(dates.checkIn, day, data.unavailable, data.minStayNights);
      if (error) { setNotice(error); return; }
      setDates({ checkIn: dates.checkIn, checkOut: day }); setNotice(`${nightsBetween(dates.checkIn, day)} nights selected. Continue below to make an enquiry.`);
    }
  }
  function navigate(amount: number) { setPhase('loading'); setMonth(current => shiftMonth(current, amount)); }
  function onKey(event: KeyboardEvent<HTMLButtonElement>, date: string) {
    const changes: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    let target: string | undefined;
    if (event.key in changes) target = addDays(date, changes[event.key]);
    if (event.key === 'Home' || event.key === 'End') {
      const offset = (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
      target = addDays(date, event.key === 'Home' ? -offset : 6 - offset);
    }
    if (event.key === 'PageUp' || event.key === 'PageDown') target = `${shiftMonth(date.slice(0, 7), event.key === 'PageUp' ? -1 : 1)}-01`;
    if (!target) return;
    event.preventDefault();
    if (target < today || target.slice(0, 7) > shiftMonth(today.slice(0, 7), 24)) return;
    if (target < firstVisible || target >= lastVisible || event.key.startsWith('Page')) {
      pendingFocus.current = target; setFocused(target); setPhase('loading'); setMonth(target.slice(0, 7)); return;
    }
    const direction = (changes[event.key] || 1) < 0 ? -1 : 1;
    for (let i = 0; i < 62 && target >= firstVisible && target < lastVisible; i++, target = addDays(target, direction)) {
      const button = container.current?.querySelector<HTMLButtonElement>(`[data-day="${target}"]`);
      if (button && !button.disabled) { setFocused(target); button.focus(); return; }
    }
  }
  const months = twoMonths ? [month, shiftMonth(month, 1)] : [month];
  const visibleDays = months.flatMap(value => monthCells(value)).filter((value): value is string => value !== null);
  const tabStop = visibleDays.includes(focused) && canChoose(focused) ? focused : visibleDays.find(canChoose);
  const selectedError = dates.checkIn && dates.checkOut && data ? stayError(dates.checkIn, dates.checkOut, data.unavailable, data.minStayNights) : null;
  return <div className="availability-calendar" ref={container} aria-busy={phase === 'loading'}>
    <div className="calendar-top"><span className={`calendar-source ${data?.status === 'demo' ? 'is-demo' : ''}`}><span/>{data?.status === 'demo' ? 'SAMPLE AVAILABILITY' : 'YOUR DATES, AT A GLANCE'}</span><div className="calendar-month-nav"><button aria-label="Previous month" disabled={month <= today.slice(0, 7)} onClick={() => navigate(-1)}><Arrow className="arrow-back"/></button><button aria-label="Next month" disabled={month >= shiftMonth(today.slice(0, 7), 24)} onClick={() => navigate(1)}><Arrow/></button></div></div>
    {phase === 'error' && <div className="calendar-error" role="alert"><p>We can’t check dates right now. Availability is unknown.</p><button className="text-link dark-link" onClick={() => { setPhase('loading'); void load(); }}>Try again <Arrow/></button></div>}
    <div className={`calendar-months ${phase === 'loading' ? 'is-loading' : ''}`}>
      {months.map((value, index) => {
        const cells = monthCells(value);
        return <div className={`calendar-month ${index === 1 ? 'calendar-month-second' : ''}`} key={value}>
          <h3 id={`month-${value}`}>{monthLabel(value)}</h3>
          <div role="grid" aria-labelledby={`month-${value}`} aria-multiselectable="true">
            <div className="calendar-week" role="row">{weekdays.map((name, i) => <span role="columnheader" aria-label={weekdayNames[i]} key={i}>{name}</span>)}</div>
            {Array.from({ length: cells.length / 7 }, (_, week) => <div className="calendar-week" role="row" key={week}>{cells.slice(week * 7, week * 7 + 7).map((day, i) => {
              if (!day) return <span role="gridcell" key={`empty-${i}`}/>;
              const busy = data ? isUnavailable(day, data.unavailable) : false;
              const first = day === dates.checkIn;
              const last = day === dates.checkOut;
              const middle = !!dates.checkIn && !!dates.checkOut && day > dates.checkIn && day < dates.checkOut;
              const enabled = canChoose(day);
              const boundary = busy && enabled;
              const state = first ? 'Selected check-in' : last ? 'Selected check-out' : boundary ? 'Check-out only; night unavailable' : phase !== 'ready' ? 'Availability unknown' : busy ? 'Unavailable night' : !enabled && day >= today ? 'Cannot check out across unavailable nights' : day < today ? 'Past date' : 'Available';
              return <span role="gridcell" aria-selected={first || last || middle} key={day} className={`${middle ? 'in-range' : ''} ${first ? 'range-start' : ''} ${last ? 'range-end' : ''}`}><button className={`calendar-day ${busy ? 'is-unavailable' : ''} ${first || last ? 'is-selected' : ''} ${boundary ? 'checkout-boundary' : ''} ${day === today ? 'is-today' : ''}`} data-day={day} aria-label={`${dayLabel(day)}, ${state}`} aria-current={day === today ? 'date' : undefined} disabled={!enabled} tabIndex={day === tabStop ? 0 : -1} onClick={() => choose(day)} onKeyDown={event => onKey(event, day)}>{Number(day.slice(-2))}</button></span>;
            })}</div>)}
          </div>
        </div>;
      })}
    </div>
    <div className="calendar-legend" aria-label="Calendar legend"><span><i className="legend-available"/>Available</span><span><i className="legend-unavailable"/>Unavailable night</span><span><i className="legend-selected"/>Your dates</span></div>
    <div className="calendar-selection"><div><span>CHECK-IN</span><strong>{shortDate(dates.checkIn)}</strong></div><Arrow/><div><span>CHECK-OUT</span><strong>{shortDate(dates.checkOut)}</strong></div>{(dates.checkIn || dates.checkOut) && <button className="calendar-clear" onClick={() => { setDates({ checkIn: '', checkOut: '' }); setNotice('Choose a check-in date, then a check-out date.'); }}>Clear</button>}</div>
    <p className="calendar-status" role="status">{phase === 'loading' ? 'Checking dates…' : phase === 'error' ? 'Please retry, or contact your host directly.' : selectedError || notice}</p>
    {dates.checkIn && dates.checkOut && phase === 'ready' && !selectedError && <a className="button button-green calendar-continue" href="#enquire">Plan this stay <span>{nightsBetween(dates.checkIn, dates.checkOut)} nights</span><Arrow diagonal/></a>}
    {data && phase === 'ready' && <p className="calendar-freshness">{data.status === 'demo' ? 'Preview only. These dates do not reflect real bookings.' : `Refreshes every ${data.refreshAfterSeconds} seconds. Dates remain subject to confirmation.`}{data.minStayNights > 0 ? ` Minimum stay: ${data.minStayNights} nights.` : ''}</p>}
  </div>;
}
