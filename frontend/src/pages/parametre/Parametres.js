/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Icon,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";

export default function Parametres() {
  const periode = localStorage.getItem("periode");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [mois, setMois] = useState(() => {
    return periode;
  });
  const addMonthsToPeriod = (period, months = 1) => {
    const [y, m] = period.split("-").map(Number); // y=2025, m=8
    const d = new Date(y, m - 1 + months, 1); // safe rollover (handles year change)
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  };
  const [moisVers, setMoisVers] = useState(() => {
    return addMonthsToPeriod(periode);
  });

  const getFrenchMonthName = (m) => {
    const date = new Date(`${m}-01T00:00:00`); // pad a day
    return new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date); // "août"
  };
  const movePeriod = () => {
    localStorage.setItem("periode", mois);
    window.location.reload();
  };

  const mergeEmployes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/merge-employes", {
        params: { periodeDe: mois, periodeVers: moisVers },
      });
      if (res?.status === 201) {
        setSnackbarMessage(res.data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (e) {
      if (e.response?.status === 422) {
        setSnackbarMessage(e.response.data.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* User Info */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Période
          </Typography>
          <Grid container spacing={3} marginTop={1}>
            <Grid item xs={6}>
              <TextField
                type="month"
                label="Mois"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={movePeriod}
                sx={{ color: "#fff" }}
              >
                Passer à {getFrenchMonthName(mois)}
              </Button>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Transfer des employés
          </Typography>
          <Grid container spacing={3} marginTop={1}>
            <Grid item xs={4}>
              <TextField
                type="month"
                label="De"
                value={mois}
                onChange={(e) => setMois(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="month"
                label="Vers"
                value={moisVers}
                onChange={(e) => setMoisVers(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={mergeEmployes}
                sx={{ color: "#fff" }}
              >
                transférer les employés de {getFrenchMonthName(mois)} vers{" "}
                {getFrenchMonthName(moisVers)}
              </Button>
            </Grid>
          </Grid>
        </Card>
      </MDBox>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
