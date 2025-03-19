import React from 'react';
import { Store } from 'lucide-react';

interface StoreData {
  name: string;
  sales: number;
  manufacturerShare: number;
}

interface StoreListProps {
  data: StoreData[];
  title: string;
  top10StoresSales: number;
  setTop10StoresSales: (value: number) => void;
  manufacturerSalesinTop10Stores: number;
  setManufacturerSalesinTop10Stores: (value: number) => void;
  category: string;
}

export const StoreListComponent: React.FC<StoreListProps> = ({ data, title, setTop10StoresSales,setManufacturerSalesinTop10Stores,category }) => {
//   console.log("data", data);
  
  const maxSales = Math.max(...data.map(store => store.sales));
  const averageManufacturerShare = (data.reduce((acc, store) => acc + (store.manufacturerShare * 100 / store.sales), 0) / data.length).toFixed(2);

React.useEffect(() => {
    const newtop10StoresSales = data.reduce((acc, store) => acc + store.sales, 0);
    setTop10StoresSales(newtop10StoresSales);
    
    const newmanufacturerSalesinTop10Stores = data.reduce((acc, store) => acc + store.manufacturerShare, 0);
    setManufacturerSalesinTop10Stores(newmanufacturerSalesinTop10Stores);
}, [data, setTop10StoresSales]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Store className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">{title}  {category=="all"?' toutes catégories':'de la categorie '+category}</h3>
        </div>
        <span className="text-lg font-medium text-green-600">Part fabricant: {averageManufacturerShare}%</span>
      </div>
      
      <div className="space-y-4">
        {data.map((store, index) => (
          <div key={store.name} className="relative">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-6">{index + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{store.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                    {store.manufacturerShare.toLocaleString()} sur {store.sales.toLocaleString()} ventes
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {(store.manufacturerShare * 100 / store.sales).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-600 rounded-full relative" style={{ width: `${(store.sales / maxSales) * 100}%` }}>
                    <div className="h-full bg-green-600 rounded-full absolute top-0 left-0" style={{ width: `${store.manufacturerShare*100/store.sales}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};