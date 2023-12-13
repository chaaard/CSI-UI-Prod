import axios, { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/Common/Interface/IAnalyticsProps";

export const fetchTotalAmount = async (analyticsParam: IAnalyticProps): Promise<number> => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  try {
    const getAnalytics: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/GetTotalAmountPerMechant`,
      data: analyticsParam,
    };

    const response = await axios(getAnalytics);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error
  }
};