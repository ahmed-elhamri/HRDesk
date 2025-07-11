/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Icon,
  Autocomplete,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

export default function ServiceDetails() {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({ reference: "", designation: "", departement_id: "" });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchService = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/services/reference/${reference}`);
      setService(res.data);
      setForm({
        reference: res.data.reference,
        designation: res.data.designation,
        departement_id: res.data.departement?.id || "",
      });
    } catch {
      setService(null);
    }
  };

  const fetchDepartements = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/departements");
      setDepartements(res.data);
    } catch (err) {
      console.error("Error loading departements:", err);
    }
  };

  useEffect(() => {
    fetchService();
    fetchDepartements();
  }, [reference]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setErrors({});
    if (service) {
      setForm({
        reference: service.reference,
        designation: service.designation,
        departement_id: service.departement?.id || "",
      });
    }
    setOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/services/${service.id}`, form);
      setService(res.data);
      setOpen(false);
      if (reference !== form.reference) {
        navigate(`/services/details/${form.reference}`);
      } else {
        fetchService();
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const columns = [
    { Header: "Référence", accessor: "reference" },
    { Header: "Désignation", accessor: "designation" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <Tooltip title="Voir détails">
          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate(`/fonctions/details/${row.original.reference}`)}
          >
            <Icon>info</Icon>
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {service ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <MDTypography variant="h4">Détails du Service</MDTypography>
                  <Tooltip title="Modifier">
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                      <Icon sx={{ color: "#fff" }}>edit</Icon>
                    </Button>
                  </Tooltip>
                </MDBox>

                <MDTypography>
                  <strong>Référence:</strong> {service.reference}
                </MDTypography>
                <MDTypography>
                  <strong>Désignation:</strong> {service.designation}
                </MDTypography>
                <MDTypography>
                  <strong>Département:</strong> {service.departement?.designation || "Non défini"}
                </MDTypography>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <MDTypography variant="h5" mb={2}>
                  Fonctions liées
                </MDTypography>
                <DataTable
                  table={{ columns, rows: service.fonctions || [] }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </Card>
            </Grid>
          </Grid>
        ) : (
          <p>Chargement ou Service introuvable...</p>
        )}
      </MDBox>

      {/* Dialog: Modifier Service */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Modifier Service</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={departements}
            getOptionLabel={(option) => option.designation}
            value={departements.find((dep) => dep.id === form.departement_id) || null}
            onChange={(e, newValue) =>
              setForm({ ...form, departement_id: newValue ? newValue.id : "" })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Département"
                margin="normal"
                error={Boolean(errors.departement_id)}
                helperText={errors.departement_id?.[0] || ""}
              />
            )}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Référence"
            name="reference"
            fullWidth
            margin="normal"
            value={form.reference}
            onChange={handleChange}
            error={Boolean(errors.reference)}
            helperText={errors.reference?.[0] || ""}
          />
          <TextField
            label="Désignation"
            name="designation"
            fullWidth
            margin="normal"
            value={form.designation}
            onChange={handleChange}
            error={Boolean(errors.designation)}
            helperText={errors.designation?.[0] || ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ color: "#fff" }}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
