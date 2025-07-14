/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Grid, Typography, CircularProgress, Button, Icon } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import { useParams, useNavigate } from "react-router-dom";

export default function EmployeDetails() {
  const { matricule } = useParams();
  const [employe, setEmploye] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    async function fetchEmploye() {
      try {
        const res = await axios.get(`http://localhost:8000/api/employes/matricule/${matricule}`);
        setEmploye(res.data);
      } catch (error) {
        console.error("Error fetching employe details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmploye();
  }, [matricule]);

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

  const displayField = (label, value) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Détails de l&apos;employé {employe.nom} {employe.prenom}
          </Typography>
          <Grid container spacing={3}>
            {displayField("Matricule", employe.matricule)}
            {displayField("Nom", employe.nom)}
            {displayField("Prénom", employe.prenom)}
            {displayField("Email Auth", employe.user?.email)}
            {displayField("Email Personnel", employe.email_personnel)}
            {displayField("Téléphone Mobile", employe.telephone_mobile)}
            {displayField("Téléphone Fixe", employe.telephone_fixe)}
            {displayField("Fonction", employe.fonction?.designation)}
            {displayField("Service", employe.fonction?.service?.designation)}
            {displayField("Département", employe.fonction?.service?.departement?.designation)}
            {displayField("CIN", employe.cin)}
            {displayField("Sexe", employe.sexe)}
            {displayField("Nationalité", employe.nationalite)}
            {displayField("Date de naissance", employe.date_de_naissance)}
            {displayField("Pays", employe.pays)}
            {displayField("Ville", employe.ville)}
            {displayField("Adresse actuelle", employe.adresse_actuelle)}
            {displayField("Situation familiale", employe.situation_familiale)}
            {displayField("Date d'embauche", employe.date_embauche)}
            {displayField("Salaire de base", employe.salaire_base)}
          </Grid>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}
