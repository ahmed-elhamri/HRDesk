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
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

export default function Departements() {
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({ reference: "", designation: "", id: null });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchDepartements = async () => {
    const res = await axios.get("http://localhost:8000/api/departements");
    setDepartements(res.data);
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
      } else {
        await axios.post("http://localhost:8000/api/departements", form);
      }
      fetchDepartements();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleEdit = (dep) => {
    setForm(dep);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/departements/${id}`);
    fetchDepartements();
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Filter departments by reference or designation
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
          <Tooltip
            title="modifier"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "rgba(26, 115, 232, 0.8)", // semi-transparent black
                  color: "#fff", // white text
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
                  backgroundColor: "rgba(244, 67, 53, 0.8)", // semi-transparent black
                  color: "#fff", // white text
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
          <Tooltip
            title="details"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "rgba(123, 128, 154, 0.8)", // semi-transparent black
                  color: "#fff", // white text
                  fontSize: "0.8rem",
                },
              },
            }}
          >
            <Button
              onClick={() => navigate(`/departements/details/${row.original.reference}`)}
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
                  Départements
                </MDTypography>
                <Tooltip title="ajouter">
                  <Button onClick={handleOpen} variant="contained" color="success">
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
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
                  table={{ columns, rows: filteredDepartements }}
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
        <DialogTitle>{form.id ? "Modifier Département" : "Ajouter Département"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            {["reference", "designation"].map((field) => (
              <Grid item xs={12} key={field} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  name={field}
                  label={field.toUpperCase()}
                  value={form[field]}
                  onChange={handleChange}
                  error={Boolean(errors[field])}
                  helperText={errors[field]?.[0] || ""}
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
    </DashboardLayout>
  );
}
