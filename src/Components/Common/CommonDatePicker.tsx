import { TextFieldProps, TextField } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'



export interface CustomDatePicker{
    selectedDate: Dayjs | null;
    setSelected: React.Dispatch<React.SetStateAction<Dayjs | null>>;
    disable: boolean;
}

const CustomDatePicker = ({
    selectedDate,
    setSelected,
    disable,

}:CustomDatePicker) => {
    return(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker 
                inputFormat="MMM DD, YYYY"
                value={selectedDate} 
                onChange={setSelected}
                disabled={disable}
                disableMaskedInput renderInput={(params: TextFieldProps) => (
                <TextField 
                    size="small" {...params} 
                    sx={{"& .MuiOutlinedInput-root": {"& fieldset": {
                        borderRadius: "40px",},},"& .MuiOutlinedInput-input": { 
                            color: "#1C2C5A", 
                            fontFamily: "Inter", 
                            fontWeight: "bold", 
                            fontSize: "14px", 
                            width: "225px",},}}/>)}/>
            </LocalizationProvider>
    )
}
export default CustomDatePicker;