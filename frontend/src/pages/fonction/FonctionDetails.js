// FonctionDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function FonctionDetails() {
  const { reference } = useParams();
  const [fonction, setFonction] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/fonctions/reference/${reference}`)
      .then((res) => setFonction(res.data))
      .catch(() => setFonction(null));
  }, [reference]);

  if (!fonction) return <p>Chargement ou fonction introuvable...</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h4" mb={2}>
                Détails de la Fonction
              </MDTypography>
              <MDTypography>
                <strong>Référence:</strong> {fonction.reference}
              </MDTypography>
              <MDTypography>
                <strong>Désignation:</strong> {fonction.designation}
              </MDTypography>
              <MDTypography>
                <strong>Service:</strong> {fonction.service?.designation || "Non défini"}
              </MDTypography>
              <MDTypography>
                <strong>Département:</strong>{" "}
                {fonction.service?.departement?.designation || "Non défini"}
              </MDTypography>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
