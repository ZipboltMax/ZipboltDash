// app/dashboard/page.js
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  Legend,
  PolarGrid,
  PolarRadiusAxis,
  Label
} from 'recharts';
import { HiMiniArrowTrendingDown } from 'react-icons/hi2';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import TopNavigationBar from "@/components/TopNavigationBar";
const pieData = [
  { name: 'A', value: 40 },
  { name: 'B', value: 30 },
  { name: 'C', value: 30 },
];
const barData = [
  { name: '1', uv: 400 },
  { name: '2', uv: 300 },
  { name: '3', uv: 500 },
  { name: '4', uv: 400 },
  { name: '5', uv: 300 },
  { name: '6', uv: 500 },
  { name: '7', uv: 400 },
  { name: '8', uv: 300 },
  { name: '9', uv: 500 },
  { name: '10', uv: 400 },
  { name: '11', uv: 300 },
  { name: '12', uv: 500 },
  { name: '13', uv: 400 },
  { name: '14', uv: 300 },
  { name: '15', uv: 500 },
  { name: '16', uv: 400 },
  { name: '17', uv: 300 },
  { name: '18', uv: 500 },
  { name: '19', uv: 400 },
  { name: '20', uv: 300 },
  { name: '21', uv: 500 },
  { name: '22', uv: 400 },
  { name: '23', uv: 300 },
  { name: '24', uv: 500 },
  { name: '25', uv: 400 },
  { name: '26', uv: 300 },
  { name: '27', uv: 500 },
  { name: '28', uv: 400 },
  { name: '30', uv: 300 },
  { name: '40', uv: 500 },
  { name: '41', uv: 400 },
  { name: '42', uv: 300 },
  { name: '43', uv: 500 },
  { name: '44', uv: 400 },
  { name: '45', uv: 300 },
  { name: '46', uv: 500 },
  { name: '47', uv: 400 },
  { name: '48', uv: 300 },
  { name: '49', uv: 500 },
  { name: '50', uv: 400 },
  { name: '51', uv: 300 },
  { name: '52', uv: 500 },
];
const horizontalBarData = [
  { name: '20 Jul 2024', value: 400 },
  { name: '21 Jul 2024', value: 300 },
  { name: '22 Jul 2024', value: 200 },
  { name: '23 Jul 2025', value: 100 },
  { name: '24 Jul 2025', value: 400 },
  { name: '25 Jul 2025', value: 300 },
  { name: '26 Jul 2025', value: 200 },
  { name: '27 Jul 2025', value: 100 },
];
const tableData = Array.from({ length: 10 }, (_, i) => ({
  name: `File_${i + 1}.pdf`,
  status: i % 2 === 0 ? 'Completed' : 'Pending',
  size: '10 MB',
  date: '2025-05-15',
  time: `${10 + i}:00 AM`
}));

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Row: Header and Menu */}
      <TopNavigationBar />
      {/* Top Row: Header and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">ZIP Sure AI Diagnostics Dashboard</h1>
        <div className="flex flex-wrap items-center gap-3">
          <FaSearch className="text-gray-600" />
          <FaCalendarAlt className="text-gray-600" />
          <Badge className="bg-gray-200 text-gray-700">2025-05-01</Badge>
          <Badge className="bg-gray-200 text-gray-700">2025-05-15</Badge>
          <Button className="rounded-full px-4 py-2">Export to PDF</Button>
        </div>
      </div>

      {/* Row with Horizontal and Vertical Bar Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={horizontalBarData}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Text</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Size</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white text-black shadow-sm rounded-md my-2 mt-2 mb-2"
                  >
                    <td className="py-3 px-2">{item?.name}</td>
                    <td className="py-3 px-2">{item?.status}</td>
                    <td className="py-3 px-2">{item?.size}</td>
                    <td className="py-3 px-2">{"10-05-2025"}</td>
                    <td className="py-3 px-2">{item?.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}