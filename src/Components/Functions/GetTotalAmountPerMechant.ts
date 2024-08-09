import { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import api from "../../Config/AxiosConfig";

export const fetchTotalAmounts = async (analyticsParam: IAnalyticProps): Promise<{ [key: string]: number }> => {
  try {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/Analytics/GetTotalAmountPerMechant`,
      data: analyticsParam,
    };

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error
  }
};