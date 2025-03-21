import React, { useState, useEffect } from 'react';
import { getHealthScore } from '../services/api';

interface HealthScoreComponentProps {
  category: string;
  manufacturer: string;
}

export const HealthScoreComponent: React.FC<HealthScoreComponentProps> = ({ category, manufacturer }) => {
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthScoreTop10, setHealthScoreTop10] = useState<number | null>(null);

  useEffect(() => {
    const fetchHealthScore = async () => {
      if (category && manufacturer) {
        const score = await getHealthScore(category, manufacturer);
        setHealthScore(parseFloat(score.toFixed(2)));

        const scoreTop10 = await getHealthScore(category, manufacturer, undefined, undefined, true);
        setHealthScoreTop10(parseFloat(scoreTop10.toFixed(2)));
      }
    };
    fetchHealthScore();
  }, [category, manufacturer]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900">Score de Santé</h2>
        <p className="text-2xl text-gray-700">{healthScore !== null ? healthScore : 'N/A'}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900">Score de Santé (Top 10 Magasins)</h2>
        <p className="text-2xl text-gray-700">{healthScoreTop10 !== null ? healthScoreTop10 : 'N/A'}</p>
      </div>
    </div>
  );
};
