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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function Employes() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    departement: "",
    date_embauche: "",
    salaire_base: "",
  });

  const columns = [
    { Header: "Nom", accessor: "nom" },
    { Header: "Prénom", accessor: "prenom" },
    { Header: "Email", accessor: "email" },
    { Header: "Poste", accessor: "poste" },
    { Header: "Département", accessor: "departement" },
    { Header: "Date d'embauche", accessor: "date_embauche" },
    { Header: "Salaire", accessor: "salaire_base" },
    {
      Header: "Actions",
      accessor: "actions",
      /* eslint-disable-next-line react/prop-types */
      Cell: ({ row }) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            /* eslint-disable-next-line react/prop-types */
            onClick={() => handleEdit(row.original)}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            /* eslint-disable-next-line react/prop-types */
            onClick={() => handleDelete(row.original.id)}
            style={{ marginLeft: "8px" }}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employes");
      setRows(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({
      nom: "",
      prenom: "",
      email: "",
      poste: "",
      departement: "",
      date_embauche: "",
      salaire_base: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/employes/${form.id}`, form);
      } else {
        // ADD new employee
        await axios.post("http://localhost:8000/api/employes", form);
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/employes/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEdit = (employee) => {
    // For now, just fill the form and open dialog for editing
    setForm(employee);
    setOpen(true);
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
                  Les employés
                </MDTypography>
                <Button variant="contained" color="success" onClick={handleOpen}>
                  Ajouter un employe
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

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{form.id ? "Modifier Employee" : "Ajouter un Employee"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              "nom",
              "prenom",
              "email",
              "poste",
              "departement",
              "date_embauche",
              "salaire_base",
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField
                  fullWidth
                  type={field === "date_embauche" ? "date" : "text"}
                  name={field}
                  label={field.replace("_", " ").toUpperCase()}
                  value={form[field]}
                  onChange={handleChange}
                  InputLabelProps={field === "date_embauche" ? { shrink: true } : {}}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Employes;
