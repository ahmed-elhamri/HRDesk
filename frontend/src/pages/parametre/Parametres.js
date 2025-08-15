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
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CnssCotisations from "./CnssCotisations";
import FraisProfessionnels from "./FraisProfessionnels";
import FamilyCharges from "./FamilyCharges";
import AmoCotisations from "./AmoCotisations";
import IrTranches from "./IrTranches";
import TauxHeuresSupplementaires from "./TauxHeuresSupplementaires";

export default function Parametres() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3} rowSpacing={6} alignItems="stretch">
          <FraisProfessionnels />
          <FamilyCharges />
          <AmoCotisations />
          <CnssCotisations />
          <IrTranches />
          <TauxHeuresSupplementaires />
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
