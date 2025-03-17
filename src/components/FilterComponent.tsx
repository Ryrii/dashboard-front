import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { getManufacturers } from '../services/api';
import { getCategories } from '../services/api';

interface FilterProps {
  onManufacturerChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
}

export const FilterComponent: React.FC<FilterProps> = ({
  onManufacturerChange,
  onCategoryChange,
  onPeriodChange
}) => {
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchManufacturers = async () => {
      const result = await getManufacturers();
      setManufacturers(result);
 
    };
    fetchManufacturers();
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result);
    }
    fetchCategories();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          onChange={(e) => onManufacturerChange(e.target.value)}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner un fabricant</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {'Fab'+manufacturer}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onCategoryChange(e.target.value)}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
          <option value="all">Toutes les catégories</option>
        </select>

        <select
          onChange={(e) => onPeriodChange(e.target.value)}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="1M">1 Mois</option>
          <option value="3M">3 Mois</option>
          <option value="6M">6 Mois</option>
          <option value="1Y">1 An</option>
        </select>
      </div>
    </div>
  );
};