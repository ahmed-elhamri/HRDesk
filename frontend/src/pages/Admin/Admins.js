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
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admins");
      setAdmins(res.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
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
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/admins/${id}`);
    fetchAdmins();
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/reset-password/${id}`);
      alert("Mot de passe réinitialisé avec succès !");
    } catch (err) {
      console.error("Erreur de réinitialisation:", err);
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
          <Tooltip title="Réinitialiser le mot de passe">
            <Button
              onClick={() => handleResetPassword(row.original.id)}
              variant="text"
              size="large"
              color="info"
            >
              <Icon>lock_reset</Icon>
            </Button>
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              onClick={() => handleDelete(row.original.id)}
              variant="text"
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

      {/* Dialog: Ajouter Admin */}
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
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
