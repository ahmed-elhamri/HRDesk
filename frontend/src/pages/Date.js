import TextField from "@mui/material/TextField";

export default function Date() {
  return (
    <TextField
      label="Select Month"
      type="month"
      InputLabelProps={{ shrink: true }}
      onChange={(e) => {
        console.log(e.target.value);
      }}
    />
  );
}
