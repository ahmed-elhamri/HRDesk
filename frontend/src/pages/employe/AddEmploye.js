/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Grid,
  TextField,
  Autocomplete,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function AddEmploye() {
  const [fonctions, setFonctions] = useState([]);
  const [form, setForm] = useState({
    email: "",
    fonction_id: "",
    matricule: "",
    nom: "",
    prenom: "",
    cin: "",
    sexe: "HOMME",
    nationalite: "",
    date_de_naissance: "",
    pays: "",
    ville: "",
    adresse_actuelle: "",
    telephone_mobile: "",
    telephone_fixe: "",
    email_personnel: "",
    situation_familiale: "CELIBATAIRE",
    date_embauche: "",
    salaire_base: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/api/employes", form);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    }
  };

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
                  Nouveau Employé
                </MDTypography>
              </MDBox>
              <Grid container spacing={2} my={2} px={2}>
                {[
                  { name: "email", label: "Email (connexion)", required: true },
                  { name: "matricule", label: "Matricule" },
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
                  { name: "salaire_base", label: "Salaire de base", type: "number" },
                ].map((field) => (
                  <Grid item xs={12} md={6} key={field.name}>
                    <TextField
                      fullWidth
                      name={field.name}
                      label={field.label}
                      value={form[field.name]}
                      onChange={handleChange}
                      error={Boolean(errors[field.name])}
                      helperText={errors[field.name]?.[0]}
                      required={field.required}
                      type={field.type || "text"}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date de naissance"
                    name="date_de_naissance"
                    type="date"
                    value={form.date_de_naissance}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.date_de_naissance)}
                    helperText={errors.date_de_naissance?.[0]}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date d'embauche"
                    name="date_embauche"
                    type="date"
                    value={form.date_embauche}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(errors.date_embauche)}
                    helperText={errors.date_embauche?.[0]}
                  />
                </Grid>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    options={fonctions}
                    getOptionLabel={(option) => option.designation}
                    value={fonctions.find((f) => f.id === form.fonction_id) || null}
                    onChange={(e, val) => setForm({ ...form, fonction_id: val?.id || "" })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Fonction"
                        error={Boolean(errors.fonction_id)}
                        helperText={errors.fonction_id?.[0]}
                        sx={{
                          ".MuiInputBase-root": {
                            height: "45px",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  sx={{ color: "#fff", marginTop: 2, marginLeft: 2 }}
                >
                  Ajouter
                </Button>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
