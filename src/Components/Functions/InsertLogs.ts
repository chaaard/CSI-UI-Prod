import { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import api from "../../Config/AxiosConfig";

export const insertLogs = async (analyticsParam: IAnalyticProps) => {
  try {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/Analytics/InsertLogs`,
      data: analyticsParam,
    };

    await api(config)
  } catch (error) {
    console.error("Error inserting logs:", error);
  } 
};