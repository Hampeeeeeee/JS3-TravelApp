// Define the structure of URL parameters used in the application
export type UrlParams = {
  page: number;
  pageSize: number;
  query: string;
  region?: string;
};