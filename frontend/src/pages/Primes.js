/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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

function Primes() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [form, setForm] = useState({
    id: null,
    employe_id: "",
    montant: "",
    motif: "",
    date_attribution: "",
  });
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
    { Header: "Motif", accessor: "motif" },
    { Header: "Montant", accessor: "montant" },
    { Header: "Date", accessor: "date_attribution" },
    {
      Header: "Employé",
      accessor: "employe.nom", // Not used by DataTable directly
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <Tooltip title="Cliquez pour plus d'informations" arrow>
          <Button
            variant="text"
            color="info"
            onClick={() => handleShowEmployee(row.original.employe)}
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
          <Button variant="outlined" color="primary" onClick={() => handleEdit(row.original)}>
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(row.original.id)}
            style={{ marginLeft: 8 }}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  const handleOpenForm = () => {
    setForm({
      id: null,
      employe_id: "",
      montant: "",
      motif: "",
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
      date_attribution: prime.date_attribution,
    });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/primes/${id}`);
    fetchData();
  };

  const handleShowEmployee = (employe) => {
    setSelectedEmployee(employe);
    setOpenInfo(true);
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
              >
                <MDTypography variant="h6" color="white">
                  Primes Table
                </MDTypography>
                <Button variant="contained" color="success" onClick={handleOpenForm}>
                  Ajouter Prime
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
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
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={openInfo} onClose={handleCloseInfo} fullWidth>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <>
              <p>
                <strong>Nom:</strong> {selectedEmployee.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {selectedEmployee.prenom}
              </p>
              <p>
                <strong>Email:</strong> {selectedEmployee.email}
              </p>
              <p>
                <strong>Poste:</strong> {selectedEmployee.poste}
              </p>
              <p>
                <strong>Département:</strong> {selectedEmployee.departement}
              </p>
              <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <strong>Date d'embauche:</strong> {selectedEmployee.date_embauche}
              </p>
              <p>
                <strong>Salaire:</strong> {selectedEmployee.salaire_base}
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfo}>Close</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Primes;
