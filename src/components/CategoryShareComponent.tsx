import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCategoriesParts, getCategoriesPartsManufacturer } from '../services/api';

// Couleurs plus sérieuses pour un dashboard professionnel
const COLORS = ['#2F4F4F', '#708090', '#556B2F', '#8B4513', '#4682B4', '#6A5ACD', '#363020', '#8e5572', '#9ACD32', '#20B2AA', '#FF6347'];

export const CategoryShareComponent: React.FC<{ manufacturer: string }> = ({ manufacturer }) => {
  const [data, setData] = useState<any[]>([]);
  const [manufacturerData, setManufacturerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCategoriesParts();
      const totalSales = response.reduce((sum: number, item: any) => sum + item.sales, 0);
      const formattedData = response.map((item: any) => ({
        name: item.catID,
        value: parseFloat(((item.sales / totalSales) * 100).toFixed(2)), // Convertir en nombre
        sales: item.sales
      }));
      setData(formattedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!manufacturer || data.length === 0) {
      return;
    }

    const fetchManufacturerData = async () => {
      const response = await getCategoriesPartsManufacturer(manufacturer);
      const totalSales = response.reduce((sum: number, item: any) => sum + item.sales, 0);
      const formattedData = response.map((item: any) => ({
        name: item.catID,
        value: parseFloat(((item.sales / totalSales) * 100).toFixed(2)), // Convertir en nombre
        sales: item.sales
      }));
      // console.log("formattedData", formattedData);

      setManufacturerData(formattedData);
    };

    fetchManufacturerData();
  }, [manufacturer]);

  const getColor = (name: string) => {
    const index = data.findIndex(item => item.name === name);
    return COLORS[index % COLORS.length];
  };

  const combinedData = [...data, ...manufacturerData].reduce((acc, item) => {
    if (!acc.find((i: any) => i.name === item.name)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const renderLabel = (entry: any) => `${entry.value}%`;

  const renderTooltip = ({ payload }: any) => {
    if (payload && payload.length) {
      const { name, value, payload: { sales } } = payload[0]; // Inclure sales depuis payload
      return (
        <div className="custom-tooltip bg-white border rounded p-2 shadow-md">
          <p>{`Catégorie ${name} : ${value}%`}</p>
          <p>{`Ventes : ${sales}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Part de marché par catégorie</h3>
      </div>
      <div className="h-[400px]"> {/* Augmenter la hauteur pour agrandir le PieChart */}
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={manufacturerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} fill="#8884d8">
                {manufacturerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={110} fill="#82ca9d" label={renderLabel}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend layout="vertical" align="right" verticalAlign="middle" payload={combinedData.map((item:any, index:any) => ({
                id: item.name,
                type: 'square',
                value: `Catégorie ${item.name}`,
                color: getColor(item.name)
              }))} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};