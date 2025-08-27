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
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchAdmins = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get("http://localhost:8000/api/admins");
      setAdmins(res.data);
    } catch (error) {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ email: "" });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/api/admins", form);
      fetchAdmins();
      handleClose();
      setSnackbarMessage("Admin ajouté avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const confirmDelete = (id) => {
    setAdminToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/admins/${adminToDelete}`);
      fetchAdmins();
      setSnackbarMessage("Admin supprimé avec succès !");
      setSnackbarSeverity("success");
    } catch {
      setSnackbarMessage("Erreur lors de la suppression d'admin");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setConfirmDialogOpen(false);
      setAdminToDelete(null);
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/reset-password/${id}`);
      setSnackbarMessage("Mot de passe réinitialisé avec succès !");
      setSnackbarSeverity("success");
    } catch {
      setSnackbarMessage("Erreur lors de la réinitialisation du mot de passe.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { Header: "Email", accessor: "email" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          <Tooltip
            title="Réinitialiser le mot de passe"
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
              onClick={() => handleResetPassword(row.original.id)}
              variant="text"
              size="large"
              color="info"
            >
              <Icon>lock_reset</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title="Supprimer"
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
          <Tooltip
            title="Permissions"
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
              onClick={() => navigate(`/admins/${row.original.id}`)}
              variant="text"
              size="large"
              color="info"
            >
              <Icon>back_hand</Icon>
            </Button>
          </Tooltip>
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

  if (loadError || !admins.length) {
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
                  Admins
                </MDTypography>
                <Tooltip title="Ajouter">
                  <Button onClick={handleOpen} variant="contained" color="success">
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
              </MDBox>

              <MDBox px={2} py={2} display="flex" justifyContent="flex-end">
                <TextField
                  label="Recherche Email"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ width: 250 }}
                />
              </MDBox>

              <MDBox pt={2}>
                <DataTable
                  table={{ columns, rows: filteredAdmins }}
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

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Ajouter Admin</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email?.[0] || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: "#fff" }}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Êtes-vous sûr de vouloir supprimer cet admin ?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirmed}
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
    </DashboardLayout>
  );
}
