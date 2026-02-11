import { useState, useMemo, useCallback } from "react";
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
  const d = new Date(trip.date);
  const day = d.getDay();
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
    const dates = classified.map((t) => new Date(t.date));
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    return Math.max(1, Math.round((max - min) / (30 * 24 * 60 * 60 * 1000) + 0.5));
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
      const day = new Date(t.date).getDay();
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
    <div style={{ minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #151b2e; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .tab-scroll::-webkit-scrollbar { display: none; }
        .tab-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)", padding: "16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, background: "#1e293b", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fbbf24", fontFamily: "JetBrains Mono" }}>
          NS
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" }}>NS Trip Analyzer</div>
          <div style={{ fontSize: 13, color: "#44403c", fontWeight: 500 }}>Optimize your Dutch rail subscription</div>
        </div>
      </div>

      {/* Tabs */}
      {trips.length > 0 && (
        <div className="tab-scroll" style={{ display: "flex", gap: 2, padding: "12px 12px 0", background: "#0f1525", borderBottom: "1px solid #1e293b", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {["overview", "routes", "compare", "trips", "upload"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 14px",
                background: tab === t ? "#1e293b" : "transparent",
                color: tab === t ? "#fbbf24" : "#94a3b8",
                border: "none",
                borderRadius: "8px 8px 0 0",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: tab === t ? 700 : 500,
                textTransform: "capitalize",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {t === "compare" ? "Subscriptions" : t}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "16px 12px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Upload Tab */}
        {(tab === "upload" || trips.length === 0) && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Import your NS trips</h2>
              <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6 }}>
                Upload your NS trip history CSV from{" "}
                <span style={{ color: "#fbbf24", fontWeight: 600 }}>ns.nl → Mijn NS → Reishistorie</span>. We'll analyze your travel patterns and find the cheapest subscription.
              </p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              onClick={() => { const inp = document.createElement("input"); inp.type = "file"; inp.accept = ".csv,.tsv,.txt"; inp.onchange = (e) => e.target.files[0] && handleFile(e.target.files[0]); inp.click(); }}
              style={{
                border: `2px dashed ${dragOver ? "#fbbf24" : "#334155"}`,
                borderRadius: 16,
                padding: "48px 32px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(251, 191, 36, 0.05)" : "#111827",
                transition: "all 0.2s",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📂</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Drop your CSV here or click to browse</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>Supports NS export format (CSV, TSV)</div>
            </div>

            {parseError && (
              <div style={{ padding: "12px 16px", background: "#7f1d1d33", border: "1px solid #dc262644", borderRadius: 10, color: "#fca5a5", fontSize: 13, marginBottom: 20 }}>
                {parseError}
              </div>
            )}

            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <span style={{ color: "#475569", fontSize: 13 }}>or</span>
            </div>

            <button
              onClick={loadDemo}
              style={{
                display: "block",
                width: "100%",
                padding: "14px",
                background: "linear-gradient(135deg, #1e293b, #0f172a)",
                border: "1px solid #334155",
                borderRadius: 12,
                color: "#e2e8f0",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "#fbbf24")}
              onMouseLeave={(e) => (e.target.style.borderColor = "#334155")}
            >
              🚂 Load demo data (Rotterdam commuter)
            </button>

            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#94a3b8" }}>FAQ</h3>
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
                  <div key={i} style={{ padding: "14px 18px", background: "#111827", borderRadius: 10, border: "1px solid #1e293b" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{faq.q}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{faq.a}</div>
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
                background: "linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.03))",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: 16,
                padding: "20px 24px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 32 }}>🏆</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#fbbf24", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Best subscription for you
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{analysis.best.name}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{analysis.best.description}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#34d399", fontFamily: "JetBrains Mono" }}>
                  {analysis.best.savings > 0 ? `${fmt(analysis.best.savings)}` : "—"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
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
                  style={{ padding: "14px 18px", background: "#fb923c11", border: "1px solid #fb923c44", borderRadius: 12, marginBottom: 24, cursor: "pointer", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fb923c")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#fb923c44")}
                >
                  <div style={{ fontSize: 13, color: "#fb923c", lineHeight: 1.6 }}>
                    You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a <strong>Traject Vrij</strong> subscription might save you money. <span style={{ textDecoration: "underline" }}>Configure it in Subscriptions</span> to compare.
                  </div>
                </div>
              );
            })()}

            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Total trips", value: analysis.totalTrips, sub: `over ${months} month${months > 1 ? "s" : ""}` },
                { label: "Total spent", value: fmt(analysis.totalSpent), sub: `${fmt(analysis.avgPerMonth)}/month` },
                { label: "Peak trips", value: analysis.peakTrips, sub: fmt(analysis.peakSpend) },
                { label: "Off-peak / Weekend", value: `${analysis.offPeakTrips} / ${analysis.weekendTrips}`, sub: fmt(analysis.offPeakSpend + analysis.weekendSpend) },
              ].map((kpi, i) => (
                <div key={i} style={{ background: "#111827", borderRadius: 12, padding: "16px 18px", border: "1px solid #1e293b" }}>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginBottom: 6 }}>{kpi.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "JetBrains Mono", letterSpacing: "-0.5px" }}>{kpi.value}</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "#111827", borderRadius: 12, padding: "18px 20px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Trips by day of week</div>
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

              <div style={{ background: "#111827", borderRadius: 12, padding: "18px 20px", border: "1px solid #1e293b" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Spend distribution</div>
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
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Top Routes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {analysis.topRoutes.map((r, i) => {
                const pct = (r.spend / analysis.totalSpent) * 100;
                return (
                  <div key={i} style={{ background: "#111827", borderRadius: 12, padding: "16px 20px", border: "1px solid #1e293b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{r.route}</span>
                        <span style={{ fontSize: 12, color: "#64748b", marginLeft: 10 }}>{r.count} trips</span>
                      </div>
                      <div style={{ fontFamily: "JetBrains Mono", fontSize: 15, fontWeight: 600, color: "#fbbf24" }}>{fmt(r.spend)}</div>
                    </div>
                    <div style={{ height: 6, background: "#1e293b", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)", borderRadius: 3, transition: "width 0.5s" }} />
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
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Subscription Comparison</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
              Total cost over your {months}-month travel period.
            </p>

            <div style={{ padding: "14px 18px", background: "#1e1a0e", border: "1px solid #854d0e44", borderRadius: 10, marginBottom: 20, fontSize: 13, color: "#d97706", lineHeight: 1.6 }}>
              Note: the prices in your CSV reflect what you actually paid with your current subscription. This tool does not account for that — it compares subscriptions as if all trips were at full price. Trips that were discounted by your current subscription will appear cheaper than they would be without one.
            </div>

            {/* Traject Vrij config */}
            {(() => {
              const frequentRoute = routeOptions.find((r) => r.count > 10);
              return (
                <div style={{ padding: "16px 20px", background: "#111827", border: `1px solid ${frequentRoute && !trajectPrice ? "#fb923c44" : "#1e293b"}`, borderRadius: 12, marginBottom: 20 }}>
                  {frequentRoute && !trajectPrice && (
                    <div style={{ padding: "10px 14px", background: "#fb923c11", borderRadius: 8, marginBottom: 12, fontSize: 13, color: "#fb923c", lineHeight: 1.6 }}>
                      You traveled <strong>{frequentRoute.label}</strong> {frequentRoute.count} times — a Traject Vrij subscription might save you money. Enter the monthly price from ns.nl to compare.
                    </div>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#fb923c" }}>Traject Vrij</div>
                  <div style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Route</label>
                      <select
                        value={trajectRoute ? `${trajectRoute.from}|${trajectRoute.to}` : ""}
                        onChange={(e) => {
                          const opt = routeOptions.find((r) => `${r.from}|${r.to}` === e.target.value);
                          setTrajectRoute(opt || null);
                        }}
                        style={{ width: "100%", padding: "8px 10px", background: "#0a0e1a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "inherit" }}
                      >
                        {routeOptions.map((r) => (
                          <option key={`${r.from}|${r.to}`} value={`${r.from}|${r.to}`}>
                            {r.label} ({r.count} trips)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ minWidth: 160 }}>
                      <label style={{ fontSize: 12, color: "#94a3b8", display: "block", marginBottom: 4 }}>Monthly price (from ns.nl)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g. 95.00"
                        value={trajectPrice}
                        onChange={(e) => setTrajectPrice(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: "#0a0e1a", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", fontSize: 13, fontFamily: "JetBrains Mono" }}
                      />
                    </div>
                  </div>
                  {!trajectPrice && (
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>
                      Enter the monthly price to include Traject Vrij in the comparison.
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{ marginBottom: 28 }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {analysis.subCosts.map((s) => {
                const isBest = s.id === analysis.best.id;
                return (
                  <div
                    key={s.id}
                    style={{
                      background: isBest ? "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.02))" : "#111827",
                      borderRadius: 14,
                      padding: "18px 20px",
                      border: `1px solid ${isBest ? "rgba(251,191,36,0.4)" : "#1e293b"}`,
                      position: "relative",
                    }}
                  >
                    {isBest && (
                      <div style={{ position: "absolute", top: -10, right: 14, background: "#fbbf24", color: "#0f172a", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Best fit
                      </div>
                    )}
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 14 }}>{s.description}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Subscription</span>
                      <span style={{ fontSize: 13, fontFamily: "JetBrains Mono", fontWeight: 500 }}>{fmt(s.subscriptionCost)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>Trip costs</span>
                      <span style={{ fontSize: 13, fontFamily: "JetBrains Mono", fontWeight: 500 }}>{fmt(s.tripCost)}</span>
                    </div>
                    <div style={{ borderTop: "1px solid #1e293b", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Total</span>
                      <span style={{ fontSize: 16, fontFamily: "JetBrains Mono", fontWeight: 700, color: isBest ? "#fbbf24" : "#e2e8f0" }}>{fmt(s.total)}</span>
                    </div>
                    {s.savings > 0 && (
                      <div style={{ marginTop: 8, fontSize: 12, color: "#34d399", fontWeight: 600, textAlign: "right" }}>
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
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              All Trips <span style={{ fontSize: 13, fontWeight: 400, color: "#64748b" }}>({classified.length})</span>
            </h2>
            <div style={{ background: "#111827", borderRadius: 12, border: "1px solid #1e293b", overflow: "hidden" }}>
              <div style={{ maxHeight: 500, overflowY: "auto", overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: 550, borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#0f172a", position: "sticky", top: 0 }}>
                      {["Date", "From", "To", "Time", "Type", "Price"].map((h) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#94a3b8", fontSize: 12, borderBottom: "1px solid #1e293b" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {classified.map((t, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b11" }}>
                        <td style={{ padding: "8px 14px", fontFamily: "JetBrains Mono", fontSize: 12 }}>{t.date}</td>
                        <td style={{ padding: "8px 14px" }}>{t.from}</td>
                        <td style={{ padding: "8px 14px" }}>{t.to}</td>
                        <td style={{ padding: "8px 14px", fontFamily: "JetBrains Mono", fontSize: 12, color: "#94a3b8" }}>{t.checkin}</td>
                        <td style={{ padding: "8px 14px" }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "2px 8px",
                              borderRadius: 20,
                              background: t.isPeak ? "#dc262622" : t.isWeekend ? "#8b5cf622" : "#0ea5e922",
                              color: t.isPeak ? "#fca5a5" : t.isWeekend ? "#c4b5fd" : "#67e8f9",
                            }}
                          >
                            {t.isPeak ? "Peak" : t.isWeekend ? "Weekend" : "Off-peak"}
                          </span>
                        </td>
                        <td style={{ padding: "8px 14px", fontFamily: "JetBrains Mono", fontWeight: 600 }}>{fmt(t.price)}</td>
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
