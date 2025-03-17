import React from 'react';
import { TrendingUp, Users, Package } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: 'competitors' | 'products';
  trend?: number;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend }) => {
  const getIcon = () => {
    switch (icon) {
      case 'competitors':
        return <Users className="w-6 h-6 text-blue-600" />;
      case 'products':
        return <Package className="w-6 h-6 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-100 rounded-full">{getIcon()}</div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};