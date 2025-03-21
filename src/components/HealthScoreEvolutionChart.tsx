import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getHealthScore } from '../services/api';

const winterSalesStart = new Date('2022-01-01');
const winterSalesEnd = new Date('2022-01-31');
const summerSalesStart = new Date('2022-07-01');
const summerSalesEnd = new Date('2022-07-31');

export const HealthScoreEvolutionChart: React.FC<any> = ({ category,manufacturer }) => {
  const [startDate, setStartDate] = useState(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState(new Date('2023-01-16'));
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interval, setInterval] = useState(30);
  const [tempInterval, setTempInterval] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      if (!category || !manufacturer) {
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
        const healthScoreCategory = await getHealthScore(category, manufacturer, startDateString, endDateString, false);
        const healthScoreTop10 = await getHealthScore(category, manufacturer, startDateString, endDateString, true);
        setProgress(Math.round(((index + 1) / dates.length) * 100));
        return {
          date: date.toISOString().split('T')[0],
          healthScoreCategory: healthScoreCategory,
          healthScoreTop10: healthScoreTop10,
        };
      });

      const results = await Promise.all(promises);
      setData(results);
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate, category,manufacturer, interval]);

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
        <h3 className="text-lg font-semibold">Évolution du score de santé pour {category === "all" ? 'toutes les catégories' : 'la catégorie ' + category}</h3>
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
              <Line type="monotone" dataKey="healthScoreCategory" stroke="#8884d8" activeDot={{ r: 8 }} name="Score de santé (Catégorie)" />
              <Line type="monotone" dataKey="healthScoreTop10" stroke="#82ca9d" activeDot={{ r: 8 }} name="Score de santé (Top 10)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
