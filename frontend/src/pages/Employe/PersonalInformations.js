/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  Typography,
  CircularProgress,
  Button,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Divider,
  MenuItem,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PersonalInformations() {
  const { matricule } = useParams();
  const user_id = localStorage.getItem("user_id");
  const [loading, setLoading] = useState(true);
  const [employe, setEmploye] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchEmploye() {
      try {
        const res = await axios.get(`http://localhost:8000/api/employes/${user_id}`);
        setEmploye(res.data);
        setForm({
          ...res.data,
          email: res.data.user?.email || "",
        });
      } catch (error) {
        console.error("Error fetching employe details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmploye();
  }, [matricule]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/employes/${form.id}`, form);
      setEmploye({ ...form });
      setOpenEdit(false);
      setErrors({});
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    }
  };

  const displayField = (label, value) => (
    <Grid item xs={12} sm={6} md={4} key={label}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Grid>
  );

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

  if (!employe) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Employé non trouvé.
          </Typography>
          <Button onClick={() => navigate(-1)} startIcon={<Icon>arrow_back</Icon>}>
            Retour
          </Button>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Mes Informations Personnelles</Typography>
          <Button
            variant="contained"
            color="info"
            onClick={() => setOpenEdit(true)}
            startIcon={<Icon>edit</Icon>}
          >
            Modifier
          </Button>
        </MDBox>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informations professionnelles
          </Typography>
          <Grid container spacing={2}>
            {displayField("Matricule", employe.matricule)}
            {displayField("Fonction", employe.fonction?.designation)}
            {displayField("Service", employe.fonction?.service?.designation)}
            {displayField("Département", employe.fonction?.service?.departement?.designation)}
            {displayField("Date d'embauche", employe.date_embauche)}
            {displayField("Salaire de base", employe.salaire_base)}
          </Grid>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom mt={2}>
            Informations personnelles
          </Typography>
          <Grid container spacing={2}>
            {displayField("Nom", employe.nom)}
            {displayField("Prénom", employe.prenom)}
            {displayField("Sexe", employe.sexe)}
            {displayField("Date de naissance", employe.date_de_naissance)}
            {displayField("CIN", employe.cin)}
            {displayField("Nationalité", employe.nationalite)}
            {displayField("Situation familiale", employe.situation_familiale)}
          </Grid>
        </Card>
        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Coordonnées & Contact
          </Typography>
          <Grid container spacing={2}>
            {displayField("Email Auth", employe.user?.email)}
            {displayField("Email Personnel", employe.email_personnel)}
            {displayField("Téléphone Mobile", employe.telephone_mobile)}
            {displayField("Téléphone Fixe", employe.telephone_fixe)}
            {displayField("Adresse actuelle", employe.adresse_actuelle)}
            {displayField("Pays", employe.pays)}
            {displayField("Ville", employe.ville)}
          </Grid>
        </Card>
      </MDBox>

      {/* Edit Form */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
        <DialogTitle>Modifier Employé</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              { name: "nom", label: "Nom" },
              { name: "prenom", label: "Prénom" },
              { name: "cin", label: "CIN" },
              { name: "nationalite", label: "Nationalité" },
              { name: "pays", label: "Pays" },
              { name: "ville", label: "Ville" },
              { name: "adresse_actuelle", label: "Adresse actuelle" },
              { name: "telephone_mobile", label: "Téléphone mobile" },
              { name: "telephone_fixe", label: "Téléphone fixe" },
              { name: "email_personnel", label: "Email personnel" },
              { name: "date_de_naissance", label: "Date de naissance", type: "date" },
            ].map((field) => (
              <Grid item xs={12} md={6} key={field.name}>
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  type={field.type || "text"}
                  value={form[field.name] || ""}
                  onChange={handleFormChange}
                  error={Boolean(errors[field.name])}
                  helperText={errors[field.name]?.[0]}
                  InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Sexe"
                name="sexe"
                fullWidth
                value={form.sexe}
                onChange={handleChange}
                error={Boolean(errors.sexe)}
                helperText={errors.sexe?.[0]}
                sx={{
                  ".MuiInputBase-root": {
                    height: "45px",
                  },
                }}
              >
                <MenuItem value="HOMME">HOMME</MenuItem>
                <MenuItem value="FEMME">FEMME</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Situation familiale"
                name="situation_familiale"
                fullWidth
                value={form.situation_familiale}
                onChange={handleChange}
                error={Boolean(errors.situation_familiale)}
                helperText={errors.situation_familiale?.[0]}
                sx={{
                  ".MuiInputBase-root": {
                    height: "45px",
                  },
                }}
              >
                <MenuItem value="MARIE">Marié</MenuItem>
                <MenuItem value="CELIBATAIRE">Célibataire</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ color: "#fff" }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
