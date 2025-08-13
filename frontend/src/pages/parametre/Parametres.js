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
import { useAuth } from "../../context/AuthContext";
import IR from "./IR";
import CNSS from "./CNSS";

export default function Parametres() {
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({ reference: "", designation: "", id: null });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const { permissions } = useAuth();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchDepartements = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get("http://localhost:8000/api/departements");
      setDepartements(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des départements :", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartements();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ reference: "", designation: "", id: null });
    setErrors({});
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/departements/${form.id}`, form);
        setSnackbarMessage("Département modifié avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        await axios.post("http://localhost:8000/api/departements", form);
        setSnackbarMessage("Département ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      fetchDepartements();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
        setSnackbarMessage(form.id ? "Erreur lors de la modification !" : "Erreur lors d'ajout !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleEdit = (dep) => {
    setForm(dep);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/departements/${selectedDeleteId}`);
      fetchDepartements();
      setSnackbarMessage("Département supprimé avec succès !");
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

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredDepartements = departements.filter(
    (dep) =>
      dep.reference.toLowerCase().includes(searchText.toLowerCase()) ||
      dep.designation.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { Header: "Référence", accessor: "reference" },
    { Header: "Désignation", accessor: "designation" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {permissions.find((p) => p.entity === "departement")?.can_update === 1 && (
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
          {permissions.find((p) => p.entity === "departement")?.can_delete === 1 && (
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
                onClick={() => handleDeleteClick(row.original.id)}
                variant="text"
                size="large"
                sx={{ ml: 1 }}
              >
                <Icon sx={{ color: "error.main" }}>delete</Icon>
              </Button>
            </Tooltip>
          )}
          <Tooltip
            title="details"
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
              onClick={() => navigate(`/departements/${row.original.reference}`)}
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

  if (loadError || departements.length === 0) {
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
        <Grid container spacing={3}>
          <IR />
          <CNSS />
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
