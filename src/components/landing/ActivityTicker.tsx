"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const activities = [
  { name: "Rahim", action: "just backed", target: "TechStartup BD" },
  { name: "Fatima", action: "launched a new campaign:", target: "EcoFarm Chittagong" },
  { name: "Kamal", action: "just backed", target: "Dhaka EdTech" },
  { name: "Nusrat", action: "raised ৳100,000 for", target: "GreenPower Sylhet" },
  { name: "Arif", action: "just backed", target: "FinServe Bangladesh" },
  { name: "Tasnim", action: "launched a new campaign:", target: "Artisan Weaves" },
  { name: "Imran", action: "just backed", target: "MediCare Plus" },
  { name: "Sadia", action: "raised ৳250,000 for", target: "FreshHarvest BD" },
];

function ActivityTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % activities.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const item = activities[index];

  return (
    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-secondary-200/60 rounded-full px-4 py-2 shadow-sm">
      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent-100">
        <Zap className="h-3 w-3 text-accent-600" />
      </span>
      <span
        className={`text-sm text-secondary-600 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="font-semibold text-secondary-800">{item.name}</span>{" "}
        {item.action}{" "}
        <span className="font-semibold text-primary-600">{item.target}</span>
      </span>
    </div>
  );
}

export { ActivityTicker };
