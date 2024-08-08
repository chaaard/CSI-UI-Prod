import axios, { AxiosRequestConfig } from "axios";
import ITransactionProps from "../../Pages/Interface/ITransactionProps";
import ITransactions from "../../Pages/Interface/ITransaction";

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