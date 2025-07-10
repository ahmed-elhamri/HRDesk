import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function DepartementDetails() {
  const { reference } = useParams();
  const [departement, setDepartement] = useState(null);
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/departements/reference/${reference}`)
      .then((res) => setDepartement(res.data))
      .catch(() => setDepartement(null));
  }, [reference]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {departement ? (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <MDTypography variant="h4" mb={2}>
                  Détails du Département
                </MDTypography>
                <MDTypography>
                  <strong>Référence:</strong> {departement.reference}
                </MDTypography>
                <MDTypography>
                  <strong>Désignation:</strong> {departement.designation}
                </MDTypography>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <p>Chargement ou Département introuvable...</p>
        )}
      </MDBox>
    </DashboardLayout>
  );
}
