/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Icon,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

export default function DepartementDetails() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [departement, setDepartement] = useState(null);
  const [form, setForm] = useState({ reference: "", designation: "" });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", etc.

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchDepartement = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await axios.get(`http://localhost:8000/api/departements/reference/${reference}`);
      setDepartement(res.data);
      setForm({ reference: res.data.reference, designation: res.data.designation });
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartement();
  }, [reference]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({});
    setForm({ reference: departement.reference, designation: departement.designation });
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/departements/${departement.id}`, form);
      setDepartement(res.data);
      setOpen(false);
      setSnackbarMessage("Département modifié avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      if (reference !== form.reference) {
        navigate(`/departements/details/${form.reference}`);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        setSnackbarMessage("Erreur lors de la modification !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const columns = [
    { Header: "Référence", accessor: "reference" },
    { Header: "Désignation", accessor: "designation" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <Tooltip
          title="Voir détails"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: "rgba(123, 128, 154, 0.8)",
                color: "#fff",
                fontSize: "0.8rem",
              },
            },
          }}
        >
          <Button
            variant="text"
            color="secondary"
            size="large"
            onClick={() => navigate(`/services/details/${row.original.reference}`)}
          >
            <Icon>info</Icon>
          </Button>
        </Tooltip>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (notFound || !departement) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Département introuvable ou une erreur est survenue.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <MDTypography variant="h4">Détails du Département</MDTypography>
                <Tooltip
                  title="Modifier"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "rgba(26, 115, 232, 0.8)",
                        color: "#fff",
                        fontSize: "0.8rem",
                      },
                    },
                  }}
                >
                  <Button variant="contained" color="primary" onClick={handleOpen}>
                    <Icon sx={{ color: "#fff" }}>edit</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              <MDTypography>
                <strong>Référence:</strong> {departement.reference}
              </MDTypography>
              <MDTypography>
                <strong>Désignation:</strong> {departement.designation}
              </MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ p: 2 }}>
              <MDTypography variant="h5" mb={2}>
                Services liés
              </MDTypography>
              <DataTable
                table={{ columns, rows: departement.services || [] }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog: Modifier Département */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Modifier Département</DialogTitle>
        <DialogContent>
          <TextField
            label="Référence"
            name="reference"
            fullWidth
            margin="normal"
            value={form.reference}
            onChange={handleChange}
            error={Boolean(errors.reference)}
            helperText={errors.reference?.[0] || ""}
          />
          <TextField
            label="Désignation"
            name="designation"
            fullWidth
            margin="normal"
            value={form.designation}
            onChange={handleChange}
            error={Boolean(errors.designation)}
            helperText={errors.designation?.[0] || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ color: "#fff" }}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
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
