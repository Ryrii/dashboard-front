import React, { useState, useEffect } from 'react';
import { getTopManufacturerShare } from '../services/api';

interface ManufacturerData {
  fabID: string;
  total_sales_fab: number;
}

interface TopManufacturersProps {
  selectedManufacturer: string;
  selectedCategory: string;
  intop10StoresSales: boolean;
}

export const TopManufacturersComponent: React.FC<TopManufacturersProps> = ({ selectedManufacturer, selectedCategory, intop10StoresSales }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [sortedData, setSortedData] = useState<ManufacturerData[]>([]);
  const [selectedManufacturerData, setSelectedManufacturerData] = useState<ManufacturerData | null>(null);
  const [topManufacturers, setTopManufacturers] = useState<ManufacturerData[]>([]);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const topManufacturersData = await getTopManufacturerShare(selectedCategory, intop10StoresSales);
      const transformedTopManufacturers = topManufacturersData.map((manufacturer: any) => ({
        fabID: manufacturer.fabID,
        total_sales_fab: manufacturer.total_sales_fab
      }));
      setTopManufacturers(transformedTopManufacturers);

      const sorted = [...transformedTopManufacturers].sort((a, b) => b.total_sales_fab - a.total_sales_fab);
      setSortedData(sorted);

      const selectedData = sorted.find(manufacturer => manufacturer.fabID == selectedManufacturer);
      setSelectedManufacturerData(selectedData || null);

      const totalSales = transformedTopManufacturers.reduce((sum:any, manufacturer:any) => sum + manufacturer.total_sales_fab, 0);
      setTotalSales(totalSales);
    };

    fetchData();
  }, [selectedManufacturer, selectedCategory, intop10StoresSales]);

  const handleNext = () => {
    if ((currentPage + 1) * itemsPerPage < sortedData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Classement Fabricants {intop10StoresSales?'dans le top 10 magasins ':''}{selectedCategory === "all" ? ' toutes catégories' : 'de la categorie ' + selectedCategory}</h3>
        </div>
        <span className="text-lg font-medium text-green-600">Total ventes: {totalSales}</span>
      </div>

      <div className="space-y-4">
        {visibleData.map((manufacturer, index) => (
          <div key={manufacturer.fabID} className="relative">
            <div className="flex items-center gap-4">
              <span className={`text-gray-500 w-6 ${manufacturer.fabID == selectedManufacturer ? 'text-blue-600' : ''}`}>{startIndex + index + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${manufacturer.fabID == selectedManufacturer ? 'text-blue-600' : ''}`}>Fab {manufacturer.fabID}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {manufacturer.total_sales_fab.toLocaleString()} ventes
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {((manufacturer.total_sales_fab / totalSales) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-600 rounded-full relative" style={{ width: `${(manufacturer.total_sales_fab / totalSales) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {selectedManufacturerData && !visibleData.some(manufacturer => manufacturer.fabID == selectedManufacturer) && (
          <div key={selectedManufacturerData.fabID} className="relative bg-yellow-100">
            <div className="flex items-center gap-4">
              <span className="text-gray-500 w-6">{sortedData.findIndex(manufacturer => manufacturer.fabID == selectedManufacturer) + 1}.</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-blue-600">Fab {selectedManufacturerData.fabID}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {selectedManufacturerData.total_sales_fab.toLocaleString()} ventes
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {((selectedManufacturerData.total_sales_fab / totalSales) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-600 rounded-full relative" style={{ width: `${(selectedManufacturerData.total_sales_fab / totalSales) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={currentPage === 0}
        >
          Précédent
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={(currentPage + 1) * itemsPerPage >= sortedData.length}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};
