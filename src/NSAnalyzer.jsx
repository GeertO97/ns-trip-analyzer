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
    color: "#4497d1",
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
    color: "#6366f1",
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
    color: "#0f766e",
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
    color: "#0a2463",
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
    color: "#ffc914",
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
    color: "#f59e0b",
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

// Design tokens (mirrors index.css :root vars for inline JS use)
const T = {
  primary: "#0a2463",
  primaryHover: "#0e2e7e",
  onPrimary: "#ffffff",
  secondary: "#ffc914",
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceSubtle: "#f1f5f9",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  text: "#111827",
  textMuted: "#475569",
  textSubtle: "#94a3b8",
  vizPeak: "#f59e0b",
  vizOffpeak: "#4497d1",
  vizWeekend: "#ffc914",
  success: "#0f766e",
  error: "#ba1a1a",
  fontDisplay: "'Geist', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
};

const card = {
  background: T.surface,
  borderRadius: 8,
  border: `1px solid ${T.border}`,
  padding: "24px",
};

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
        { name: "Peak", value: analysis.peakSpend, fill: T.vizPeak },
        { name: "Off-peak (weekday)", value: analysis.offPeakSpend, fill: T.vizOffpeak },
        { name: "Weekend", value: analysis.weekendSpend, fill: T.vizWeekend },
      ].filter((d) => d.value > 0)
    : [];

  const chartTooltip = {
    background: T.surface,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    fontSize: 13,
    color: T.text,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  };

  const kpiSubColor = T.textSubtle;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.fontBody }}>
      {/* Header */}
      <header style={{ background: T.primary, borderBottom: `1px solid ${T.primary}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: T.secondary,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
              color: T.primary,
              fontFamily: T.fontDisplay,
              letterSpacing: "0.02em",
            }}
          >
            NS
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", letterSpacing: "-0.01em", fontFamily: T.fontDisplay }}>
              NS Trip Analyzer
            </div>
            <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.75)", fontWeight: 400 }}>
              Optimize your Dutch rail subscription
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      {trips.length > 0 && (
        <nav style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
          <div
            role="tablist"
            aria-label="Sections"
            className="tab-scroll"
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              gap: 4,
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {["overview", "routes", "compare", "trips", "upload"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className="tab-btn"
                style={{ textTransform: "capitalize" }}
              >
                {t === "compare" ? "Subscriptions" : t}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Upload Tab */}
        {(tab === "upload" || trips.length === 0) && (
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 12, fontFamily: T.fontDisplay, letterSpacing: "-0.01em", color: T.text }}>
                Import your NS trips
              </h1>
              <p style={{ color: T.textMuted, fontSize: 16, lineHeight: 1.6 }}>
                Upload your NS trip history CSV from{" "}
                <span style={{ color: T.primary, fontWeight: 600 }}>ns.nl → Mijn NS → Reishistorie</span>.
                We'll analyze your travel patterns and find the cheapest subscription.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                e.target.value = "";
              }}
              style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", border: 0 }}
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
              style={{
                border: `2px dashed ${dragOver ? T.primary : T.borderStrong}`,
                borderRadius: 16,
                padding: "56px 32px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(10, 36, 99, 0.04)" : T.surface,
                transition: "all 0.2s",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }} aria-hidden="true">📂</div>
              <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, fontFamily: T.fontDisplay, color: T.text }}>
                Drop your CSV here or click to browse
              </div>
              <div style={{ fontSize: 13, color: T.textMuted }}>Supports NS export format (CSV, TSV)</div>
            </div>

            {parseError && (
              <div
                style={{
                  padding: "14px 18px",
                  background: "#fef2f2",
                  border: `1px solid #fecaca`,
                  borderRadius: 8,
                  color: T.error,
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                {parseError}
              </div>
            )}

            <div style={{ textAlign: "center", margin: "20px 0", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ color: T.textSubtle, fontSize: 12, fontFamily: T.fontDisplay, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                or
              </span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <button onClick={loadDemo} className="btn-primary" style={{ width: "100%", padding: "14px" }}>
              🚂 Load demo data (Rotterdam commuter)
            </button>

            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: T.textMuted, fontFamily: T.fontDisplay, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                FAQ
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  <div key={i} className="card-hover" style={{ ...card, padding: "16px 20px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, fontFamily: T.fontDisplay, color: T.text }}>{faq.q}</div>
                    <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.6 }}>{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {tab === "overview" && analysis && (
          <div>
            {/* Recommendation Banner */}
            <div
              style={{
                background: T.primary,
                borderRadius: 16,
                padding: "24px 28px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 20,
                color: "#ffffff",
              }}
            >
              <div style={{ fontSize: 36 }} aria-hidden="true">🏆</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: T.secondary,
                    fontWeight: 600,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontFamily: T.fontDisplay,
                  }}
                >
                  Best subscription for you
                </div>
                <div style={{ fontSize: 24, fontWeight: 600, fontFamily: T.fontDisplay, letterSpacing: "-0.01em" }}>
                  {analysis.best.name}
                </div>
                <div style={{ fontSize: 14, color: "rgba(255, 255, 255, 0.75)", marginTop: 4 }}>{analysis.best.description}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: T.secondary, fontFamily: T.fontDisplay, letterSpacing: "-0.01em" }}>
                  {analysis.best.savings > 0 ? `${fmt(analysis.best.savings)}` : "—"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.6)" }}>
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
                  className="card-hover"
                  style={{
                    padding: "16px 20px",
                    background: "#fff8e1",
                    border: `1px solid #fde68a`,
                    borderRadius: 8,
                    marginBottom: 24,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 14, color: "#854d0e", lineHeight: 1.6 }}>
                    You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a{" "}
                    <strong>Traject Vrij</strong> subscription might save you money.{" "}
                    <span style={{ textDecoration: "underline" }}>Configure it in Subscriptions</span> to compare.
                  </div>
                </div>
              );
            })()}

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total trips", value: analysis.totalTrips, sub: `over ${months} month${months > 1 ? "s" : ""}` },
                { label: "Total spent", value: fmt(analysis.totalSpent), sub: `${fmt(analysis.avgPerMonth)}/month` },
                { label: "Peak trips", value: analysis.peakTrips, sub: fmt(analysis.peakSpend) },
                { label: "Off-peak / Weekend", value: `${analysis.offPeakTrips} / ${analysis.weekendTrips}`, sub: fmt(analysis.offPeakSpend + analysis.weekendSpend) },
              ].map((kpi, i) => (
                <div key={i} className="card-hover" style={card}>
                  <div
                    style={{
                      fontSize: 12,
                      color: T.textMuted,
                      fontWeight: 500,
                      marginBottom: 10,
                      fontFamily: T.fontDisplay,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: T.fontDisplay, color: T.text }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: 13, color: kpiSubColor, marginTop: 4 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div className="card-hover" style={card}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, fontFamily: T.fontDisplay, color: T.text }}>
                  Trips by day of week
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analysis.dayData}>
                    <XAxis dataKey="name" tick={{ fill: T.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={chartTooltip} cursor={{ fill: "rgba(10, 36, 99, 0.04)" }} />
                    <Bar dataKey="trips" radius={[4, 4, 0, 0]}>
                      {analysis.dayData.map((_, i) => (
                        <Cell key={i} fill={i === 0 || i === 6 ? T.vizWeekend : T.primary} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card-hover" style={card}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, fontFamily: T.fontDisplay, color: T.text }}>
                  Spend distribution
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.fill} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 12, color: T.textMuted }} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={chartTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Routes Tab */}
        {tab === "routes" && analysis && (
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20, fontFamily: T.fontDisplay, letterSpacing: "-0.01em", color: T.text }}>
              Top Routes
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {analysis.topRoutes.map((r, i) => {
                const pct = (r.spend / analysis.totalSpent) * 100;
                return (
                  <div key={i} className="card-hover" style={card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 600, fontFamily: T.fontDisplay, color: T.text }}>{r.route}</span>
                        <span style={{ fontSize: 13, color: T.textMuted, marginLeft: 12 }}>{r.count} trips</span>
                      </div>
                      <div style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 600, color: T.primary, letterSpacing: "-0.01em" }}>
                        {fmt(r.spend)}
                      </div>
                    </div>
                    <div style={{ height: 8, background: T.surfaceSubtle, borderRadius: 4, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background: T.primary,
                          borderRadius: 4,
                          transition: "width 0.5s",
                        }}
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
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, fontFamily: T.fontDisplay, letterSpacing: "-0.01em", color: T.text }}>
              Subscription Comparison
            </h2>
            <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 20 }}>
              Total cost over your {months}-month travel period.
            </p>

            <div
              style={{
                padding: "14px 18px",
                background: "#fff8e1",
                border: `1px solid #fde68a`,
                borderRadius: 8,
                marginBottom: 24,
                fontSize: 13,
                color: "#854d0e",
                lineHeight: 1.6,
              }}
            >
              Note: the prices in your CSV reflect what you actually paid with your current subscription. This tool does not account for that — it compares subscriptions as if all trips were at full price. Trips that were discounted by your current subscription will appear cheaper than they would be without one.
            </div>

            {/* Traject Vrij config */}
            {(() => {
              const frequentRoute = routeOptions.find((r) => r.count > 10);
              return (
                <div
                  style={{
                    ...card,
                    border: `1px solid ${frequentRoute && !trajectPrice ? T.warning : T.border}`,
                    marginBottom: 24,
                  }}
                >
                  {frequentRoute && !trajectPrice && (
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "#fff8e1",
                        borderRadius: 8,
                        marginBottom: 16,
                        fontSize: 13,
                        color: "#854d0e",
                        lineHeight: 1.6,
                      }}
                    >
                      You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a Traject Vrij subscription might save you money. Enter the monthly price from ns.nl to compare.
                    </div>
                  )}
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, fontFamily: T.fontDisplay, color: T.text }}>
                    Traject Vrij
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <label
                        style={{
                          fontSize: 12,
                          color: T.textMuted,
                          display: "block",
                          marginBottom: 6,
                          fontFamily: T.fontDisplay,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Route
                      </label>
                      <select
                        value={trajectRoute ? `${trajectRoute.from}|${trajectRoute.to}` : ""}
                        onChange={(e) => {
                          const opt = routeOptions.find((r) => `${r.from}|${r.to}` === e.target.value);
                          setTrajectRoute(opt || null);
                        }}
                        className="field"
                      >
                        {routeOptions.map((r) => (
                          <option key={`${r.from}|${r.to}`} value={`${r.from}|${r.to}`}>
                            {r.label} ({r.count} trips)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ minWidth: 180 }}>
                      <label
                        style={{
                          fontSize: 12,
                          color: T.textMuted,
                          display: "block",
                          marginBottom: 6,
                          fontFamily: T.fontDisplay,
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Monthly price (ns.nl)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 95.00"
                        value={trajectPrice}
                        onChange={(e) => setTrajectPrice(e.target.value)}
                        className="field field--mono"
                      />
                    </div>
                  </div>
                  {!trajectPrice && (
                    <div style={{ fontSize: 12, color: T.textSubtle, marginTop: 10 }}>
                      Enter the monthly price to include Traject Vrij in the comparison.
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ ...card, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={Math.max(220, analysis.subCosts.length * 44)}>
                <BarChart data={analysis.subCosts} layout="vertical" margin={{ left: 120, right: 20 }}>
                  <XAxis type="number" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: T.text, fontSize: 13, fontWeight: 500, fontFamily: "Geist" }}
                    axisLine={false}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip contentStyle={chartTooltip} formatter={(v) => fmt(v)} cursor={{ fill: "rgba(10, 36, 99, 0.04)" }} />
                  <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={26}>
                    {analysis.subCosts.map((s, i) => (
                      <Cell key={i} fill={s.id === analysis.best.id ? T.secondary : s.color} opacity={s.id === analysis.best.id ? 1 : 0.7} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {analysis.subCosts.map((s) => {
                const isBest = s.id === analysis.best.id;
                return (
                  <div
                    key={s.id}
                    className="card-hover"
                    style={{
                      ...card,
                      border: `1px solid ${isBest ? T.secondary : T.border}`,
                      borderTopWidth: isBest ? 3 : 1,
                      borderTopColor: isBest ? T.secondary : T.border,
                      position: "relative",
                    }}
                  >
                    {isBest && (
                      <div
                        style={{
                          position: "absolute",
                          top: -12,
                          right: 16,
                          background: T.secondary,
                          color: T.primary,
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 9999,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          fontFamily: T.fontDisplay,
                        }}
                      >
                        Best fit
                      </div>
                    )}
                    <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, fontFamily: T.fontDisplay, color: T.text }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 18, lineHeight: 1.5 }}>{s.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.textMuted }}>Subscription</span>
                      <span style={{ fontSize: 13, fontFamily: T.fontDisplay, fontWeight: 500, color: T.text }}>{fmt(s.subscriptionCost)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: T.textMuted }}>Trip costs</span>
                      <span style={{ fontSize: 13, fontFamily: T.fontDisplay, fontWeight: 500, color: T.text }}>{fmt(s.tripCost)}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: T.fontDisplay, color: T.text }}>Total</span>
                      <span
                        style={{
                          fontSize: 20,
                          fontFamily: T.fontDisplay,
                          fontWeight: 700,
                          color: isBest ? T.primary : T.text,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {fmt(s.total)}
                      </span>
                    </div>
                    {s.savings > 0 && (
                      <div style={{ marginTop: 10, fontSize: 12, color: T.success, fontWeight: 600, textAlign: "right", fontFamily: T.fontDisplay }}>
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
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20, fontFamily: T.fontDisplay, letterSpacing: "-0.01em", color: T.text }}>
              All Trips{" "}
              <span style={{ fontSize: 14, fontWeight: 400, color: T.textMuted, fontFamily: T.fontBody }}>
                ({classified.length})
              </span>
            </h2>
            <div style={{ ...card, padding: 0, overflow: "hidden" }}>
              <div style={{ maxHeight: 560, overflowY: "auto", overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 600, borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: T.surfaceSubtle, position: "sticky", top: 0 }}>
                      {["Date", "From", "To", "Time", "Type", "Price"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontWeight: 600,
                            color: T.textMuted,
                            fontSize: 11,
                            fontFamily: T.fontDisplay,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classified.map((t, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "10px 16px", fontFamily: T.fontDisplay, fontSize: 13, color: T.text }}>{t.date}</td>
                        <td style={{ padding: "10px 16px", color: T.text }}>{t.from}</td>
                        <td style={{ padding: "10px 16px", color: T.text }}>{t.to}</td>
                        <td style={{ padding: "10px 16px", fontFamily: T.fontDisplay, fontSize: 13, color: T.textMuted }}>{t.checkin}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              padding: "3px 10px",
                              borderRadius: 9999,
                              background: t.isPeak ? "rgba(245, 158, 11, 0.12)" : t.isWeekend ? "rgba(255, 201, 20, 0.18)" : "rgba(68, 151, 209, 0.12)",
                              color: t.isPeak ? "#92400e" : t.isWeekend ? "#854d0e" : "#075985",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              fontFamily: T.fontDisplay,
                            }}
                          >
                            {t.isPeak ? "Peak" : t.isWeekend ? "Weekend" : "Off-peak"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px", fontFamily: T.fontDisplay, fontWeight: 600, color: T.text }}>{fmt(t.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
