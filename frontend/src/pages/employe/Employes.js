/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
  MenuItem,
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
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { setAuthToken } from "../http";

export default function Employes() {
  const { user, permissions } = useAuth();
  const [employes, setEmployes] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFonction, setSelectedFonction] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success", "error", etc.
  const navigate = useNavigate();

  // New state for delete confirmation dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    console.log(user);
  }, []);
  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const fetchEmployes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employes");
      setEmployes(res.data);
      setLoadError(false);
    } catch (error) {
      console.error("Error fetching employes:", error);
      setLoadError(true);
    }
  };

  const fetchFonctions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fonctions");
      setFonctions(res.data);
      setLoadError(false);
    } catch (error) {
      console.error("Error fetching fonctions:", error);
      setLoadError(true);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployes(), fetchFonctions()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoadingIcon(true);
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/api/import-employes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbarMessage("Les employés ont été importés avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpen(false);
      setLoadingIcon(false);
      setFile(null);
      fetchEmployes();
    } catch (err) {
      setSnackbarMessage("Erreur lors d'importation des employés !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoadingIcon(false);
    }
  };

  // Modified handleDelete to only open confirmation dialog
  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  // New function: called when deletion is confirmed
  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:8000/api/employes/${deleteId}`);
      fetchEmployes();
      setSnackbarMessage("Employé supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const columns = [
    { Header: "Matricule", accessor: "matricule" },
    {
      Header: "Nom complet",
      accessor: (row) => `${row.nom} ${row.prenom}`,
    },
    {
      Header: "fonction",
      accessor: "fonction.designation",
      Cell: ({ row }) => row.original.fonction?.designation || "",
    },
    {
      Header: "Service",
      accessor: "fonction.service.designation",
      Cell: ({ row }) => row.original.fonction?.service?.designation || "",
    },
    {
      Header: "Département",
      accessor: "fonction.service.departement.designation",
      Cell: ({ row }) => row.original.fonction?.service?.departement?.designation || "",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {permissions.find((p) => p.entity === "employe")?.can_delete === 1 && (
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
          )}
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
              onClick={() => navigate(`/employes/${row.original.matricule}`)}
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

  const filteredEmployes = useMemo(() => {
    return employes.filter((emp) => {
      const matchesSearch =
        emp.nom.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.matricule.toLowerCase().includes(searchText.toLowerCase());

      const matchesFonction = selectedFonction ? emp.fonction_id === selectedFonction.id : true;
      const matchesService = selectedService
        ? emp.fonction?.service?.id === selectedService.id
        : true;
      const matchesDepartement = selectedDepartement
        ? emp.fonction?.service?.departement?.id === selectedDepartement.id
        : true;

      return matchesSearch && matchesFonction && matchesService && matchesDepartement;
    });
  }, [employes, searchText, selectedFonction, selectedService, selectedDepartement]);

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
            Erreur lors du chargement des données.
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
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Employés
                </MDTypography>
                {permissions.find((p) => p.entity === "employe")?.can_create === 1 && (
                  <MDBox display="flex" gap={1}>
                    <Tooltip title="Ajouter employé">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => navigate("/add-employe")}
                      >
                        <Icon sx={{ color: "info.main" }}>add</Icon>
                      </Button>
                    </Tooltip>
                    <Tooltip title="importer des employés depuis Excel">
                      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
                        <Icon sx={{ color: "info.main" }}>attach_file</Icon>
                        <input
                          hidden
                          type="file"
                          onChange={(e) => setFile(e.target.files[0])}
                          accept=".xlsx,.xls"
                        />
                      </Button>
                    </Tooltip>
                  </MDBox>
                )}
              </MDBox>
              {/* Dialog */}
              <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                  Importer les employés
                  <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                  >
                    <Icon>close</Icon>
                  </IconButton>
                </DialogTitle>

                <DialogContent>
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: "2px dashed #aaa",
                      borderRadius: 2,
                      p: 4,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <Typography>Déposez le fichier ici…</Typography>
                    ) : (
                      <Typography>
                        {file ? file.name : "Glissez un fichier ici ou cliquez pour choisir"}
                      </Typography>
                    )}
                  </Box>
                </DialogContent>
                {file != null && (
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        setFile(null);
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleUpload}
                      variant="contained"
                      color="primary"
                      sx={{ color: "#fff" }}
                    >
                      {loadingIcon ? (
                        <CircularProgress size={20} sx={{ color: "#fff" }} />
                      ) : (
                        "Importer"
                      )}
                    </Button>
                  </DialogActions>
                )}
              </Dialog>
              <MDBox pt={2}>
                <MDBox
                  px={2}
                  py={2}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                  flexWrap="wrap"
                >
                  <TextField
                    label="Recherche"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={fonctions}
                    getOptionLabel={(option) => option.designation}
                    value={selectedFonction}
                    onChange={(e, val) => setSelectedFonction(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par fonction" size="small" />
                    )}
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={
                      selectedFonction
                        ? [selectedFonction.service]
                        : Array.from(new Set(fonctions.map((f) => JSON.stringify(f.service)))).map(
                            (s) => JSON.parse(s)
                          )
                    }
                    getOptionLabel={(option) => option?.designation || ""}
                    value={selectedService}
                    onChange={(e, val) => setSelectedService(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par service" size="small" />
                    )}
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={
                      selectedService
                        ? [selectedService.departement]
                        : Array.from(
                            new Set(fonctions.map((f) => JSON.stringify(f.service?.departement)))
                          ).map((d) => JSON.parse(d))
                    }
                    getOptionLabel={(option) => option?.designation || ""}
                    value={selectedDepartement}
                    onChange={(e, val) => setSelectedDepartement(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par département" size="small" />
                    )}
                    sx={{ width: 230 }}
                  />

                  <Button
                    variant="text"
                    onClick={() => {
                      setSearchText("");
                      setSelectedFonction(null);
                      setSelectedService(null);
                      setSelectedDepartement(null);
                    }}
                  >
                    <Icon>filter_alt_off</Icon>
                  </Button>
                </MDBox>

                <DataTable
                  table={{
                    columns,
                    rows: filteredEmployes,
                  }}
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

      {/* New Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirmation</DialogTitle>
        <DialogContent>
          <Typography id="confirm-delete-description" sx={{ mt: 1 }}>
            Êtes-vous sûr de vouloir supprimer cet employé ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Annuler</Button>
          <Button
            onClick={handleDeleteConfirmed}
            variant="text"
            color="error"
            sx={{ color: "error.main" }}
          >
            Confirmer la suppression
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
