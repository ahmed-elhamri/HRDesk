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
  MenuItem,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "./http";

export default function EmployePrimes({ employe_id }) {
  const { permissions } = useAuth();
  const [employePrimes, setEmployePrimes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [primes, setPrimes] = useState([]);
  const [form, setForm] = useState({
    employe_id: employe_id,
    prime_id: "",
    montant: "",
    id: null,
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [expandedMotifs, setExpandedMotifs] = useState({});
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Confirmation delete state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const toggleMotif = (id) => {
    setExpandedMotifs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  const fetchData = async (id) => {
    setLoading(true);
    setLoadError(false);
    try {
      const [epRes, primesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/employe-primes", {
          params: { employe_id: id },
        }),
        axios.get("http://localhost:8000/api/primes"),
      ]);
      setEmployePrimes(epRes.data);
      setPrimes(primesRes.data);
    } catch (error) {
      console.error("Erreur de chargement :", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!employe_id) return;
    let ignore = false;
    const controller = new AbortController();
    fetchData(employe_id);
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [employe_id]);
  useEffect(() => {
    fetchData(employe_id);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ employe_id: employe_id, prime_id: "", montant: "", id: null });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/employe-primes/${form.id}`, form);
        setSnackbarMessage("Prime modifié avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        await axios.post("http://localhost:8000/api/employe-primes", form);
        setSnackbarMessage("Prime ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      fetchData(employe_id);
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setSnackbarMessage("Erreur lors de l'ajout !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        // if (err.response.data.message?.includes("plafond")) {
        //   setSnackbarMessage("Montant dépasse le plafond autorisé pour ce prime");
        //   setSnackbarSeverity("warning");
        //   setSnackbarOpen(true);
        // }
      }
    }
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/employe-primes/${deleteId}`);
      fetchData(employe_id);
      setSnackbarMessage("Prime supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Erreur de suppression :", err);
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      Header: "Motif",
      accessor: "prime.motif",
      Cell: ({ row }) => {
        const id = row.original.id;
        const fullText = row.original.prime.motif || "";
        const isExpanded = expandedMotifs[id];
        return (
          <div>
            {isExpanded ? fullText : truncateText(fullText)}
            {fullText.length > 30 && (
              <Button
                variant="text"
                size="small"
                onClick={() => toggleMotif(id)}
                sx={{ ml: 1, textTransform: "none" }}
              >
                {isExpanded ? "Lire moins" : "Lire plus"}
              </Button>
            )}
          </div>
        );
      },
    },
    { Header: "Montant", accessor: "montant" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {permissions.find((p) => p.entity === "prime")?.can_update === 1 && (
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
          )}
          {permissions.find((p) => p.entity === "prime")?.can_delete === 1 && (
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
                onClick={() => confirmDelete(row.original.id)}
                variant="text"
                size="large"
                sx={{ ml: 1 }}
              >
                <Icon sx={{ color: "error.main" }}>delete</Icon>
              </Button>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <MDBox pt={6} pb={3} textAlign="center">
        <CircularProgress />
      </MDBox>
    );
  }

  if (loadError) {
    return (
      <MDBox pt={6} pb={3} textAlign="center">
        <Typography variant="h6" color="error">
          Aucune donnée trouvée ou une erreur est survenue.
        </Typography>
      </MDBox>
    );
  }

  return (
    <Grid>
      <MDBox>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox py={1}>
                <MDBox sx={{ display: "flex", justifyContent: "flex-end", margin: 1 }}>
                  {permissions.find((p) => p.entity === "prime")?.can_create === 1 && (
                    <Tooltip title="ajouter">
                      <Button onClick={handleOpen} variant="contained" color="info">
                        <Icon sx={{ color: "info.main" }}>add</Icon>
                      </Button>
                    </Tooltip>
                  )}
                </MDBox>
                <DataTable
                  table={{ columns, rows: employePrimes }}
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

      {/* Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{form.id ? "Modifier" : "Ajouter"} Prime</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={primes}
                getOptionLabel={(option) => option.motif}
                value={primes.find((p) => p.id === form.prime_id) || null}
                onChange={(e, newValue) =>
                  setForm({ ...form, prime_id: newValue ? newValue.id : "" })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prime"
                    error={Boolean(errors.prime_id)}
                    helperText={errors.prime_id?.[0]}
                  />
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="montant"
                label="Montant"
                value={form.montant}
                onChange={handleChange}
                error={Boolean(errors.montant)}
                helperText={errors.montant?.[0]}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cette prime ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="text"
            color="error"
            sx={{ color: "error.main" }}
          >
            Supprimer
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
    </Grid>
  );
}
