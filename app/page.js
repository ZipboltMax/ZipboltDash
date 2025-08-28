"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ComposedChart,
  Rectangle,
} from "recharts";
const Plot = dynamic(() => import("@/components/ClientPlot"), {
  ssr: false,
});

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiMiniArrowTrendingDown } from "react-icons/hi2";
import { BsFillBox2Fill } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import TopNavigationBar from "@/components/TopNavigationBar";

const pieData = [
  { name: "A", value: 40 },
  { name: "B", value: 30 },
  { name: "C", value: 30 },
];
const barData = [
  { name: "Jan", uv: 400 },
  { name: "Feb", uv: 300 },
  { name: "Mar", uv: 500 },
];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function DashboardPage() {
  const [temperatureData, setTemperatureData] = useState([]);

  const [zMatrix, setZMatrix] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [yLabels, setYLabels] = useState([]);

  const getColor = (value) => {
    const temp = parseFloat(value);
    if (temp < 30) return "#d0f0fd"; // light blue
    if (temp < 35) return "#80d4fa"; // blue
    if (temp < 40) return "#fdd835"; // yellow
    if (temp < 45) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  // Format timestamp for display (e.g., "07-04 11:45")
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}`;
  };

  // Add formatted timestamp for axis label
  const processedData = temperatureData.map((d) => ({
    ...d,
    label: formatTime(d.timestamp),
  }));

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("/api/analytics/temperature");

      const result = await response.json();
      // Preprocess and sort by timestamp
      /*const sortedData = result
        .map((entry) => ({
          timestamp: new Date(entry.timestamp).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: parseFloat(entry.temperature),
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setTemperatureData(sortedData);*/

      const grouped = {};
      const hoursSet = new Set();

      result.forEach(({ timestamp, temperature }) => {
        const date = new Date(timestamp);
        const day = date.toISOString().split("T")[0]; // e.g., 2025-07-07
        const hour = `${String(date.getHours()).padStart(2, "0")}:00`;

        if (!grouped[day]) grouped[day] = {};
        grouped[day][hour] = parseFloat(temperature);
        hoursSet.add(hour);
      });

      const sortedHours = Array.from(hoursSet).sort();
      const sortedDays = Object.keys(grouped).sort();

      // Step 2: Build matrix
      const z = sortedDays.map((day) =>
          sortedHours.map((hour) => grouped[day][hour] ?? null)
        );

      setXLabels(sortedHours);
      setYLabels(sortedDays);
      setZMatrix(z);
    } catch (error) {
      console.error("Failed to fetch temperature history:", error);
    }
  };

  useEffect(() => {
    fetchTemperatureData();
  }, []);
  return (
    <div className="p-6 space-y-6">
      {/* Top Row: Header and Menu */}
      <TopNavigationBar />
      {/* Top Row: Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          ZipSure AI Diagnostics Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <FaSearch className="text-gray-600" />
          <FaCalendarAlt className="text-gray-600" />
          <Badge className="bg-black text-white px-4 py-2 rounded-full">
            2025-05-01
          </Badge>
          <Badge className="bg-black text-white px-4 py-2 rounded-full">
            2025-05-15
          </Badge>
          <Button className="bg-white text-black rounded-full px-4 py-2">
            Export to PDF
          </Button>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {/* Row 1 - Card 1: Centered Image */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="font-bold text-2xl">EV CHAMP</div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48">
            <Image
              src="/zipsure_logo.png"
              alt="Center Image"
              width={200}
              height={200}
              className="rounded-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center space-x-2">
                <BsFillBox2Fill />
                <span>Age Range</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={60} label>
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center space-x-2">
                <GrDocumentText />
                <span>Summary</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uv" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Row 2 - Card 1: Profile */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>{""}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-2">
            <Avatar size="lg" className="w-24 h-24">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{"Rohan Singh"}</AvatarFallback>
            </Avatar>

            <div className="text-center">
              <div className="text-lg font-semibold">Rohan Singh</div>
              <div className="text-sm text-gray-500">New Delhi, India</div>
              <div className="text-sm mt-1 grid grid-cols-2 gap-2">
                <div className="text-sm text-red-500">
                  <div>100 345</div>
                  <div className="text-gray-500">Payment Plan</div>
                </div>
                <div className="text-sm text-purple-500">
                  <div>1765</div>
                  <div className="text-gray-500">Stars</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 2 - Card 2: Wide Bar Chart */}
        <Card className="col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center space-x-2">
                <HiMiniArrowTrendingDown />
                <span>Live Voltage Feed</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-120">
            <div className="w-full p-4">
              <h2 className="text-xl font-semibold mb-4">
                🌡️ Temperature Heatmap (Plotly)
              </h2>
              <Plot
                data={[
                  {
                    z: zMatrix,
                    x: xLabels,
                    y: yLabels,
                    type: "heatmap",
                    colorscale: "YlOrRd",
                    hoverongaps: false,
                    hovertemplate:
                      "Time: %{x}<br>Date: %{y}<br>Temp: %{z}°C<extra></extra>",
                  },
                ]}
                layout={{
                  width: 800,
                  height: 400,
                  margin: { t: 20 },
                  xaxis: { title: "Hour of Day" },
                  yaxis: { title: "Date" },
                }}
                config={{ responsive: true }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
