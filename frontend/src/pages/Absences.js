/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout";
import { setAuthToken } from "./http";

export default function Absences() {
  const [items, setItems] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    employe_id: "",
    date: "",
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const { permissions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const baseUrl = "http://localhost:8000/api/absences";
  const employesUrl = "http://localhost:8000/api/employes";

  const fetchItems = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [absencesRes, employesRes] = await Promise.all([
        axios.get(baseUrl),
        axios.get(employesUrl),
      ]);
      setItems(absencesRes.data || []);
      setEmployes(employesRes.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ id: null, employe_id: "", date: "" });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`${baseUrl}/${form.id}`, form);
        setSnackbarMessage("Absence modifiée avec succès !");
      } else {
        await axios.post(baseUrl, form);
        setSnackbarMessage("Absence ajoutée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchItems();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        setSnackbarMessage(
          form.id ? "Erreur lors de la modification !" : "Erreur lors de l'ajout !"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      employe_id: row.employe_id ?? "",
      date: row.date ?? "",
    });
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/${selectedDeleteId}`);
      fetchItems();
      setSnackbarMessage("Absence supprimée avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleDateSearchChange = (e) => setSearchDate(e.target.value);

  const filteredRows = useMemo(() => {
    return items.filter((r) => {
      const matchText =
        r.employe?.nom?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.employe?.prenom?.toLowerCase().includes(searchText.toLowerCase()) ||
        String(r.employe_id).includes(searchText);
      const matchDate = searchDate ? r.date === searchDate : true;
      return matchText && matchDate;
    });
  }, [items, searchText, searchDate]);

  const columns = [
    {
      Header: "Employé",
      accessor: (row) => `${row.employe?.nom ?? ""} ${row.employe?.prenom ?? ""}`,
    },
    { Header: "Date", accessor: "date" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {permissions.find((p) => p.entity === "absence")?.can_update === 1 && (
            <Tooltip title="modifier">
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
          {permissions.find((p) => p.entity === "absence")?.can_delete === 1 && (
            <Tooltip title="supprimer">
              <Button
                onClick={() => handleDeleteClick(row.original.id)}
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
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (loadError) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Une erreur est survenue lors du chargement.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                Absences
              </MDTypography>
              {permissions.find((p) => p.entity === "absence")?.can_create === 1 && (
                <Tooltip title="ajouter">
                  <Button onClick={handleOpen} variant="contained" color="success">
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
              )}
            </MDBox>

            <MDBox px={2} pt={2} display="flex" gap={2} justifyContent="flex-end">
              <TextField
                label="Rechercher par employé"
                variant="outlined"
                size="small"
                value={searchText}
                onChange={handleSearchChange}
                sx={{ width: 250 }}
              />
              <TextField
                type="date"
                label="Filtrer par date"
                variant="outlined"
                size="small"
                value={searchDate}
                onChange={handleDateSearchChange}
                InputLabelProps={{ shrink: true }}
              />
            </MDBox>

            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows: filteredRows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </MDBox>
          </Card>

          <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{form.id ? "Modifier" : "Ajouter"}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    select
                    fullWidth
                    name="employe_id"
                    value={form.employe_id}
                    onChange={handleChange}
                    error={Boolean(errors.employe_id)}
                    helperText={errors.employe_id?.[0] || ""}
                    SelectProps={{ native: true }}
                  >
                    <option value="">-- Choisir un employé --</option>
                    {employes.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nom} {emp.prenom}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date"
                    label="Date"
                    value={form.date}
                    onChange={handleChange}
                    error={Boolean(errors.date)}
                    helperText={errors.date?.[0] || ""}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Annuler</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ color: "#fff" }}
              >
                {form.id ? "Modifier" : "Ajouter"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <Typography>Êtes-vous sûr de vouloir supprimer cette absence ?</Typography>
              <Typography sx={{ color: "error.main", fontSize: "medium" }} variant="caption">
                Cette action est irréversible.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
              <Button
                onClick={confirmDelete}
                color="error"
                variant="text"
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
      </MDBox>
    </DashboardLayout>
  );
}
