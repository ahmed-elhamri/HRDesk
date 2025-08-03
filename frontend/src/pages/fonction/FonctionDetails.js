/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Card,
  Tooltip,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  DialogActions,
  CircularProgress,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "../../examples/Tables/DataTable";
import { useAuth } from "../../context/AuthContext";

export default function FonctionDetails() {
  const { permissions } = useAuth();
  const { reference } = useParams();
  const [fonction, setFonction] = useState(null);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ reference: "", designation: "", service_id: "" });
  const [fetchError, setFetchError] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchFonction = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/fonctions/reference/${reference}`);
      setFonction(res.data);
      setForm({
        reference: res.data.reference,
        designation: res.data.designation,
        service_id: res.data.service?.id || "",
      });
    } catch {
      setFonction(null);
      setFetchError(true);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Error loading services:", err);
      setFetchError(true);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError(false);
      await Promise.all([fetchFonction(), fetchServices()]);
      setLoading(false);
    };
    load();
  }, [reference]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({});
    if (fonction) {
      setForm({
        reference: fonction.reference,
        designation: fonction.designation,
        departement_id: fonction.service?.id || "",
      });
    }
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/fonctions/${fonction.id}`, form);
      setFonction(res.data);
      setOpen(false);
      setSnackbarMessage("Fonction modifié avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      if (reference !== form.reference) {
        navigate(`/fonctions/details/${form.reference}`);
      } else {
        fetchFonction();
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const columns = [
    { Header: "Matricule", accessor: "matricule" },
    { Header: "Nom", accessor: "nom" },
    { Header: "Prenom", accessor: "prenom" },
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
            onClick={() => navigate(`/employes/${row.original.matricule}`)}
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

  if (fetchError || !fonction) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Une erreur est survenue ou le fonction est introuvable.
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
                <MDTypography variant="h4">Détails du Fonction</MDTypography>
                {permissions.find((p) => p.entity === "fonction")?.can_update === 1 && (
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
                )}
              </MDBox>
              <MDTypography>
                <strong>Référence:</strong> {fonction.reference}
              </MDTypography>
              <MDTypography>
                <strong>Désignation:</strong> {fonction.designation}
              </MDTypography>
              <MDTypography>
                <strong>Service:</strong> {fonction.service?.designation || "Non défini"}
              </MDTypography>
              <MDTypography>
                <strong>Département:</strong>{" "}
                {fonction.service?.departement?.designation || "Non défini"}
              </MDTypography>
            </Card>
          </Grid>
          {permissions.find((p) => p.entity === "employe")?.can_read === 1 && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h5" mb={2}>
                  Employés liés
                </MDTypography>
                <DataTable
                  table={{ columns, rows: fonction.employes || [] }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </Card>
            </Grid>
          )}
        </Grid>
      </MDBox>

      {/* Dialog: Modifier fonction */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Modifier Fonction</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={services}
            getOptionLabel={(option) => option.designation}
            value={services.find((service) => service.id === form.service_id) || null}
            onChange={(e, newValue) =>
              setForm({ ...form, service_id: newValue ? newValue.id : "" })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service"
                margin="normal"
                error={Boolean(errors.service_id)}
                helperText={errors.service_id?.[0] || ""}
              />
            )}
            sx={{ mb: 2 }}
          />

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
