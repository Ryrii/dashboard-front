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

export const getCompetitorsCount = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/competitors_count`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/competitors_count/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }
  var response = await api.get(url);
  console.log(url);
  
  console.log(response.data.competitors_count);
  
  return response.data.competitors_count;
};

export const getCompetitorsWithSales = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/competitors_with_sales`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/competitors_with_sales/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }
  
  var response = await api.get(url);
  return response.data.competitors_with_sales_count;
};

export const getCompetitorsWithSalesInTop10 = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/competitors_with_sales_in_top10`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/competitors_with_sales_in_top10/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }

  var response = await api.get(url);
  return response.data.competitors_with_sales_in_top10_count;
};

export const getAverageProductsPerManufacturer = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/average_products_per_manufacturer`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/average_products_per_manufacturer/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }

  var response = await api.get(url);
  return response.data.average_products_per_manufacturer;
};

export const getAverageProductsPerManufacturerWithSales = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/average_products_per_manufacturer_with_sales`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/average_products_per_manufacturer_with_sales/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }

  var response = await api.get(url);
  return response.data.average_products_per_manufacturer_with_sales;
};

export const getAverageProductsPerManufacturerWithSalesAll = async (catId: string, startDate?: string, endDate?: string) => {
  if (catId == 'all') {
    var url = `api/average_products_per_manufacturer_with_sales_in_top10`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
  }else {
    var url = `api/average_products_per_manufacturer_with_sales_in_top10/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
  }

  var response = await api.get(url);
  return response.data.average_products_per_manufacturer_with_sales_in_top10;
};