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
  Autocomplete,
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
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({
    reference: "",
    designation: "",
    departement_id: "",
    id: null,
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", etc.

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchData = async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const [resServices, resDepartements] = await Promise.all([
        axios.get("http://localhost:8000/api/services"),
        axios.get("http://localhost:8000/api/departements"),
      ]);
      setServices(resServices.data);
      setDepartements(resDepartements.data);
    } catch (error) {
      console.error("Error fetching services or departments:", error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ reference: "", designation: "", departement_id: "", id: null });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/services/${form.id}`, form);
        setSnackbarMessage("Service modifié avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        await axios.post("http://localhost:8000/api/services", form);
        setSnackbarMessage("Service ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      fetchData();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        if (form.id) {
          setSnackbarMessage("Erreur lors de la modification !");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage("Erreur lors d'ajout !");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleEdit = (service) => {
    setForm(service);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/services/${id}`);
      fetchData();
      setSnackbarMessage("Service supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.reference.toLowerCase().includes(searchText.toLowerCase()) ||
      service.designation.toLowerCase().includes(searchText.toLowerCase()) ||
      (service.departement?.designation || "").toLowerCase().includes(searchText.toLowerCase());

    const matchesDepartement = selectedDepartement
      ? service.departement_id === selectedDepartement.id
      : true;

    return matchesSearch && matchesDepartement;
  });

  const columns = [
    { Header: "Département", accessor: "departement.designation" },
    { Header: "Référence", accessor: "reference" },
    { Header: "Désignation", accessor: "designation" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Tooltip
            title="modifier"
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
            <Button
              onClick={() => handleEdit(row.original)}
              variant="text"
              color="primary"
              size="large"
            >
              <Icon>edit</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title="supprimer"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "rgba(244, 67, 53, 0.8)",
                  color: "#fff",
                  fontSize: "0.8rem",
                },
              },
            }}
          >
            <Button
              onClick={() => handleDelete(row.original.id)}
              variant="text"
              size="large"
              sx={{ ml: 1 }}
            >
              <Icon sx={{ color: "error.main" }}>delete</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title="détails"
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
              onClick={() => navigate(`/services/${row.original.reference}`)}
              variant="text"
              color="secondary"
              size="large"
              sx={{ ml: 1 }}
            >
              <Icon>info</Icon>
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  // Show loading spinner
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

  // Show error message
  if (fetchError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Une erreur est survenue lors du chargement des données.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <MDTypography variant="h6" color="white">
                  Services
                </MDTypography>
                <Tooltip title="ajouter">
                  <Button onClick={handleOpen} variant="contained" color="success">
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              {/* Filters */}
              <MDBox px={2} py={2} display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
                <TextField
                  label="Recherche"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ width: 200 }}
                />
                <Autocomplete
                  options={departements}
                  getOptionLabel={(option) => option.designation}
                  value={selectedDepartement}
                  onChange={(e, newValue) => setSelectedDepartement(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Filtrer par département" size="small" />
                  )}
                  sx={{ width: 250 }}
                />
                <Tooltip title="effacer les filtres">
                  <Button
                    variant="text"
                    size="medium"
                    color="secondary"
                    onClick={() => {
                      setSearchText("");
                      setSelectedDepartement(null);
                    }}
                  >
                    <Icon>filter_alt_off</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              <MDBox pt={2}>
                <DataTable
                  table={{ columns, rows: filteredServices }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{form.id ? "Modifier service" : "Ajouter service"}</DialogTitle>
        <DialogContent>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Autocomplete
              options={departements}
              sx={{ mb: 2 }}
              getOptionLabel={(option) => option.designation}
              value={departements.find((dep) => dep.id === form.departement_id) || null}
              onChange={(event, newValue) => {
                setForm({ ...form, departement_id: newValue ? newValue.id : "" });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Département"
                  error={Boolean(errors.departement_id)}
                  helperText={errors.departement_id?.[0] || ""}
                />
              )}
            />
          </Grid>

          {["reference", "designation"].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                name={field}
                sx={{ mb: 2 }}
                label={field.toUpperCase()}
                value={form[field]}
                onChange={handleChange}
                error={Boolean(errors[field])}
                helperText={errors[field]?.[0] || ""}
              />
            </Grid>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {form.id ? "Modifier" : "Ajouter"}
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
