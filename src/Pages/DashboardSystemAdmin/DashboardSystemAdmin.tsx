import {
  Box,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import ITransactionProps from "../_Interface/ITransactionProps";
import { useNavigate } from "react-router-dom";
import { fetchTotalAmounts } from "../../Components/Functions/GetTotalAmountPerMechant";
import { fetchTotalAmountTransactions } from "../../Components/Functions/GetTotalAmountTransactions";
import ITransactions from "../_Interface/ITransaction";

const StyledScrollBox = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 100px);

  /* Custom Scrollbar Styles */
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #2b4b81;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const DashboardSystemAdmin = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null>(null);
  const getClub = window.localStorage.getItem("club");
  const [totalAmounts, setTotalAmounts] = useState<{
    [key: string]: number;
  } | null>(null);
  const [totalAmountCount, setTotalAmountCount] = useState<{
    [key: string]: ITransactions;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Maintenance | Dashboard";
  }, []);

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }


  useEffect(() => {
    const defaultDate = dayjs().startOf("day").subtract(1, "day");
    const dateFrom = dayjs().startOf("day").subtract(1, "day");
    const dateTo = dayjs().startOf("day");
    setSelectedDate(defaultDate);
    setSelectedDateFrom(dateFrom);
    setSelectedDateTo(dateTo);
  }, []);

  const memCodes = [
    "9999011955",
    "9999011929",
    "9999011838",
    "9999011931",
    "9999011935",
    "9999011855",
    "90999011855",
    "900999011855",
    "9999011915",
    "9999011914",
    "9999011926",
    "9999011572",
    "9999011554",
  ];

  const formattedDate = selectedDate?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const dateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const dateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        const analyticsProps = {
          dates: [formattedDate ? formattedDate : ""],
          memCode: memCodes,
          userId: "",
          storeId: [club],
        };
        const amounts = await fetchTotalAmounts(analyticsProps);
        setTotalAmounts(amounts); // Update the state with the fetched totalAmounts
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    getTotalAmounts();
  }, [formattedDate]); // Run once on component mount

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        if (dateFrom && dateTo) {
          const analyticsProps: ITransactionProps = {
            dates: [dateFrom ? dateFrom : "", dateTo ? dateTo : ""],
            memCode: memCodes,
            storeId: [club],
            statusId: [3, 5],
            actionId: [1, 2, 3, 4],
          };
          const amounts = await fetchTotalAmountTransactions(analyticsProps);
          setTotalAmountCount(amounts);
        }
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    if (dateFrom && dateTo) {
      getTotalAmounts();
    }
  }, [dateFrom, dateTo]);

  return <StyledScrollBox></StyledScrollBox>;
};

export default DashboardSystemAdmin;