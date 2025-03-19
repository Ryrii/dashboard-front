import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getAverageProductsPerManufacturer, getAverageProductsPerManufacturerWithSales, getAverageProductsPerManufacturerWithSalesAll } from '../services/api';

const winterSalesStart = new Date('2022-01-01');
const winterSalesEnd = new Date('2022-01-31');
const summerSalesStart = new Date('2022-07-01');
const summerSalesEnd = new Date('2022-07-31');

export const ProductsEvolutionChart: React.FC<any> = ({ category }) => {
  const [startDate, setStartDate] = useState(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState(new Date('2022-05-01'));
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interval, setInterval] = useState(10);
  const [tempInterval, setTempInterval] = useState(10);
  const [selectedLines, setSelectedLines] = useState({
    products: true,
    productsWithSales: true,
    productsWithSalesInTop10: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!category) {
        return;
      }

      setLoading(true);
      setProgress(0);

      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + interval);
      }

      const startDateString = startDate.toISOString().split('T')[0].replace(/-/g, '');

      const promises = dates.map(async (date, index) => {
        const endDateString = date.toISOString().split('T')[0].replace(/-/g, '');
        const productsCount = await getAverageProductsPerManufacturer(category, startDateString, endDateString);
        const productsWithSales = await getAverageProductsPerManufacturerWithSales(category, startDateString, endDateString);
        const productsWithSalesInTop10 = await getAverageProductsPerManufacturerWithSalesAll(category, startDateString, endDateString);
        setProgress(Math.round(((index + 1) / dates.length) * 100));
        return {
          date: date.toISOString().split('T')[0],
          products: productsCount,
          productsWithSales: productsWithSales,
          productsWithSalesInTop10: productsWithSalesInTop10,
        };
      });

      const results = await Promise.all(promises);
      setData(results);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate, category, interval]);

  const handleLineToggle = (line: string) => {
    setSelectedLines((prev:any) => ({
      ...prev,
      [line]: !prev[line],
    }));
  };

  const handlePeriodChange = (period: string) => {
    if (period === 'winter') {
      setStartDate(winterSalesStart);
      setEndDate(winterSalesEnd);
    } else if (period === 'summer') {
      setStartDate(summerSalesStart);
      setEndDate(summerSalesEnd);
    }
  };

  const handleIntervalChange = () => {
    setInterval(tempInterval);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Évolution du nombre de produits par fabricant pour {category === "all" ? 'toutes les catégories' : 'la catégorie ' + category}</h3>
      </div>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de début</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => date && setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-1 p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de fin</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => date && setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="mt-1 p-2 border rounded-md"
          />
        </div>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Période:</label>
          <div className="flex items-center gap-2 mt-1">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handlePeriodChange('winter')}
            >
              Soldes d'hiver
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => handlePeriodChange('summer')}
            >
              Soldes d'été
            </button>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Précision:</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              value={tempInterval}
              onChange={(e) => setTempInterval(Number(e.target.value))}
              className="mt-1 p-2 border rounded-md"
              min="1"
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={handleIntervalChange}
            >
              Valider
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>


      <div className="h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-full relative">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
            <div className="absolute text-blue-500">{progress}%</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedLines.products && (
                <Line type="monotone" dataKey="products" stroke="#8884d8" activeDot={{ r: 8 }} name="Produits" />
              )}
              {selectedLines.productsWithSales && (
                <Line type="monotone" dataKey="productsWithSales" stroke="#82ca9d" name="Produits avec ventes" />
              )}
              {selectedLines.productsWithSalesInTop10 && (
                <Line type="monotone" dataKey="productsWithSalesInTop10" stroke="#ffc658" name="Produits dans le top 10" />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Afficher les courbes:</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              checked={selectedLines.products}
              onChange={() => handleLineToggle('products')}
            />
            <span>Produits</span>
            <input
              type="checkbox"
              checked={selectedLines.productsWithSales}
              onChange={() => handleLineToggle('productsWithSales')}
            />
            <span>Produits avec ventes</span>
            <input
              type="checkbox"
              checked={selectedLines.productsWithSalesInTop10}
              onChange={() => handleLineToggle('productsWithSalesInTop10')}
            />
            <span>Produits dans le top 10</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <span>Date de début: {startDate.toISOString().split('T')[0]}</span>
        <span>Date de fin: {endDate.toISOString().split('T')[0]}</span>
      </div>
    </div>
  );
};
