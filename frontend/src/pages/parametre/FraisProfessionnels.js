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
  MenuItem,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function FraisProfessionnels() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    id: null,
    type: "",
    min_sbi: "",
    max_sbi: "",
    taux: "",
    plafond: "",
  });
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

  const baseUrl = "http://localhost:8000/api/frais-professionnels";

  const fetchItems = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get(baseUrl);
      setItems(res.data || []);
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
    setForm({ id: null, type: "", min_sbi: "", max_sbi: "", taux: "", plafond: "" });
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
        setSnackbarMessage("Élément modifié avec succès !");
      } else {
        await axios.post(baseUrl, form);
        setSnackbarMessage("Élément ajouté avec succès !");
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
      type: row.type ?? "",
      min_sbi: row.min_sbi ?? "",
      max_sbi: row.max_sbi ?? "",
      taux: row.taux ?? "",
      plafond: row.plafond ?? "",
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
      setSnackbarMessage("Élément supprimé avec succès !");
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

  const textMatch = (val) =>
    (val ?? "").toString().toLowerCase().includes(searchText.toLowerCase());

  const filteredRows = items.filter(
    (r) =>
      textMatch(r.type) ||
      textMatch(r.min_sbi) ||
      textMatch(r.max_sbi) ||
      textMatch(r.taux) ||
      textMatch(r.plafond)
  );

  const columns = [
    { Header: "Type", accessor: "type" },
    { Header: "Min SBI", accessor: "min_sbi" },
    {
      Header: "Max SBI",
      accessor: "max_sbi",
      Cell: ({ value }) => (value ? value : "-"),
    },
    { Header: "Taux (%)", accessor: "taux" },
    {
      Header: "Plafond",
      accessor: "plafond",
      Cell: ({ value }) => (value ? value : "Non Plafonné"),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {/*{permissions.find((p) => p.entity === "frais_professionnel")?.can_update === 1 && (*/}
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
          {/*)}*/}
          {/*/!*{permissions.find((p) => p.entity === "frais_professionnel")?.can_delete === 1 && (*!/*/}
          {/*<Tooltip*/}
          {/*  title="supprimer"*/}
          {/*  componentsProps={{*/}
          {/*    tooltip: {*/}
          {/*      sx: {*/}
          {/*        backgroundColor: "rgba(244, 67, 53, 0.8)",*/}
          {/*        color: "#fff",*/}
          {/*        fontSize: "0.8rem",*/}
          {/*      },*/}
          {/*    },*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Button*/}
          {/*    onClick={() => handleDeleteClick(row.original.id)}*/}
          {/*    variant="text"*/}
          {/*    size="large"*/}
          {/*    sx={{ ml: 1 }}*/}
          {/*  >*/}
          {/*    <Icon sx={{ color: "error.main" }}>delete</Icon>*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
          {/*/!*)}*!/*/}
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

  if (loadError || items.length === 0) {
    return (
      <MDBox pt={6} pb={3} textAlign="center">
        <Typography variant="h6" color="error">
          Aucune donnée trouvée ou une erreur est survenue.
        </Typography>
      </MDBox>
    );
  }

  return (
    <Grid item xs={6}>
      <Card sx={{ height: "100%" }}>
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
            Frais Professionnels
          </MDTypography>
          {/*{permissions.find((p) => p.entity === "frais_professionnel")?.can_create === 1 && (*/}
          {/*  <Tooltip title="ajouter">*/}
          {/*    <Button onClick={handleOpen} variant="contained" color="success">*/}
          {/*      <Icon sx={{ color: "info.main" }}>add</Icon>*/}
          {/*    </Button>*/}
          {/*  </Tooltip>*/}
          {/*)}*/}
        </MDBox>

        <MDBox px={2} pt={2} display="flex" justifyContent="flex-end">
          <TextField
            label="Rechercher"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearchChange}
            sx={{ width: 250 }}
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
                name="type"
                label="TYPE"
                value={form.type}
                onChange={handleChange}
                error={Boolean(errors.type)}
                helperText={errors.type?.[0] || ""}
                sx={{ ".MuiInputBase-root": { height: "45px" } }}
              >
                <MenuItem value="annuel">annuel</MenuItem>
                <MenuItem value="mensuel">mensuel</MenuItem>
              </TextField>
            </Grid>

            {[
              { name: "min_sbi", label: "MIN_SBI" },
              {
                name: "max_sbi",
                label: "MAX_SBI (Veuillez ne rien taper s'il n'y a pas de valeur)",
              },
              { name: "taux", label: "TAUX (%)" },
              {
                name: "plafond",
                label: "PLAFOND (Veuillez ne rien taper s'il n'y a pas de valeur)",
              },
            ].map((f) => (
              <Grid item xs={12} key={f.name} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  name={f.name}
                  label={f.label}
                  value={form[f.name]}
                  onChange={handleChange}
                  error={Boolean(errors[f.name])}
                  helperText={errors[f.name]?.[0] || ""}
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet élément ?</Typography>
          <Typography sx={{ color: "error.main", fontSize: "medium" }} variant="caption">
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="text" sx={{ color: "error.main" }}>
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
