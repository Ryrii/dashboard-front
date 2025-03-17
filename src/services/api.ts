import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const getManufacturers = async () => {
  const response = await api.get('/api/manufacturers_list');
  return response.data.manufacturers;
};

export const getCategories = async () => {
  const response = await api.get('/api/categories_list');
  return response.data.categories;
};

export const getCategoriesParts = async () => {
  const response = await api.get(`/api/sales_by_category`);
  return response.data.sales_by_category;
};

export const getManufacturerData = async (manufacturerId: string, category: string, period: string) => {
  const response = await api.get(`/manufacturers/${manufacturerId}`, {
    params: { category, period }
  });
  return response.data;
};

export const getTopStores = async (category: string,manufacturer: string) => {
  
  var url = '/api/top_10_per_cat_part_fabricant/'+category+'/'+manufacturer;
  if (category === 'all') {
    url = '/api/top_10_all_cat_part_fabricant/'+manufacturer;
  }
  const response = await api.get(url);
  return response.data.top_10_stores;
};

export const getTopManufacturerShare = async (category: string) => {
  let url = '/api/manufacturer_share_per_cat_top_10/' + category;
  if (category === 'all') {
    url = '/api/manufacturer_share_all_cat_top_10';
  }
  const response = await api.get(url);
  return response.data.manufacturer_shares;
};

export const getTopSellers = async (storeId: string) => {
  const response = await api.get(`/stores/${storeId}/sellers/top`);
  return response.data;
};

export const searchSeller = async (query: string) => {
  const response = await api.get('/sellers/search', {
    params: { query }
  });
  return response.data;
};