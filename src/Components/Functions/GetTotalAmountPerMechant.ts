import axios, { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/Common/Interface/IAnalyticsProps";

export const fetchTotalAmounts = async (analyticsParam: IAnalyticProps): Promise<{ [key: string]: number }> => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  try {

    console.log("analyticsParam",analyticsParam);
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