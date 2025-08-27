/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  Snackbar,
  Alert,
  TextField,
  Tooltip,
  Typography,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useAuth } from "../context/AuthContext";
import Rubriques from "./Rubriques";
import { setAuthToken } from "./http";
export default function BulletinSalaire() {
  const [mois, setMois] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  });
  const [employes, setEmployes] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(null);
  const [loading, setLoading] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);
  const [key, setKey] = useState("");

  const [bulletin, setBulletin] = useState([]);
  const [cumuls, setCumuls] = useState(null);
  const [cumulsAnnee, setCumulsAnnee] = useState(null);
  const [employeInfo, setEmployeInfo] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [loadError, setLoadError] = useState(false);
  const { permissions } = useAuth();

  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const canCalculate = useMemo(() => {
    // If you have a specific permission name, swap "departement" with e.g. "paie" or "bulletin"
    const perm = permissions?.find((p) => p.entity === "departement"); // adjust if needed
    return !perm || perm.can_read === 1; // default allow if not configured
  }, [permissions]);

  useEffect(() => {
    const fetchEmployes = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const res = await axios.get("http://localhost:8000/api/employes");
        setEmployes(res.data || []);
      } catch (e) {
        console.error(e);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployes();
  }, []);

  const getEmployeLabel = (emp) => {
    if (!emp) return "";
    const full = [emp.prenom, emp.nom].filter(Boolean).join(" ");
    const label = full || emp.full_name || emp.name || `Employé #${emp.id}`;
    return emp.matricule ? `${emp.matricule} — ${label}` : label;
  };

  const handleCalculate = async () => {
    if (!mois || !selectedEmploye?.id) {
      setSnackbarMessage("Veuillez choisir le mois et l'employé.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    if (!canCalculate) {
      setSnackbarMessage("Vous n'avez pas la permission d'effectuer ce calcul.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setCalcLoading(true);
    try {
      const body = { mois, employe_id: selectedEmploye.id };
      const res = await axios.post("http://localhost:8000/api/calculer-salaire-net", body);

      setBulletin(res.data.bulletin || []);
      setCumuls(res.data.cumuls || null);
      setCumulsAnnee(res.data.cumuls_annee || null);
      setEmployeInfo(res.data.employe || null);
      setPdfUrl(res.data.pdf_url || "");
      setKey(selectedEmploye.id);

      setSnackbarMessage("Calcul effectué avec succès.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      let msg = "Erreur lors du calcul.";
      if (e?.response?.data?.message) msg = e.response.data.message;
      setSnackbarMessage(msg);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setCalcLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (!pdfUrl) return;
    try {
      // make sure pdfUrl is relative ("/storage/..."), so prepend host
      const url = `http://localhost:8000${pdfUrl}`;
      const response = await axios.get(url, {
        responseType: "blob", // important
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      const label = selectedEmploye
        ? getEmployeLabel(selectedEmploye).replace(/\s+/g, "_")
        : "bulletin";
      a.href = blobUrl;
      a.download = `bulletin_${label}_${mois}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("PDF download failed:", e);
      // fallback open in new tab
      window.open(`http://localhost:8000${pdfUrl}`, "_blank");
    }
  };

  const bulletinColumns = [
    { Header: "Libellé", accessor: "libele" },
    {
      Header: "Base",
      accessor: "base",
      Cell: ({ value }) => Number(value).toFixed(2),
    },
    {
      Header: "Taux / Qté",
      accessor: "taux",
      Cell: ({ value }) => (isNaN(value) ? value : Number(value).toFixed(2)),
    },
    {
      Header: "Gain",
      accessor: "gain",
      Cell: ({ value }) => Number(value).toFixed(2),
    },
    {
      Header: "Retenue",
      accessor: "retenue",
      Cell: ({ value }) => Number(value).toFixed(2),
    },
  ];

  const cumulsColumns = [
    { Header: "Cumuls", accessor: "key" },
    { Header: "Période", accessor: "value1" },
    { Header: "Année", accessor: "value2" },
  ];

  const cumulsRows = useMemo(() => {
    if (!cumuls || !cumulsAnnee) return [];

    // collect all keys from both objects
    const keys = Array.from(new Set([...Object.keys(cumuls), ...Object.keys(cumulsAnnee)]));

    return keys.map((key) => ({
      key,
      value1: cumuls[key] != null ? Number(cumuls[key]).toFixed(2) : "",
      value2: cumulsAnnee[key] != null ? Number(cumulsAnnee[key]).toFixed(2) : "",
    }));
  }, [cumuls, cumulsAnnee]);

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
            Impossible de charger les employés.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

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
                  Bulletin de Paie
                </MDTypography>
              </MDBox>

              {/* Inputs */}
              <MDBox px={2} pt={3} display="flex" justifyContent="flex-end">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={2}>
                    <TextField
                      type="month"
                      label="Mois"
                      value={mois}
                      onChange={(e) => setMois(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Autocomplete
                      size="medium"
                      options={employes}
                      getOptionLabel={getEmployeLabel}
                      onChange={(_, val) => setSelectedEmploye(val)}
                      renderInput={(params) => <TextField {...params} label="Employé" />}
                      isOptionEqualToValue={(o, v) => o?.id === v?.id}
                      sx={{ ".MuiInputBase-root": { height: "45px" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Tooltip title="Calculer le bulletin">
                      <span>
                        <Button
                          onClick={handleCalculate}
                          variant="text"
                          color="success"
                          size="large"
                          disabled={!mois || !selectedEmploye || calcLoading}
                        >
                          {calcLoading ? (
                            <CircularProgress size={22} />
                          ) : (
                            <Icon sx={{ color: "info.main" }}>calculate</Icon>
                          )}
                        </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>

              {/* Results */}
              {(bulletin?.length || cumuls || employeInfo) && (
                <MDBox px={2} pt={2} pb={3}>
                  {/* Employe Info */}
                  {employeInfo && (
                    <Card style={{ marginBottom: 16 }}>
                      <Accordion sx={{ boxShadow: "none" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <MDTypography variant="subtitle1" fontWeight="bold">
                            Informations Employé
                          </MDTypography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={1} fontSize="1rem">
                            <Grid item xs={12} md={3}>
                              <strong>Matricule:</strong> {employeInfo?.matricule || "-"}
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <strong>Nom:</strong>{" "}
                              {[employeInfo?.prenom, employeInfo?.nom].filter(Boolean).join(" ")}
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <strong>Service:</strong>{" "}
                              {employeInfo?.fonction?.service?.designation || "-"}
                            </Grid>
                            <Grid item xs={12} md={3}>
                              <strong>Fonction:</strong> {employeInfo?.fonction?.designation || "-"}
                            </Grid>
                            {/*<Grid item xs={12} md={2}>*/}
                            {/*  <Tooltip*/}
                            {/*    title="détails"*/}
                            {/*    componentsProps={{*/}
                            {/*      tooltip: {*/}
                            {/*        sx: {*/}
                            {/*          backgroundColor: "rgba(123, 128, 154, 0.8)",*/}
                            {/*          color: "#fff",*/}
                            {/*          fontSize: "0.8rem",*/}
                            {/*        },*/}
                            {/*      },*/}
                            {/*    }}*/}
                            {/*  >*/}
                            {/*    <Button*/}
                            {/*      onClick={() => navigate(`/employes/${employeInfo?.matricule}`)}*/}
                            {/*      variant="text"*/}
                            {/*      color="secondary"*/}
                            {/*      size="large"*/}
                            {/*    >*/}
                            {/*      <Icon>info</Icon>*/}
                            {/*    </Button>*/}
                            {/*  </Tooltip>*/}
                            {/*</Grid>*/}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Card>
                  )}
                  <Card style={{ marginBottom: 16 }}>
                    <Accordion sx={{ boxShadow: "none" }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <MDTypography variant="subtitle1" fontWeight="bold">
                          Rubriques
                        </MDTypography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Rubriques key={`${key || "none"}`} employe_id={key} />
                      </AccordionDetails>
                    </Accordion>
                  </Card>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Card style={{ marginBottom: 16 }}>
                        <Accordion sx={{ boxShadow: "none" }} defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <MDTypography variant="subtitle1" fontWeight="bold">
                              Bulletin
                            </MDTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <MDBox pt={1}>
                              <DataTable
                                table={{ columns: bulletinColumns, rows: bulletin }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                              />
                            </MDBox>
                          </AccordionDetails>
                        </Accordion>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card style={{ marginBottom: 16 }}>
                        <Accordion sx={{ boxShadow: "none" }} defaultExpanded>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <MDTypography variant="subtitle1" fontWeight="bold">
                              Cumuls
                            </MDTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <MDBox pt={1}>
                              <DataTable
                                table={{ columns: cumulsColumns, rows: cumulsRows }}
                                isSorted={false}
                                entriesPerPage={false}
                                showTotalEntries={false}
                                noEndBorder
                              />
                            </MDBox>
                          </AccordionDetails>
                        </Accordion>
                      </Card>
                    </Grid>
                    {/* Download PDF */}
                    {pdfUrl && (
                      <Grid item xs={12}>
                        <MDBox display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="info"
                            onClick={downloadPdf}
                            startIcon={<Icon>download</Icon>}
                          >
                            Télécharger le PDF
                          </Button>
                        </MDBox>
                      </Grid>
                    )}
                  </Grid>
                </MDBox>
              )}
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
