import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Card } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function ServiceDetails() {
  const { reference } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/services/reference/${reference}`)
      .then((res) => setService(res.data))
      .catch(() => setService(null));
  }, [reference]);

  if (!service) return <p>Chargement ou service introuvable...</p>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h4" mb={2}>
                Détails du Service
              </MDTypography>
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
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
