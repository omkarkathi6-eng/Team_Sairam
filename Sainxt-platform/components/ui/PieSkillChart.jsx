"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
 
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];
 
export default function PieSkillChart({ scores }) {
  const data = [
    { name: "Communication", value: scores?.communication || 0 },
    { name: "Leadership", value: scores?.leadership || 0 },
    { name: "Technical", value: scores?.technical || 0 },
    { name: "Domain Knowledge", value: scores?.domain || 0 },
    { name: "Problem Solving", value: scores?.problemSolving || 0 },
  ];
 
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}