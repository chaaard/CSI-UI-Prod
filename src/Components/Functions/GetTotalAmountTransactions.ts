import { AxiosRequestConfig } from "axios";
import ITransactionProps from "../../Pages/_Interface/ITransactionProps";
import ITransactions from "../../Pages/_Interface/ITransaction";
import api from "../../Config/AxiosConfig";

export const fetchTotalAmountTransactions = async (transactionParams: ITransactionProps): Promise<{ [key: string]: ITransactions }> => {
  try {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: `/Adjustment/GetTotalCountAmount`,
      data: transactionParams,
    };
    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Propagate the error
  }
};