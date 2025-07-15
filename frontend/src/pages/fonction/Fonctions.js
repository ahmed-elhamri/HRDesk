/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function Fonctions() {
  const [fonctions, setFonctions] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ reference: "", designation: "", service_id: "", id: null });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchFonctions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fonctions");
      setFonctions(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des fonctions :", error);
      setLoadError(true);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/services");
      setServices(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des services :", error);
      setLoadError(true);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadError(false);
      await Promise.all([fetchFonctions(), fetchServices()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ reference: "", designation: "", service_id: "", id: null });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/fonctions/${form.id}`, form);
      } else {
        await axios.post("http://localhost:8000/api/fonctions", form);
      }
      await fetchFonctions();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleEdit = (fonction) => {
    setForm(fonction);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/fonctions/${id}`);
    fetchFonctions();
  };

  const filteredFonctions = useMemo(() => {
    return fonctions.filter((f) => {
      const matchSearch =
        f.reference.toLowerCase().includes(searchText.toLowerCase()) ||
        f.designation.toLowerCase().includes(searchText.toLowerCase()) ||
        (f.service?.designation || "").toLowerCase().includes(searchText.toLowerCase());

      const matchService = selectedService ? f.service_id === selectedService.id : true;

      return matchSearch && matchService;
    });
  }, [fonctions, searchText, selectedService]);

  const columns = [
    { Header: "Département", accessor: "service.departement.designation" },
    { Header: "Service", accessor: "service.designation" },
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
              color="error"
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
              onClick={() => navigate(`/fonctions/details/${row.original.reference}`)}
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

  // Show loading spinner page if loading
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

  // Show error message page if error or no data
  if (loadError || fonctions.length === 0) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Aucune donnée trouvée ou une erreur est survenue.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

  // Main render when data loaded without error
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
              >
                <MDTypography variant="h6" color="white">
                  Fonctions
                </MDTypography>
                <Tooltip title="ajouter">
                  <Button onClick={handleOpen} variant="contained" color="success">
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              <MDBox px={2} py={2} display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
                <TextField
                  label="Recherche"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ width: 200 }}
                />
                <Autocomplete
                  options={services}
                  getOptionLabel={(option) => option.designation}
                  value={selectedService}
                  onChange={(e, newValue) => setSelectedService(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Filtrer par service" size="small" />
                  )}
                  sx={{ width: 250 }}
                />
                <Tooltip title="effacer les filtres">
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={() => {
                      setSearchText("");
                      setSelectedService(null);
                    }}
                  >
                    <Icon>filter_alt_off</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              <MDBox pt={2}>
                <DataTable
                  table={{ columns, rows: filteredFonctions }}
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
        <DialogTitle>{form.id ? "Modifier fonction" : "Ajouter fonction"}</DialogTitle>
        <DialogContent>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Autocomplete
              options={services}
              getOptionLabel={(option) => option.designation}
              value={services.find((s) => s.id === form.service_id) || null}
              onChange={(e, newValue) =>
                setForm({ ...form, service_id: newValue ? newValue.id : "" })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Service"
                  error={Boolean(errors.service_id)}
                  helperText={errors.service_id?.[0] || ""}
                />
              )}
            />
          </Grid>
          {["reference", "designation"].map((field) => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                sx={{ my: 2 }}
                name={field}
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
    </DashboardLayout>
  );
}
