/* eslint-disable react/prop-types */
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Alert, Snackbar } from "@mui/material";

function Primes() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    motif: "",
    impot: "IMPOSABLE",
    plafond: "",
  });
  const [searchText, setSearchText] = useState("");
  const [expandedMotifs, setExpandedMotifs] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

  const fetchPrimes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/primes");
      setRows(res.data || []);
    } catch (error) {
      console.error("Erreur de chargement des primes:", error);
      setRows([]);
    }
  };

  useEffect(() => {
    fetchPrimes();
  }, []);

  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    return rows.filter((row) => row.motif?.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, rows]);

  const columns = [
    {
      Header: "Motif",
      accessor: "motif",
      Cell: ({ row }) => {
        const id = row.original.id;
        const fullText = row.original.motif || "";
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
    { Header: "Impôt", accessor: "impot" },
    { Header: "Plafond", accessor: "plafond" },
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
              color="error"
              size="large"
              sx={{ ml: 1 }}
            >
              <Icon sx={{ color: "error.main" }}>delete</Icon>
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const handleOpenForm = () => {
    setForm({
      id: null,
      motif: "",
      impot: "IMPOSABLE",
      plafond: "",
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setForm({
      id: null,
      motif: "",
      impot: "IMPOSABLE",
      plafond: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/primes/${form.id}`, form);
        setSnackbarMessage("Prime modifié avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        await axios.post("http://localhost:8000/api/primes", form);
        setSnackbarMessage("Prime ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
      fetchPrimes();
      handleCloseForm();
    } catch (error) {
      if (form.id) {
        setSnackbarMessage("Erreur lors de la modification !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Erreur lors de l'ajout !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
      console.error("Erreur lors de l'enregistrement de la prime:", error);
    }
  };

  const handleEdit = (prime) => {
    setForm({
      id: prime.id,
      motif: prime.motif,
      impot: prime.impot,
      plafond: prime.plafond,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette prime ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/primes/${id}`);
      fetchPrimes();
      setSnackbarMessage("Prime supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

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
                gap={2}
              >
                <MDTypography variant="h6" color="white">
                  Primes Table
                </MDTypography>
                <Button variant="contained" color="success" onClick={handleOpenForm}>
                  <Icon sx={{ color: "info.main" }}>add</Icon>
                </Button>
              </MDBox>
              <MDBox px={2} pt={2} display="flex" justifyContent="flex-end" flexWrap="wrap">
                <TextField
                  label="Recherche par motif"
                  size="small"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ backgroundColor: "white", borderRadius: 1, minWidth: 250 }}
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
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>{form.id ? "Modifier Prime" : "Ajouter Prime"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Motif"
            fullWidth
            margin="normal"
            name="motif"
            value={form.motif}
            onChange={(e) => setForm({ ...form, motif: e.target.value })}
          />
          <TextField
            label="Impôt"
            fullWidth
            margin="normal"
            name="impot"
            select
            SelectProps={{ native: true }}
            value={form.impot}
            onChange={(e) => setForm({ ...form, impot: e.target.value })}
          >
            <option value="IMPOSABLE">IMPOSABLE</option>
            <option value="NON IMPOSABLE">NON IMPOSABLE</option>
          </TextField>
          <TextField
            label="Plafond"
            type="number"
            fullWidth
            margin="normal"
            name="plafond"
            value={form.plafond}
            onChange={(e) => setForm({ ...form, plafond: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Annuler</Button>
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

export default Primes;
