import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCompetitorsCount, getCompetitorsWithSales, getCompetitorsWithSalesInTop10 } from '../services/api';

const winterSalesStart = new Date('2022-01-01');
const winterSalesEnd = new Date('2022-01-31');
const summerSalesStart = new Date('2022-07-01');
const summerSalesEnd = new Date('2022-07-31');

export const CompetitorsEvolutionChart: React.FC<any> = ({ category }) => {
  const [startDate, setStartDate] = useState(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState(new Date('2022-05-01'));
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [interval, setInterval] = useState(10);
  const [tempInterval, setTempInterval] = useState(10);
  const [selectedLines, setSelectedLines] = useState({
    competitors: true,
    competitorsWithSales: true,
    competitorsInTop10: true,
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
        const competitorsCount = await getCompetitorsCount(category, startDateString, endDateString);
        const competitorsWithSales = await getCompetitorsWithSales(category, startDateString, endDateString);
        const competitorsInTop10 = await getCompetitorsWithSalesInTop10(category, startDateString, endDateString);
        setProgress(Math.round(((index + 1) / dates.length) * 100));
        return {
          date: date.toISOString().split('T')[0],
          competitors: competitorsCount,
          competitorsWithSales: competitorsWithSales,
          competitorsInTop10: competitorsInTop10,
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
        <h3 className="text-lg font-semibold">Évolution du nombre de concurrents pour {category=="all"?' toute les catégories':'pour la categorie '+category} </h3>
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
          onChange={(e) => {
            const value = Number(e.target.value);
            if (Number.isInteger(value) && value > 0) {
            setTempInterval(value);
            }
          }}
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
              {selectedLines.competitors && (
                <Line type="monotone" dataKey="competitors" stroke="#8884d8" activeDot={{ r: 8 }} name="Concurrents" />
              )}
              {selectedLines.competitorsWithSales && (
                <Line type="monotone" dataKey="competitorsWithSales" stroke="#82ca9d" name="Concurrents avec ventes" />
              )}
              {selectedLines.competitorsInTop10 && (
                <Line type="monotone" dataKey="competitorsInTop10" stroke="#ffc658" name="Concurrents dans le top 10" />
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
              checked={selectedLines.competitors}
              onChange={() => handleLineToggle('competitors')}
            />
            <span>Concurrents</span>
            <input
              type="checkbox"
              checked={selectedLines.competitorsWithSales}
              onChange={() => handleLineToggle('competitorsWithSales')}
            />
            <span>Concurrents avec ventes</span>
            <input
              type="checkbox"
              checked={selectedLines.competitorsInTop10}
              onChange={() => handleLineToggle('competitorsInTop10')}
            />
            <span>Concurrents dans le top 10</span>
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
