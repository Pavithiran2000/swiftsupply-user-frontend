import axiosInstance from "./axiosInstance";

export const Api = {
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get("/api/categories/list");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch categories. Please try again.");
    }
  },

  getAllBrands: async (productType: string) => {
    try {
      const response = await axiosInstance.get("/api/brands/list/" + productType);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch brands. Please try again.");
    }
  },

  getAllProductTypes: async (categoryId: string) => {
    try {
      const response = await axiosInstance.get(`/api/product-types/list/${categoryId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Failed to fetch product types. Please try again.");
    }
  }

 



};
export default Api;
