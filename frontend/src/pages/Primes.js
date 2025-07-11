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
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { Icon } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Primes() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id: null,
    employe_id: "",
    montant: "",
    motif: "",
    impot: "IMPOSABLE", // default value
    date_attribution: "",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [expandedMotifs, setExpandedMotifs] = useState({});

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const toggleMotif = (id) => {
    setExpandedMotifs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8000/api/primes");
    setRows(res.data);
  };

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:8000/api/employes");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  const columns = [
    {
      Header: "Motif",
      accessor: "motif",
      Cell: ({ row }) => {
        const id = row.original.id;
        const fullText = row.original.motif;
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
    { Header: "Impôt", accessor: "impot" },
    { Header: "Date", accessor: "date_attribution" },
    {
      Header: "Employé",
      accessor: "employe.nom",
      Cell: ({ row }) => (
        <Tooltip title="Cliquez pour plus d'informations" arrow>
          <Button
            variant="text"
            color="info"
            onClick={() => navigate(`/employes/details/${row.original.employe.matricule}`)}
          >
            {row.original.employe.prenom} {row.original.employe.nom}
          </Button>
        </Tooltip>
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
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
          <Tooltip title="supprimer">
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

  // Filter rows by employee's prenom or nom based on searchText
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    const lower = searchText.toLowerCase();
    return rows.filter((row) => {
      const prenom = row.employe.prenom.toLowerCase();
      const nom = row.employe.nom.toLowerCase();
      return prenom.includes(lower) || nom.includes(lower);
    });
  }, [rows, searchText]);

  const handleOpenForm = () => {
    setForm({
      id: null,
      employe_id: "",
      montant: "",
      motif: "",
      impot: "IMPOSABLE",
      date_attribution: "",
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setForm({
      id: null,
      employe_id: "",
      montant: "",
      motif: "",
      impot: "IMPOSABLE",
      date_attribution: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/primes/${form.id}`, form);
      } else {
        await axios.post("http://localhost:8000/api/primes", form);
      }
      fetchData();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving prime:", error);
    }
  };

  const handleEdit = (prime) => {
    setForm({
      id: prime.id,
      employe_id: prime.employe.id,
      montant: prime.montant,
      motif: prime.motif,
      impot: prime.impot,
      date_attribution: prime.date_attribution,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/primes/${id}`);
    fetchData();
  };

  const handleCloseInfo = () => {
    setOpenInfo(false);
    setSelectedEmployee(null);
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
                  label="Recherche par employé"
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

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>{form.id ? "Modifier Prime" : "Ajouter Prime"}</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={employees}
            getOptionLabel={(option) => `${option.prenom} ${option.nom}`}
            renderInput={(params) => <TextField {...params} label="Employé" margin="normal" />}
            value={employees.find((e) => e.id === form.employe_id) || null}
            onChange={(event, newValue) => {
              setForm({ ...form, employe_id: newValue?.id || "" });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <TextField
            label="Motif"
            fullWidth
            margin="normal"
            name="motif"
            value={form.motif}
            onChange={(e) => setForm({ ...form, motif: e.target.value })}
          />
          <TextField
            label="Montant"
            type="number"
            fullWidth
            margin="normal"
            name="montant"
            value={form.montant}
            onChange={(e) => setForm({ ...form, montant: e.target.value })}
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
            label="Date d'attribution"
            type="date"
            fullWidth
            margin="normal"
            name="date_attribution"
            value={form.date_attribution}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setForm({ ...form, date_attribution: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Primes;
