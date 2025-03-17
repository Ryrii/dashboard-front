import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryData {
  catID: string;
  sales: number;
}

interface CategoryShareProps {
  data: CategoryData[];
  title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6347', '#ADFF2F'];

const sampleData: CategoryData[] = [
  { catID: 'Catégorie A', sales: 400 },
  { catID: 'Catégorie B', sales: 300 },
  { catID: 'Catégorie C', sales: 300 },
  { catID: 'Catégorie D', sales: 200 },
];

export const CategoryShareComponent: React.FC<CategoryShareProps> = ({ data = sampleData, title }) => {
  const totalSales = useMemo(() => data.reduce((sum, category) => sum + category.sales, 0), [data]);

  const dataWithPercentage = data.map(category => ({
    ...category,
    percentage: ((category.sales / totalSales) * 100).toFixed(2)
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              dataKey="percentage"
              nameKey="catID"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {dataWithPercentage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};