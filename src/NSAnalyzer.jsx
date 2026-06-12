import { useState, useMemo, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const SUBSCRIPTIONS = [
  {
    id: "none",
    name: "No Subscription",
    monthlyCost: 0,
    peakDiscount: 0,
    offPeakDiscount: 0,
    weekendFree: false,
    offPeakFree: false,
    allFree: false,
    color: "#94a3b8",
    description: "Pay full price for every trip",
  },
  {
    id: "dal-voordeel",
    name: "Dal Voordeel",
    monthlyCost: 6.35,
    peakDiscount: 0,
    offPeakDiscount: 0.4,
    weekendFree: false,
    offPeakFree: false,
    allFree: false,
    color: "#38bdf8",
    description: "40% off-peak discount",
  },
  {
    id: "altijd-voordeel",
    name: "Altijd Voordeel",
    monthlyCost: 26.0,
    peakDiscount: 0.2,
    offPeakDiscount: 0.4,
    weekendFree: false,
    offPeakFree: false,
    allFree: false,
    color: "#818cf8",
    description: "20% peak + 40% off-peak discount",
  },
  {
    id: "weekend-vrij",
    name: "Weekend Vrij",
    monthlyCost: 39.5,
    peakDiscount: 0,
    offPeakDiscount: 0,
    weekendFree: true,
    offPeakFree: false,
    allFree: false,
    color: "#f472b6",
    description: "Unlimited weekend travel",
  },
  {
    id: "dal-vrij",
    name: "Dal Vrij",
    monthlyCost: 127.95,
    peakDiscount: 0,
    offPeakDiscount: 0,
    weekendFree: false,
    offPeakFree: true,
    allFree: false,
    color: "#34d399",
    description: "Unlimited off-peak travel",
  },
  {
    id: "altijd-vrij",
    name: "Altijd Vrij",
    monthlyCost: 369.0,
    peakDiscount: 0,
    offPeakDiscount: 0,
    weekendFree: false,
    offPeakFree: false,
    allFree: true,
    color: "#fbbf24",
    description: "Unlimited travel anytime",
  },
  {
    id: "traject-vrij",
    name: "Traject Vrij",
    monthlyCost: 0,
    peakDiscount: 0,
    offPeakDiscount: 0.4,
    weekendFree: false,
    offPeakFree: false,
    allFree: false,
    trajectFree: true,
    color: "#fb923c",
    description: "Unlimited on your route, 40% off-peak elsewhere",
  },
];

const DEMO_TRIPS = [
  { date: "2025-01-06", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:15", checkout: "09:30", price: 17.4, cls: 2 },
  { date: "2025-01-06", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:45", checkout: "19:00", price: 17.4, cls: 2 },
  { date: "2025-01-07", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:30", checkout: "09:45", price: 17.4, cls: 2 },
  { date: "2025-01-07", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:10", checkout: "19:25", price: 17.4, cls: 2 },
  { date: "2025-01-08", from: "Rotterdam Centraal", to: "Den Haag Centraal", checkin: "10:00", checkout: "10:25", price: 5.9, cls: 2 },
  { date: "2025-01-08", from: "Den Haag Centraal", to: "Rotterdam Centraal", checkin: "14:30", checkout: "14:55", price: 5.9, cls: 2 },
  { date: "2025-01-09", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "07:50", checkout: "09:05", price: 17.4, cls: 2 },
  { date: "2025-01-09", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:30", checkout: "18:45", price: 17.4, cls: 2 },
  { date: "2025-01-10", from: "Rotterdam Centraal", to: "Utrecht Centraal", checkin: "09:30", checkout: "10:10", price: 12.1, cls: 2 },
  { date: "2025-01-10", from: "Utrecht Centraal", to: "Rotterdam Centraal", checkin: "15:00", checkout: "15:40", price: 12.1, cls: 2 },
  { date: "2025-01-11", from: "Rotterdam Centraal", to: "Breda", checkin: "11:00", checkout: "11:35", price: 10.5, cls: 2 },
  { date: "2025-01-11", from: "Breda", to: "Rotterdam Centraal", checkin: "16:00", checkout: "16:35", price: 10.5, cls: 2 },
  { date: "2025-01-13", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:00", checkout: "09:15", price: 17.4, cls: 2 },
  { date: "2025-01-13", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:00", checkout: "19:15", price: 17.4, cls: 2 },
  { date: "2025-01-14", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:20", checkout: "09:35", price: 17.4, cls: 2 },
  { date: "2025-01-14", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:50", checkout: "19:05", price: 17.4, cls: 2 },
  { date: "2025-01-15", from: "Rotterdam Centraal", to: "Den Haag Centraal", checkin: "12:00", checkout: "12:25", price: 5.9, cls: 2 },
  { date: "2025-01-15", from: "Den Haag Centraal", to: "Rotterdam Centraal", checkin: "16:45", checkout: "17:10", price: 5.9, cls: 2 },
  { date: "2025-01-16", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:10", checkout: "09:25", price: 17.4, cls: 2 },
  { date: "2025-01-16", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:30", checkout: "19:45", price: 17.4, cls: 2 },
  { date: "2025-01-17", from: "Rotterdam Centraal", to: "Eindhoven Centraal", checkin: "09:45", checkout: "10:55", price: 21.3, cls: 2 },
  { date: "2025-01-17", from: "Eindhoven Centraal", to: "Rotterdam Centraal", checkin: "16:00", checkout: "17:10", price: 21.3, cls: 2 },
  { date: "2025-01-18", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "10:30", checkout: "11:45", price: 17.4, cls: 2 },
  { date: "2025-01-18", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:00", checkout: "19:15", price: 17.4, cls: 2 },
  { date: "2025-01-19", from: "Rotterdam Centraal", to: "Delft", checkin: "13:00", checkout: "13:15", price: 3.7, cls: 2 },
  { date: "2025-01-19", from: "Delft", to: "Rotterdam Centraal", checkin: "17:00", checkout: "17:15", price: 3.7, cls: 2 },
  { date: "2025-01-20", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:05", checkout: "09:20", price: 17.4, cls: 2 },
  { date: "2025-01-20", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:40", checkout: "18:55", price: 17.4, cls: 2 },
  { date: "2025-01-21", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:25", checkout: "09:40", price: 17.4, cls: 2 },
  { date: "2025-01-21", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:15", checkout: "19:30", price: 17.4, cls: 2 },
  { date: "2025-01-22", from: "Rotterdam Centraal", to: "Den Haag Centraal", checkin: "09:15", checkout: "09:40", price: 5.9, cls: 2 },
  { date: "2025-01-22", from: "Den Haag Centraal", to: "Rotterdam Centraal", checkin: "13:30", checkout: "13:55", price: 5.9, cls: 2 },
  { date: "2025-01-23", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "07:55", checkout: "09:10", price: 17.4, cls: 2 },
  { date: "2025-01-23", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:20", checkout: "18:35", price: 17.4, cls: 2 },
  { date: "2025-01-25", from: "Rotterdam Centraal", to: "Utrecht Centraal", checkin: "11:00", checkout: "11:40", price: 12.1, cls: 2 },
  { date: "2025-01-25", from: "Utrecht Centraal", to: "Rotterdam Centraal", checkin: "17:30", checkout: "18:10", price: 12.1, cls: 2 },
  { date: "2025-01-26", from: "Rotterdam Centraal", to: "Leiden Centraal", checkin: "14:00", checkout: "14:30", price: 9.8, cls: 2 },
  { date: "2025-01-26", from: "Leiden Centraal", to: "Rotterdam Centraal", checkin: "18:00", checkout: "18:30", price: 9.8, cls: 2 },
  { date: "2025-01-27", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:10", checkout: "09:25", price: 17.4, cls: 2 },
  { date: "2025-01-27", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:05", checkout: "19:20", price: 17.4, cls: 2 },
  { date: "2025-01-28", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:35", checkout: "09:50", price: 17.4, cls: 2 },
  { date: "2025-01-28", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:55", checkout: "19:10", price: 17.4, cls: 2 },
  { date: "2025-01-29", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:00", checkout: "09:15", price: 17.4, cls: 2 },
  { date: "2025-01-29", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "18:20", checkout: "19:35", price: 17.4, cls: 2 },
  { date: "2025-01-30", from: "Rotterdam Centraal", to: "Den Haag Centraal", checkin: "10:30", checkout: "10:55", price: 5.9, cls: 2 },
  { date: "2025-01-30", from: "Den Haag Centraal", to: "Rotterdam Centraal", checkin: "15:15", checkout: "15:40", price: 5.9, cls: 2 },
  { date: "2025-01-31", from: "Rotterdam Centraal", to: "Amsterdam Centraal", checkin: "08:15", checkout: "09:30", price: 17.4, cls: 2 },
  { date: "2025-01-31", from: "Amsterdam Centraal", to: "Rotterdam Centraal", checkin: "17:30", checkout: "18:45", price: 17.4, cls: 2 },
];

function classifyTrip(trip) {
  // Parse YYYY-MM-DD as a local date (not UTC) so weekday is correct regardless of timezone.
  const [y, m, d] = trip.date.split("-").map(Number);
  const dateObj = new Date(y, (m || 1) - 1, d || 1);
  const day = dateObj.getDay();
  const isWeekend = day === 0 || day === 6;
  const hour = parseInt(trip.checkin.split(":")[0], 10);
  const minute = parseInt(trip.checkin.split(":")[1], 10);
  const timeDecimal = hour + minute / 60;
  const isPeak = !isWeekend && timeDecimal >= 6.5 && timeDecimal < 9;
  return { ...trip, isWeekend, isPeak, isOffPeak: !isPeak };
}

function isOnRoute(trip, route) {
  if (!route) return false;
  const normalize = (s) => s.toLowerCase().trim();
  const routeKey = [normalize(route.from), normalize(route.to)].sort().join("|");
  const tripKey = [normalize(trip.from), normalize(trip.to)].sort().join("|");
  return routeKey === tripKey;
}

function calcSubscriptionCost(trips, sub, months, trajectRoute) {
  const monthlySub = sub.monthlyCost * months;
  let tripCost = 0;
  for (const t of trips) {
    if (sub.allFree) continue;
    if (sub.trajectFree && isOnRoute(t, trajectRoute)) continue;
    if (sub.offPeakFree && t.isOffPeak) continue;
    if (sub.weekendFree && t.isWeekend) continue;
    let price = t.price;
    if (t.isPeak && sub.peakDiscount > 0) {
      price *= 1 - sub.peakDiscount;
    } else if (t.isOffPeak && sub.offPeakDiscount > 0) {
      price *= 1 - sub.offPeakDiscount;
    }
    tripCost += price;
  }
  return { subscriptionCost: monthlySub, tripCost, total: monthlySub + tripCost };
}

function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const header = lines[0].toLowerCase();
  const sep = header.includes("\t") ? "\t" : header.includes(";") ? ";" : ",";
  const cols = lines[0].split(sep).map((c) => c.trim().toLowerCase().replace(/"/g, ""));

  const findCol = (...names) => cols.findIndex((c) => names.some((n) => c.includes(n)));
  const dateIdx = findCol("datum", "date");
  const checkinIdx = findCol("check-in", "check in", "departure", "checkin");
  const checkoutIdx = findCol("check-uit", "check uit", "checkout", "aankomst", "arrival");
  const fromIdx = findCol("vertrek", "from", "van", "instap");
  const toIdx = findCol("bestemming", "to", "naar", "uitstap", "destination");
  const priceIdx = findCol("prijs", "price", "bedrag", "amount", "tarief", "fare", "af");
  const classIdx = findCol("klas", "class", "kl");

  const splitCSVRow = (row, delimiter) => {
    const vals = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < row.length; j++) {
      const ch = row[j];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        vals.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    vals.push(current.trim());
    return vals;
  };

  const trips = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = splitCSVRow(lines[i], sep);
    if (vals.length < 3) continue;

    const rawDate = dateIdx >= 0 ? vals[dateIdx] : "";
    let date = rawDate;
    if (/\d{2}-\d{2}-\d{4}/.test(rawDate)) {
      const [dd, mm, yyyy] = rawDate.split("-");
      date = `${yyyy}-${mm}-${dd}`;
    } else if (/\d{2}\/\d{2}\/\d{4}/.test(rawDate)) {
      const [dd, mm, yyyy] = rawDate.split("/");
      date = `${yyyy}-${mm}-${dd}`;
    }

    const rawPrice = priceIdx >= 0 ? vals[priceIdx] : "0";
    const price = parseFloat(rawPrice.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
    if (price <= 0) continue;

    const checkin = checkinIdx >= 0 ? vals[checkinIdx] || "09:00" : "09:00";
    const checkout = checkoutIdx >= 0 ? vals[checkoutIdx] || "10:00" : "10:00";
    const from = fromIdx >= 0 ? vals[fromIdx] || "Unknown" : "Unknown";
    const to = toIdx >= 0 ? vals[toIdx] || "Unknown" : "Unknown";
    const cls = classIdx >= 0 ? parseInt(vals[classIdx]) || 2 : 2;

    trips.push({ date, from, to, checkin: checkin.slice(0, 5), checkout: checkout.slice(0, 5), price, cls });
  }
  return trips;
}

const fmt = (n) => `€${n.toFixed(2)}`;

export default function NSAnalyzer() {
  const [trips, setTrips] = useState([]);
  const [tab, setTab] = useState("upload");
  const [dragOver, setDragOver] = useState(false);
  const [parseError, setParseError] = useState("");
  const [trajectPrice, setTrajectPrice] = useState("");
  const [trajectRoute, setTrajectRoute] = useState(null);
  const fileInputRef = useRef(null);

  const loadDemo = () => {
    setTrips(DEMO_TRIPS);
    setTab("overview");
    setParseError("");
  };

  const handleFile = useCallback((file) => {
    setParseError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (parsed.length === 0) {
          setParseError("No valid trips found. Make sure your CSV has columns for date, stations, and price.");
          return;
        }
        setTrips(parsed);
        setTab("overview");
      } catch {
        setParseError("Failed to parse CSV. Please check the file format.");
      }
    };
    reader.readAsText(file);
  }, []);

  const classified = useMemo(() => trips.map(classifyTrip), [trips]);

  const months = useMemo(() => {
    if (classified.length === 0) return 1;
    const times = classified.map((t) => {
      const [y, m, d] = t.date.split("-").map(Number);
      return new Date(y, (m || 1) - 1, d || 1).getTime();
    });
    const min = Math.min(...times);
    const max = Math.max(...times);
    const days = (max - min) / (24 * 60 * 60 * 1000);
    return Math.max(1, Math.ceil(days / 30));
  }, [classified]);

  const routeOptions = useMemo(() => {
    const routes = {};
    classified.forEach((t) => {
      const from = t.from;
      const to = t.to;
      const key = [from, to].sort().join("|");
      if (!routes[key]) {
        const [a, b] = [from, to].sort();
        routes[key] = { from: a, to: b, label: `${a} ↔ ${b}`, count: 0, spend: 0 };
      }
      routes[key].count++;
      routes[key].spend += t.price;
    });
    return Object.values(routes).sort((a, b) => b.spend - a.spend);
  }, [classified]);

  const analysis = useMemo(() => {
    if (classified.length === 0) return null;
    const totalSpent = classified.reduce((s, t) => s + t.price, 0);
    const peakTrips = classified.filter((t) => t.isPeak);
    const offPeakTrips = classified.filter((t) => t.isOffPeak && !t.isWeekend);
    const weekendTrips = classified.filter((t) => t.isWeekend);
    const peakSpend = peakTrips.reduce((s, t) => s + t.price, 0);
    const offPeakSpend = offPeakTrips.reduce((s, t) => s + t.price, 0);
    const weekendSpend = weekendTrips.reduce((s, t) => s + t.price, 0);

    const routes = {};
    classified.forEach((t) => {
      const key = [t.from, t.to].sort().join(" ↔ ");
      if (!routes[key]) routes[key] = { route: key, count: 0, spend: 0 };
      routes[key].count++;
      routes[key].spend += t.price;
    });
    const topRoutes = Object.values(routes).sort((a, b) => b.spend - a.spend).slice(0, 6);

    const dayDist = [0, 0, 0, 0, 0, 0, 0];
    classified.forEach((t) => {
      const [y, m, d] = t.date.split("-").map(Number);
      const day = new Date(y, (m || 1) - 1, d || 1).getDay();
      dayDist[day]++;
    });
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayData = dayNames.map((name, i) => ({ name, trips: dayDist[i] }));

    const trajectMonthlyCost = parseFloat(trajectPrice) || 0;
    const activeTrajectRoute = trajectRoute || (routeOptions.length > 0 ? routeOptions[0] : null);
    const includeTraject = trajectMonthlyCost > 0;

    const subCosts = SUBSCRIPTIONS
      .filter((sub) => !sub.trajectFree || includeTraject)
      .map((sub) => {
        const effectiveSub = sub.trajectFree
          ? { ...sub, monthlyCost: trajectMonthlyCost }
          : sub;
        const result = calcSubscriptionCost(classified, effectiveSub, months, sub.trajectFree ? activeTrajectRoute : null);
        return { ...effectiveSub, ...result, savings: totalSpent - result.total };
      }).sort((a, b) => a.total - b.total);

    const best = subCosts[0];

    return {
      totalTrips: classified.length,
      totalSpent,
      months,
      avgPerMonth: totalSpent / months,
      peakTrips: peakTrips.length,
      offPeakTrips: offPeakTrips.length,
      weekendTrips: weekendTrips.length,
      peakSpend,
      offPeakSpend,
      weekendSpend,
      topRoutes,
      dayData,
      subCosts,
      best,
    };
  }, [classified, months, trajectPrice, trajectRoute, routeOptions]);

  const pieData = analysis
    ? [
        { name: "Peak", value: analysis.peakSpend, fill: "#ef4444" },
        { name: "Off-peak (weekday)", value: analysis.offPeakSpend, fill: "#38bdf8" },
        { name: "Weekend", value: analysis.weekendSpend, fill: "#a78bfa" },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="min-h-screen bg-surface-dark text-text-primary font-sans">
      {/* Header */}
      <header className="relative border-t-[3px] border-ns-yellow bg-surface-elevated/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-3 py-4 sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-ns-yellow font-mono text-xl font-bold text-surface-dark shadow-[0_4px_12px_rgba(251,191,36,0.25)]">
            NS
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-text-primary">NS Trip Analyzer</h1>
            <p className="text-[13px] font-medium text-text-secondary">Optimize your Dutch rail subscription</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {trips.length > 0 && (
        <div
          role="tablist"
          aria-label="Sections"
          className="tab-scroll sticky top-0 z-10 flex gap-1 overflow-x-auto border-b border-border-default bg-surface-elevated/90 px-3 pt-3 backdrop-blur-md [-webkit-overflow-scrolling:touch] sm:px-6"
        >
          {["overview", "routes", "compare", "trips", "upload"].map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className={
                  "flex-shrink-0 whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-[13px] capitalize transition-all duration-150 " +
                  (active
                    ? "bg-surface-card-strong font-bold text-ns-yellow"
                    : "font-medium text-text-secondary hover:bg-white/5 hover:text-text-primary")
                }
              >
                {t === "compare" ? "Subscriptions" : t}
              </button>
            );
          })}
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-3 py-4 sm:px-6 sm:py-6">
        {/* Upload Tab */}
        {(tab === "upload" || trips.length === 0) && (
          <div className="mx-auto max-w-lg animate-fade-in-up">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-bold">Import your NS trips</h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                Upload your NS trip history CSV from{" "}
                <span className="font-semibold text-ns-yellow">ns.nl → Mijn NS → Reishistorie</span>. We'll analyze your travel patterns and find the cheapest subscription.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                // reset so selecting the same file again still triggers onChange
                e.target.value = "";
              }}
              className="sr-only"
            />
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload CSV file: drop here or press Enter to browse"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click(); } }}
              className={
                "mb-5 cursor-pointer rounded-2xl border-2 border-dashed px-8 py-12 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ns-yellow/60 " +
                (dragOver
                  ? "scale-[1.01] border-ns-yellow bg-ns-yellow/5"
                  : "border-border-strong bg-surface-card hover:border-ns-yellow/50 hover:bg-ns-yellow/5")
              }
            >
              <div className="mb-3 text-4xl" aria-hidden="true">📂</div>
              <div className="mb-1.5 text-base font-semibold">Drop your CSV here or click to browse</div>
              <div className="text-[13px] text-text-muted">Supports NS export format (CSV, TSV)</div>
            </div>

            {parseError && (
              <div className="mb-5 rounded-[10px] border border-red-600/30 bg-red-950/30 px-4 py-3 text-[13px] text-red-300">
                {parseError}
              </div>
            )}

            <div className="my-5 text-center">
              <span className="text-[13px] text-text-faint">or</span>
            </div>

            <button
              onClick={loadDemo}
              className="block w-full rounded-xl border border-border-strong bg-gradient-to-br from-surface-card-strong to-[#0f172a] px-4 py-3.5 text-sm font-semibold text-text-primary transition-all duration-200 hover:scale-[1.01] hover:border-ns-yellow hover:shadow-lg hover:shadow-ns-yellow/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ns-yellow/60"
            >
              🚂 Load demo data (Rotterdam commuter)
            </button>

            <div className="mt-8">
              <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-text-secondary">FAQ</h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    q: "Is my data safe?",
                    a: "Yes. Your CSV is processed entirely in your browser. No data is uploaded to any server — everything stays on your device.",
                  },
                  {
                    q: "Why does this exist?",
                    a: "NS offers many subscriptions but makes it hard to figure out which one actually saves you money. This tool analyzes your real travel patterns so you stop overpaying.",
                  },
                  {
                    q: "How much does it cost?",
                    a: "Nothing. This tool is free and always will be.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-[10px] border border-border-default bg-surface-card/80 px-4 py-3.5 backdrop-blur-sm transition-colors duration-200 hover:border-white/10"
                  >
                    <div className="mb-1 text-sm font-semibold">{faq.q}</div>
                    <div className="text-[13px] leading-relaxed text-text-secondary">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {tab === "overview" && analysis && (
          <div className="animate-fade-in-up">
            {/* Recommendation Banner */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-ns-yellow/30 bg-gradient-to-br from-ns-yellow/[0.12] to-ns-yellow/[0.03] px-6 py-5 shadow-lg shadow-ns-yellow/5 backdrop-blur-sm">
              <div className="text-3xl">🏆</div>
              <div className="flex-1 min-w-[200px]">
                <div className="mb-1 text-[13px] font-semibold uppercase tracking-wider text-ns-yellow">
                  Best subscription for you
                </div>
                <div className="text-xl font-bold">{analysis.best.name}</div>
                <div className="mt-0.5 text-[13px] text-text-secondary">{analysis.best.description}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold text-emerald-400">
                  {analysis.best.savings > 0 ? `${fmt(analysis.best.savings)}` : "—"}
                </div>
                <div className="text-xs text-text-muted">
                  {analysis.best.savings > 0 ? `saved over ${months} mo.` : "already optimal"}
                </div>
              </div>
            </div>

            {/* Traject Vrij suggestion */}
            {!trajectPrice && routeOptions.find((r) => r.count > 10) && (() => {
              const frequentRoute = routeOptions.find((r) => r.count > 10);
              return (
                <div
                  onClick={() => setTab("compare")}
                  className="mb-6 cursor-pointer rounded-xl border border-traject/30 bg-traject/[0.06] px-5 py-3.5 transition-all duration-200 hover:border-traject hover:bg-traject/10"
                >
                  <div className="text-[13px] leading-relaxed text-traject">
                    You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a <strong>Traject Vrij</strong> subscription might save you money. <span className="underline">Configure it in Subscriptions</span> to compare.
                  </div>
                </div>
              );
            })()}

            {/* KPI cards */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total trips", value: analysis.totalTrips, sub: `over ${months} month${months > 1 ? "s" : ""}` },
                { label: "Total spent", value: fmt(analysis.totalSpent), sub: `${fmt(analysis.avgPerMonth)}/month` },
                { label: "Peak trips", value: analysis.peakTrips, sub: fmt(analysis.peakSpend) },
                { label: "Off-peak / Weekend", value: `${analysis.offPeakTrips} / ${analysis.weekendTrips}`, sub: fmt(analysis.offPeakSpend + analysis.weekendSpend) },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-border-default bg-surface-card/80 px-4 py-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-white/10 hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="mb-1.5 text-xs font-medium text-text-muted">{kpi.label}</div>
                  <div className="font-mono text-[22px] font-bold tracking-tight transition-colors duration-200 group-hover:text-ns-yellow">{kpi.value}</div>
                  <div className="mt-0.5 text-xs text-text-faint">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border-default bg-surface-card/80 px-5 py-4 backdrop-blur-sm">
                <div className="mb-4 text-sm font-semibold">Trips by day of week</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analysis.dayData}>
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} />
                    <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
                      {analysis.dayData.map((_, i) => (
                        <Cell key={i} fill={i === 0 || i === 6 ? "#a78bfa" : "#fbbf24"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-border-default bg-surface-card/80 px-5 py-4 backdrop-blur-sm">
                <div className="mb-4 text-sm font-semibold">Spend distribution</div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {tab === "routes" && analysis && (
          <div className="animate-fade-in-up">
            <h2 className="mb-4 text-lg font-bold">Top Routes</h2>
            <div className="flex flex-col gap-2.5">
              {analysis.topRoutes.map((r, i) => {
                const pct = (r.spend / analysis.totalSpent) * 100;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border-default bg-surface-card/80 px-5 py-4 backdrop-blur-sm transition-all duration-200 hover:translate-x-1 hover:border-white/10 hover:shadow-lg hover:shadow-black/10"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[15px] font-semibold">{r.route}</span>
                        <span className="ml-2.5 text-xs text-text-muted">{r.count} trips</span>
                      </div>
                      <div className="font-mono text-[15px] font-semibold text-ns-yellow">{fmt(r.spend)}</div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border-default">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-ns-yellow to-ns-yellow-strong transition-all duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Subscription Comparison Tab */}
        {tab === "compare" && analysis && (
          <div className="animate-fade-in-up">
            <h2 className="mb-1.5 text-lg font-bold">Subscription Comparison</h2>
            <p className="mb-4 text-[13px] text-text-muted">
              Total cost over your {months}-month travel period.
            </p>

            <div className="mb-5 rounded-[10px] border border-amber-800/30 bg-amber-950/30 px-5 py-3.5 text-[13px] leading-relaxed text-amber-400">
              Note: the prices in your CSV reflect what you actually paid with your current subscription. This tool does not account for that — it compares subscriptions as if all trips were at full price. Trips that were discounted by your current subscription will appear cheaper than they would be without one.
            </div>

            {/* Traject Vrij config */}
            {(() => {
              const frequentRoute = routeOptions.find((r) => r.count > 10);
              const highlight = frequentRoute && !trajectPrice;
              return (
                <div
                  className={
                    "mb-5 rounded-xl border bg-surface-card/80 px-5 py-4 backdrop-blur-sm transition-colors " +
                    (highlight ? "border-traject/40" : "border-border-default")
                  }
                >
                  {highlight && (
                    <div className="mb-3 rounded-lg bg-traject/[0.06] px-3.5 py-2.5 text-[13px] leading-relaxed text-traject">
                      You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a Traject Vrij subscription might save you money. Enter the monthly price from ns.nl to compare.
                    </div>
                  )}
                  <div className="mb-2.5 text-sm font-semibold text-traject">Traject Vrij</div>
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="min-w-[200px] flex-1">
                      <label className="mb-1 block text-xs text-text-secondary">Route</label>
                      <select
                        value={trajectRoute ? `${trajectRoute.from}|${trajectRoute.to}` : ""}
                        onChange={(e) => {
                          const opt = routeOptions.find((r) => `${r.from}|${r.to}` === e.target.value);
                          setTrajectRoute(opt || null);
                        }}
                        className="w-full rounded-lg border border-border-strong bg-surface-dark px-2.5 py-2 text-[13px] text-text-primary transition-colors focus:border-ns-yellow focus:outline-none focus:ring-1 focus:ring-ns-yellow/30"
                      >
                        {routeOptions.map((r) => (
                          <option key={`${r.from}|${r.to}`} value={`${r.from}|${r.to}`}>
                            {r.label} ({r.count} trips)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="min-w-[160px]">
                      <label className="mb-1 block text-xs text-text-secondary">Monthly price (from ns.nl)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 95.00"
                        value={trajectPrice}
                        onChange={(e) => setTrajectPrice(e.target.value)}
                        className="w-full rounded-lg border border-border-strong bg-surface-dark px-2.5 py-2 font-mono text-[13px] text-text-primary transition-colors placeholder:text-text-faint focus:border-ns-yellow focus:outline-none focus:ring-1 focus:ring-ns-yellow/30"
                      />
                    </div>
                  </div>
                  {!trajectPrice && (
                    <div className="mt-2 text-xs text-text-muted">
                      Enter the monthly price to include Traject Vrij in the comparison.
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="mb-7 rounded-xl border border-border-default bg-surface-card/80 px-3 py-4 backdrop-blur-sm">
              <ResponsiveContainer width="100%" height={Math.max(200, analysis.subCosts.length * 40)}>
                <BarChart data={analysis.subCosts} layout="vertical" margin={{ left: 120 }}>
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 500 }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 13, color: "#e2e8f0" }}
                    formatter={(v) => fmt(v)}
                  />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24}>
                    {analysis.subCosts.map((s, i) => (
                      <Cell key={i} fill={s.id === analysis.best.id ? "#fbbf24" : s.color} opacity={s.id === analysis.best.id ? 1 : 0.6} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {analysis.subCosts.map((s) => {
                const isBest = s.id === analysis.best.id;
                return (
                  <div
                    key={s.id}
                    className={
                      "group relative rounded-2xl border px-5 py-4 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg " +
                      (isBest
                        ? "border-ns-yellow/40 bg-gradient-to-br from-ns-yellow/10 to-ns-yellow/[0.02] shadow-[0_0_24px_-8px_rgba(251,191,36,0.4)] hover:shadow-ns-yellow/30"
                        : "border-border-default bg-surface-card/80 hover:border-white/10 hover:shadow-black/30")
                    }
                  >
                    {isBest && (
                      <div className="absolute -top-2.5 right-3.5 rounded-full bg-ns-yellow px-2.5 py-[3px] text-[10px] font-bold uppercase tracking-wider text-surface-dark shadow-md shadow-ns-yellow/30">
                        Best fit
                      </div>
                    )}
                    <div className="mb-1 text-[15px] font-bold">{s.name}</div>
                    <div className="mb-3.5 text-xs text-text-muted">{s.description}</div>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs text-text-secondary">Subscription</span>
                      <span className="font-mono text-[13px] font-medium">{fmt(s.subscriptionCost)}</span>
                    </div>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-xs text-text-secondary">Trip costs</span>
                      <span className="font-mono text-[13px] font-medium">{fmt(s.tripCost)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-border-default pt-2">
                      <span className="text-[13px] font-semibold">Total</span>
                      <span className={"font-mono text-base font-bold " + (isBest ? "text-ns-yellow" : "text-text-primary")}>
                        {fmt(s.total)}
                      </span>
                    </div>
                    {s.savings > 0 && (
                      <div className="mt-2 text-right text-xs font-semibold text-emerald-400">
                        Save {fmt(s.savings)} vs no subscription
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trips Tab */}
        {tab === "trips" && classified.length > 0 && (
          <div className="animate-fade-in-up">
            <h2 className="mb-4 text-lg font-bold">
              All Trips <span className="text-[13px] font-normal text-text-muted">({classified.length})</span>
            </h2>
            <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card/80 backdrop-blur-sm">
              <div className="max-h-[500px] overflow-auto">
                <table className="w-full min-w-[550px] border-collapse text-[13px]">
                  <thead>
                    <tr className="sticky top-0 bg-surface-dark/95 backdrop-blur-sm">
                      {["Date", "From", "To", "Time", "Type", "Price"].map((h) => (
                        <th
                          key={h}
                          className="border-b border-border-default px-3.5 py-2.5 text-left text-xs font-semibold text-text-secondary"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classified.map((t, i) => (
                      <tr
                        key={i}
                        className="border-b border-border-default/30 transition-colors duration-150 even:bg-white/[0.02] hover:bg-white/5"
                      >
                        <td className="px-3.5 py-2 font-mono text-xs">{t.date}</td>
                        <td className="px-3.5 py-2">{t.from}</td>
                        <td className="px-3.5 py-2">{t.to}</td>
                        <td className="px-3.5 py-2 font-mono text-xs text-text-secondary">{t.checkin}</td>
                        <td className="px-3.5 py-2">
                          <span
                            className={
                              "rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                              (t.isPeak
                                ? "bg-red-600/15 text-red-300"
                                : t.isWeekend
                                ? "bg-violet-500/15 text-violet-300"
                                : "bg-sky-500/15 text-sky-300")
                            }
                          >
                            {t.isPeak ? "Peak" : t.isWeekend ? "Weekend" : "Off-peak"}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 font-mono font-semibold">{fmt(t.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
