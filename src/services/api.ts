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



export const getHealthScore = async (catId: string, fabId:string, startDate?: string, endDate?: string,in_top_10_stores?:boolean) => {
  // console.log("start date",startDate);
  // console.log("end date",endDate);
  
  if (catId == 'all') {
    var url = `api/manufacturer_avg_sales_share_per_store/${fabId}`;
    if (startDate && endDate) {
      url = url+`/?&start_date=${startDate}&end_date=${endDate}`
    }
    if (in_top_10_stores) {
      url = url+`/?&in_top_10_stores=${in_top_10_stores}`
    }
  }else {
    var url = `api/manufacturer_avg_sales_share_per_store/${fabId}/?&cat_id=${catId}`;
    if (startDate && endDate) {
      url = url+`&start_date=${startDate}&end_date=${endDate}`
    }
    if (in_top_10_stores) {
      url = url+`&in_top_10_stores=${in_top_10_stores}`
    }
  }
  const response = await api.get(url);
  // console.log(url,response.data);
  
  return response.data.manufacturer_avg_sales_share_per_store;
};

export const getCategoriesParts = async () => {
  const response = await api.get(`/api/sales_by_category`);
  return response.data.sales_by_category;
};
export const getCategoriesPartsManufacturer = async (fabId:string) => {
  const response = await api.get(`/api/sales_by_category_for_manufacturer/${fabId}`);
  return response.data.sales_by_category_for_manufacturer;
};

export const getTopStores = async (category: string,manufacturer: string) => {
  
  var url = '/api/top_10_per_cat_part_fabricant/'+category+'/'+manufacturer;
  if (category === 'all') {
    url = '/api/top_10_all_cat_part_fabricant/'+manufacturer;
  }
  const response = await api.get(url);
  return response.data.top_10_stores;
};

export const getTopManufacturerShare = async (catId: string,inTop10:boolean) => {
  var url
  if (catId === 'all') {
    url = `/api/manufacturer_sales_per_cat`;
    if (inTop10 ) {
      url = url+`/?&in_top_10=${inTop10}`
    }
  }else{
    url = `/api/manufacturer_sales_per_cat/?&cat_id=${catId}`;
    if (inTop10 ) {
      url = url+`&in_top_10=${inTop10}`
    }
  }
  const response = await api.get(url);
  
  return response.data.manufacturer_sales;
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

export const getAverageProductsPerManufacturer = async (catId: string, startDate?: string, endDate?: string, fabId?: string) => {
  var url = `api/average_products_per_manufacturer`;
  if (catId !== 'all') {
    url = `api/average_products_per_manufacturer/?&cat_id=${catId}`;
  }
  if (fabId) {
    url = url.includes('?') ? url + `&fab_id=${fabId}` : url + `/?&fab_id=${fabId}`;
  }
  if (startDate && endDate) {
    url = url.includes('?') ? url + `&start_date=${startDate}&end_date=${endDate}` : url + `/?&start_date=${startDate}&end_date=${endDate}`;
  }
  var response = await api.get(url);
  return response.data.average_products_per_manufacturer;
};

export const getAverageProductsPerManufacturerWithSales = async (catId: string, startDate?: string, endDate?: string, fabId?: string) => {
  var url = `api/average_products_per_manufacturer_with_sales`;
  if (catId !== 'all') {
    url = `api/average_products_per_manufacturer_with_sales/?&cat_id=${catId}`;
  }
  if (fabId) {
    url = url.includes('?') ? url + `&fab_id=${fabId}` : url + `/?&fab_id=${fabId}`;
  }
  if (startDate && endDate) {
    url = url.includes('?') ? url + `&start_date=${startDate}&end_date=${endDate}` : url + `/?&start_date=${startDate}&end_date=${endDate}`;
  }
  var response = await api.get(url);
  return response.data.average_products_per_manufacturer_with_sales;
};

export const getAverageProductsPerManufacturerWithSalesAll = async (catId: string, startDate?: string, endDate?: string, fabId?: string) => {
  var url = `api/average_products_per_manufacturer_with_sales_in_top10`;
  if (catId !== 'all') {
    url = `api/average_products_per_manufacturer_with_sales_in_top10/?&cat_id=${catId}`;
  }
  if (fabId) {
    url = url.includes('?') ? url + `&fab_id=${fabId}` : url + `/?&fab_id=${fabId}`;
  }
  if (startDate && endDate) {
    url = url.includes('?') ? url + `&start_date=${startDate}&end_date=${endDate}` : url + `/?&start_date=${startDate}&end_date=${endDate}`;
  }
  var response = await api.get(url);
  return response.data.average_products_per_manufacturer_with_sales_in_top10;
};