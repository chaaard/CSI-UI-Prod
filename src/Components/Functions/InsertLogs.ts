import axios, { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";

export const insertLogs = async (analyticsParam: IAnalyticProps) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  try {
    const insertLogs: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/InsertLogs`,
      data: analyticsParam,
    };

    axios(insertLogs)
  } catch (error) {
    console.error("Error inserting logs:", error);
  } 
};