import axios, { AxiosRequestConfig } from "axios";
import ITransactionProps from "../../Pages/Common/Interface/ITransactionProps";
import ITransactions from "../../Pages/Common/Interface/ITransaction";

export const fetchTotalAmountTransactions = async (transactionParams: ITransactionProps):Promise<{ [key: string]: ITransactions }> => {
  const { REACT_APP_API_ENDPOINT } = process.env;

  try {
    const getTransactions: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Adjustment/GetTotalCountAmount`,
      data: transactionParams,
    };
    const response = await axios(getTransactions);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error
  }
};