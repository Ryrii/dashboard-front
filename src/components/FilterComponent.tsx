import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { getManufacturers } from '../services/api';
import { getCategories } from '../services/api';

interface FilterProps {
  onManufacturerChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const FilterComponent: React.FC<FilterProps> = ({
  onManufacturerChange,
  onCategoryChange,
}) => {
  const [manufacturers, setManufacturers] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [manufacturerInput, setManufacturerInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showManufacturers, setShowManufacturers] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchManufacturers = async () => {
      const result = await getManufacturers();
      setManufacturers(result);
      setLoadingManufacturers(false);
    };
    fetchManufacturers();
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result);
      setLoadingCategories(false);
    }
    fetchCategories();
  }, []);

  const filteredManufacturers = manufacturers.filter(manufacturer =>
    manufacturer.toString().includes(manufacturerInput)
  );

  const filteredCategories = categories.filter(category =>
    category.toString().includes(categoryInput)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Filtres</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            value={manufacturerInput}
            onChange={(e) => setManufacturerInput(e.target.value)}
            onClick={() => setShowManufacturers(true)}
            onBlur={() => setTimeout(() => setShowManufacturers(false), 200)}
            placeholder="Sélectionner un fabricant"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full"
          />
          {showManufacturers && (
            <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto">
              {loadingManufacturers ? (
                <li className="p-2">Chargement...</li>
              ) : (
                filteredManufacturers.map((manufacturer) => (
                  <li
                    key={manufacturer}
                    onClick={() => {
                      onManufacturerChange(manufacturer.toString());
                      setManufacturerInput(manufacturer.toString());
                      setShowManufacturers(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {'Fab' + manufacturer}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onClick={() => setShowCategories(true)}
            onBlur={() => setTimeout(() => setShowCategories(false), 200)}
            placeholder="Sélectionner une catégorie"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-full"
          />
          {showCategories && (
            <ul className="absolute bg-white border rounded-md mt-1 w-full max-h-40 overflow-y-auto">
              {loadingCategories ? (
                <li className="p-2">Chargement...</li>
              ) : (
                <>
                  {filteredCategories.map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        onCategoryChange(category.toString());
                        setCategoryInput(category.toString());
                        setShowCategories(false);
                      }}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {category}
                    </li>
                  ))}
                  <li
                    onClick={() => {
                      onCategoryChange('all');
                      setCategoryInput('Toutes les catégories');
                      setShowCategories(false);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    Toutes les catégories
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};