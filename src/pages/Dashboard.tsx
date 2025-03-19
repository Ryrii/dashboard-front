import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FilterComponent } from '../components/FilterComponent';
import { KPICard } from '../components/KPICard';
import { ChartComponent } from '../components/ChartComponent';
import { StoreListComponent } from '../components/StoreListComponent';
import { TopManufacturersComponent } from '../components/TopManufacturersComponent';
import { CategoryShareComponent } from '../components/CategoryShareComponent';
import { CompetitorsEvolutionChart } from '../components/CompetitorsEvolutionChart';
import { ProductsEvolutionChart } from '../components/ProductsEvolutionChart';
import { getManufacturerData, getTopStores, getTopSellers, searchSeller, getTopManufacturerShare, getCategoriesParts, getCompetitorsCount, getCompetitorsWithSales, getCompetitorsWithSalesInTop10, getAverageProductsPerManufacturer, getAverageProductsPerManufacturerWithSales, getAverageProductsPerManufacturerWithSalesAll } from '../services/api';

export const Dashboard: React.FC = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [category, setCategory] = useState('');
  const [period, setPeriod] = useState('1M');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<any>(null);
  const [top10StoresSales, setTotalSales] = useState(0);
  const [manufacturerSalesinTop10Stores, setManufacturerSalesinTop10Stores] = useState(0);
  const [topManufacturers, setTopManufacturers] = useState<any[]>([]);
  const [categoriesParts, setCategoriesParts] = useState<any[]>([]);
  const [competitorsCount, setCompetitorsCount] = useState(0);
  const [competitorsWithSales, setCompetitorsWithSales] = useState(0);
  const [competitorsWithSalesInTop10, setCompetitorsWithSalesInTop10] = useState(0);
  const [averageProducts, setAverageProducts] = useState(0);
  const [averageProductsWithSales, setAverageProductsWithSales] = useState(0);
  const [averageProductsWithSalesAll, setAverageProductsWithSalesAll] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const categoriesPartsData = await getCategoriesParts();
      setCategoriesParts(categoriesPartsData);

      if (manufacturer && category) {
        const topStores = await getTopStores(category, manufacturer);
        const transformedTopStores = topStores.map((store: any) => ({
          name: `Mag${store.magID}`,
          sales: store.product_count,
          manufacturerShare: store.part_fabricant
        }));
        setData((prevData: any) => ({
          ...prevData,
          topStores: transformedTopStores
        }));

        const topManufacturersData = await getTopManufacturerShare(category);
        const transformedTopManufacturers = topManufacturersData.map((manufacturer: any) => ({
          fabID: manufacturer.fabID,
          total_sales_fab: manufacturer.total_sales_fab
        }));
        setTopManufacturers(transformedTopManufacturers);

        const competitorsCountData = await getCompetitorsCount(category);
        setCompetitorsCount(competitorsCountData);

        const competitorsWithSalesData = await getCompetitorsWithSales(category);
        setCompetitorsWithSales(competitorsWithSalesData);

        const competitorsWithSalesInTop10Data = await getCompetitorsWithSalesInTop10(category);
        setCompetitorsWithSalesInTop10(competitorsWithSalesInTop10Data);

        const averageProductsData = await getAverageProductsPerManufacturer(category);
        setAverageProducts(averageProductsData.toFixed(1));

        const averageProductsWithSalesData = await getAverageProductsPerManufacturerWithSales(category);
        setAverageProductsWithSales(averageProductsWithSalesData.toFixed(1));

        const averageProductsWithSalesAllData = await getAverageProductsPerManufacturerWithSalesAll(category);
        setAverageProductsWithSalesAll(averageProductsWithSalesAllData.toFixed(1));
      }
    };
    fetchData();
  }, [manufacturer, category, period]);

  useEffect(() => {
    // if (top10StoresSales) {
    //   console.log('top10StoresSales:', top10StoresSales);
    //   console.log('manufacturerSalesinTop10Stores:', manufacturerSalesinTop10Stores);
    // }
    // console.log(competitorsCount, competitorsWithSales, competitorsWithSalesInTop10, averageProducts, averageProductsWithSales, averageProductsWithSalesAll);
  }, [top10StoresSales]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord KPI</h1>
        
        <FilterComponent
          onManufacturerChange={setManufacturer}
          onCategoryChange={setCategory}
          // onPeriodChange={setPeriod}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Concurrents"
            values={{
              main: competitorsCount,
              withSales: competitorsWithSales,
              withSalesInTop10: competitorsWithSalesInTop10
            }}
            icon="competitors"
            category={category}
          />
          <KPICard
            title="Produits par fabricant"
            values={{
              main: averageProducts,
              withSales: averageProductsWithSales,
              withSalesInTop10: averageProductsWithSalesAll
            }}
            icon="products"
            category={category}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StoreListComponent
            data={data?.topStores || []}
            title="Top 10 Magasins"
            top10StoresSales={top10StoresSales}
            setTop10StoresSales={setTotalSales}
            manufacturerSalesinTop10Stores={manufacturerSalesinTop10Stores}
            setManufacturerSalesinTop10Stores={setManufacturerSalesinTop10Stores}
            category={category}
          />
          <TopManufacturersComponent
            data={topManufacturers}
            top10StoresSales={top10StoresSales}
            selectedManufacturer={manufacturer}
            selectedCategory={category}
          />
        </div>

        <CategoryShareComponent
          data={categoriesParts || []}
          title="Répartition des ventes par catégorie"
        />


        <CompetitorsEvolutionChart 
          category={category}
        />
        
        <ProductsEvolutionChart 
          category={category}
        />
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un vendeur..."
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};