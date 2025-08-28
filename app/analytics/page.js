// app/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import TopNavigationBar from "@/components/TopNavigationBar";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

export default function Analytics() {
  const [data, setData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);

  const fetchVoltageData = async () => {
    try {
      const response = await fetch("/api/analytics/voltage-history");

      const result = await response.json();
      // Preprocess and sort by timestamp
      const sortedData = result
        .map((entry) => ({
          timestamp: new Date(entry.timestamp).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          voltage: parseFloat(entry.voltage),
          current: parseFloat(entry.current),
          soc: parseFloat(entry.soc),
        }))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setData(sortedData);
    } catch (error) {
      console.error("Failed to fetch voltage history:", error);
    }
  };

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("/api/analytics/temperature");

      const result = await response.json();
      // Preprocess and sort by timestamp
      const sortedData = result
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

      setTemperatureData(sortedData);
    } catch (error) {
      console.error("Failed to fetch temperature history:", error);
    }
  };

  useEffect(() => {
    fetchVoltageData();
    fetchTemperatureData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Top Row: Header and Menu */}
      <TopNavigationBar />
      {/* Top Row: Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Battery Diagnostics Dashboard
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
      {/* New Layout - Row with 3 Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Overview Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48">
            <Image
              src="/zipsure_logo.png"
              alt="Center Image"
              width={100}
              height={100}
              className="rounded-full"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1 sm:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>SOC</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="soc"
                  stroke="#ffc658"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 sm:col-span-4 lg:col-span-1">
          <CardHeader>
            <CardTitle>Current</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row - Progress Bars and Radials */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 sm:col-span-1 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Measured Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mb-10">
              {/* 1. Area Chart */}
              <div className="w-full" style={{ height: "360px" }}>
                <h2 className="text-xl font-semibold mb-2">
                  Temperature Over Time
                </h2>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={temperatureData}>
                    <defs>
                      <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#FF8042"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#FF8042"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="temperature"
                      stroke="#FF8042"
                      fill="url(#tempFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2 w-full h-80">
          <Card>
            <CardHeader>
              <CardTitle>Voltage Over Time (V)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full" style={{ height: "400px" }}>
                <h2 className="text-xl font-semibold">
                  Battery Metrics Over Time
                </h2>
                {data.length === 0 && (
                  <p className="text-red-500">No data available</p>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorVoltage"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorCurrent"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#ffc658"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ffc658"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="voltage"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorVoltage)"
                    />
                    <Area
                      type="monotone"
                      dataKey="current"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorCurrent)"
                    />
                    <Area
                      type="monotone"
                      dataKey="soc"
                      stroke="#ffc658"
                      fillOpacity={1}
                      fill="url(#colorSoc)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
