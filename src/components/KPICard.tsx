import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Package } from 'lucide-react';
import { getAverageProductsPerManufacturer, getAverageProductsPerManufacturerWithSales, getAverageProductsPerManufacturerWithSalesAll } from '../services/api';

interface KPICardProps {
  title: string;
  allValues: { main: number , withSales: number | string, withSalesInTop10: number | string };
  icon: 'competitors' | 'products';
  trend?: number;
  category: string;
  fabId?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, allValues, icon, trend, category, fabId }) => {
  const [productValues, setProductValues] = useState({ main: 0, withSales: 0, withSalesInTop10: 0 });

  useEffect(() => {
    if (icon === 'products') {
      const fetchData = async () => {
        const main = await getAverageProductsPerManufacturer(category, undefined, undefined, fabId);
        const withSales = await getAverageProductsPerManufacturerWithSales(category, undefined, undefined, fabId);
        const withSalesInTop10 = await getAverageProductsPerManufacturerWithSalesAll(category, undefined, undefined, fabId);
        setProductValues({ main, withSales, withSalesInTop10 });
      };
      fetchData();
    }
  }, [category, fabId, icon]);

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
      <div></div>
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
      <h3 className="text-gray-600 text-sm">{title} {category=="all"?'dans toutes catégories':'dans la categorie '+category}</h3>
      <div className="flex justify-between">
        <div>
          <p className="text-2xl font-bold mt-1">{allValues.main}
          {icon === 'products' && (<span className="text-green-600 text-2xl font-bold mt-1"> ({productValues.main})</span>)}
          </p>
          
          <h4 className="text-gray-500 text-sm">avec ventes :</h4>
          <p className="text-xl mt-1">{allValues.withSales}
          {icon === 'products' && (<span className="text-green-600 text-xl  mt-1"> ({productValues.withSales})</span>)}
          </p>
          <h4 className="text-gray-500 text-sm">avec ventes dans top10Mag :</h4>
          <p className="text-xl mt-1">{allValues.withSalesInTop10}
          {icon === 'products' && (<span className="text-green-600 text-xl  mt-1"> ({productValues.withSalesInTop10})</span>)}
          </p>
        </div>
      </div>
    </div>
  );
};