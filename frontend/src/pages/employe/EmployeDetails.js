/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  Grid,
  Button,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  CardHeader,
  CardContent,
  Autocomplete,
} from "@mui/material";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../components/MDBox";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../examples/Tables/DataTable";
import { useAuth } from "../../context/AuthContext";
const labels = {
  chemin_cin: "CIN",
  chemin_cnss: "CNSS",
  chemin_contrat_travail: "Contrat de travail",
  chemin_tableau_amortissement: "Tableau d'amortissement",
  lettre_demission: "Lettre de demission",
  diplome_un: "Diplôme 1",
  diplome_deux: "Diplôme 2",
  diplome_trois: "Diplôme 3",
  diplome_quatre: "Diplôme 4",
  diplome_cinq: "Diplôme 5",
};
export default function EmployeDetails() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  // Data states per section
  const { matricule } = useParams();
  const navigate = useNavigate();
  const [personal, setPersonal] = useState(null);
  const [contrat, setContrat] = useState(null);
  const [caisseSociale, setCaisseSociale] = useState(null);
  const [paiement, setPaiement] = useState(null);
  const [documents, setDocuments] = useState({});
  const [permissions, setPermissions] = useState({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [fonctions, setFonctions] = useState([]);

  // Loading & errors
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Edit dialogs states
  const [editOpenPersonnal, setEditOpenPersonnal] = useState(false);
  const [editOpenContrat, setEditOpenContrat] = useState(false);
  const [editOpenCaisse, setEditOpenCaisse] = useState(false);
  const [editOpenPaiement, setEditOpenPaiement] = useState(false);
  const [editOpenDocument, setEditOpenDocument] = useState(false);
  const [editOpenPermission, setEditOpenPermission] = useState(false);
  const [editFormPersonnal, setEditFormPersonnal] = useState({});
  const [editFormContrat, setEditFormContrat] = useState({});
  const [editFormCaisse, setEditFormCaisse] = useState({});
  const [editFormPaiement, setEditFormPaiement] = useState({});
  const [editFormDocument, setEditFormDocument] = useState({});
  const [editFormPermission, setEditFormPermission] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Helper: API base url + auth token
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const API_BASE = "http://localhost:8000/api";

  // Fetch function per section
  const fetchFonctions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fonctions");
      setFonctions(res.data);
    } catch (error) {
      console.error("Error fetching fonctions:", error);
      setSnackbarMessage("Erreur lors du chargement des fonctions.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const fetchPersonal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/employes/matricule/${matricule}`);
      setPersonal(res.data);
    } catch (err) {
      console.error("Error fetching personal info", err);
      setSnackbarMessage("Erreur lors du chargement des informations personnelles.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchContrat = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/contrats`, { params: { employe_id: personal?.id } });
      setContrat(res.data);
    } catch (err) {
      console.error("Error fetching contrat", err);
      setSnackbarMessage("Erreur lors du chargement du contrat.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaisseSociale = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/caisses-sociales`, {
        params: { employe_id: personal?.id },
      });
      setCaisseSociale(res.data);
    } catch (err) {
      console.error("Error fetching caisse sociale", err);
      setSnackbarMessage("Erreur lors du chargement de la caisse sociale.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaiement = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/paiements`, {
        params: { employe_id: personal?.id },
      });
      setPaiement(res.data);
    } catch (err) {
      console.error("Error fetching paiement", err);
      setSnackbarMessage("Erreur lors du chargement du paiement.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/documents`, {
        params: { employe_id: personal?.id },
      });
      setDocuments(res.data || {});
    } catch (err) {
      console.error("Error fetching documents", err);
      setSnackbarMessage("Erreur lors du chargement des documents.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/permissions`, {
        params: { employe_id: personal?.id },
      });
      setPermissions(res.data || {});
    } catch (err) {
      console.error("Error fetching Permissions", err);
      setSnackbarMessage("Erreur lors du chargement des permissions.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermission = async (entity) => {
    try {
      await axios
        .get(`${API_BASE}/permissions/${personal?.id}`, {
          params: { entity: entity },
        })
        .then((res) => {
          setEditFormPermission({
            entity: entity,
            can_create: res.data[0].can_create,
            can_read: res.data[0].can_read,
            can_update: res.data[0].can_update,
            can_delete: res.data[0].can_delete,
          });
          setEditOpenPermission(true);
        });
    } catch (err) {
      console.error("Error fetching documents", err);
      setSnackbarMessage("Erreur lors du chargement des documents.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data for personal on mount
  useEffect(() => {
    fetchPersonal();
    fetchFonctions();
  }, [matricule]);

  // When active tab changes, fetch data if needed
  useEffect(() => {
    if (!personal?.id) return;
    switch (activeTab) {
      case "contrat":
        if (!contrat) fetchContrat();
        break;
      case "caisseSociale":
        if (!caisseSociale) fetchCaisseSociale();
        break;
      case "paiement":
        if (!paiement) fetchPaiement();
        break;
      case "documents":
        if (Object.keys(documents).length === 0) fetchDocuments();
        break;
      case "permissions":
        if (Object.keys(permissions).length === 0) fetchPermissions();
        break;
      default:
        break;
    }
  }, [activeTab, personal?.id]);

  // Handlers for tabs
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
  };

  // Handlers for edit dialog open - preload form
  const openEditDialog = () => {
    switch (activeTab) {
      case "personal":
        setEditFormPersonnal({ ...personal });
        setEditOpenPersonnal(true);
        break;
      case "contrat":
        setEditFormContrat({ ...contrat });
        setEditOpenContrat(true);
        break;
      case "caisseSociale":
        setEditFormCaisse({ ...caisseSociale });
        setEditOpenCaisse(true);
        break;
      case "paiement":
        setEditFormPaiement({ ...paiement });
        setEditOpenPaiement(true);
        break;
      case "documents":
        setEditFormDocument({ ...documents });
        setEditOpenDocument(true);
      default:
        break;
    }
    setErrors({});
  };

  const handlePersonnalChange = (e) => {
    const { name, value } = e.target;
    setEditFormPersonnal((prev) => ({ ...prev, [name]: value }));
  };
  const handleConctratChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormContrat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleCaisseChange = (e) => {
    const { name, value } = e.target;
    setEditFormCaisse((prev) => ({ ...prev, [name]: value }));
  };
  const handlePaiementChange = (e) => {
    const { name, value } = e.target;
    setEditFormPaiement((prev) => ({ ...prev, [name]: value }));
  };
  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    setEditFormDocument((prev) => ({ ...prev, [name]: files.length > 0 ? files[0] : null }));
  };
  const handlePermissionsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormPermission((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Save update handler (generic)
  const handleSave = async () => {
    try {
      let url = "";
      if (activeTab === "personal") {
        url = `${API_BASE}/employes/${personal.id}`;
        let payload = { ...editFormPersonnal };
        await axios.put(url, payload);
        console.log(payload.matricule);
        setEditOpenPersonnal(false);
        if (matricule !== payload.matricule) {
          navigate(`/employes/${payload.matricule}`);
        }
      } else if (activeTab === "contrat") {
        url = `${API_BASE}/contrats`;
        let payload = { ...editFormContrat };
        payload.employe_id = personal.id;
        await axios.put(url, payload);
        setEditOpenContrat(false);
      } else if (activeTab === "caisseSociale") {
        url = `${API_BASE}/caisses-sociales`;
        let payload = { ...editFormCaisse };
        payload.employe_id = personal.id;
        await axios.put(url, payload);
        setEditOpenCaisse(false);
      } else if (activeTab === "paiement") {
        url = `${API_BASE}/paiements`;
        let payload = { ...editFormPaiement };
        payload.employe_id = personal.id;
        await axios.put(url, payload);
        setEditOpenPaiement(false);
      } else if (activeTab === "permissions") {
        url = `${API_BASE}/permissions/${personal.id}`;
        let payload = { ...editFormPermission };
        // console.log(payload);
        await axios.put(url, payload);
        setEditOpenPermission(false);
      } else {
        url = `${API_BASE}/documents/${personal.id}`;
        let payload = { ...editFormDocument };
        let header = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        payload.employe_id = personal.id;
        await axios.post(url, payload, header);
        setEditOpenDocument(false);
      }
      setSnackbarMessage("Modifications enregistrées avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // Refresh data
      switch (activeTab) {
        case "personal":
          fetchPersonal();
          break;
        case "contrat":
          fetchContrat();
          break;
        case "caisseSociale":
          fetchCaisseSociale();
          break;
        case "paiement":
          fetchPaiement();
          break;
        case "documents":
          fetchDocuments();
          break;
        case "permissions":
          fetchPermissions();
          break;
      }
    } catch (err) {
      if (err.response?.status === 422) {
        console.error(err.response);
        setErrors(err.response.data.errors || {});
      } else {
        setSnackbarMessage("Erreur lors de la sauvegarde.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  // New function: called when deletion is confirmed
  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_BASE}/employes/${deleteId}`);
      setSnackbarMessage("Employé supprimé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      navigate("/employes");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  // Reset password handler (personal tab)
  const handleResetPassword = async () => {
    try {
      await axios.put(`${API_BASE}/reset-password/${personal.id}`);
      setSnackbarMessage("Mot de passe réinitialisé avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Erreur lors de la réinitialisation du mot de passe.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Document file preview handlers
  const handlePreviewOpen = (name, file) => {
    setPreviewFile({ name: name, file: `http://localhost:8000/storage/documents/${file}` });
    setPreviewOpen(true);
  };
  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };
  const displayField = (label, value) => (
    <Grid item xs={12} sm={6} md={4} key={label}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value !== null ? value : "-"}</Typography>
    </Grid>
  );

  // Personal tab UI render function
  const renderPersonal = () => {
    if (!personal) return <Typography>Aucune donnée personnelle.</Typography>;
    return (
      <>
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="flex-end" alignItems="center">
            {auth.permissions.find((p) => p.entity === "employe")?.can_update === 1 && (
              <>
                <Tooltip
                  title="Modifier"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "rgba(26, 115, 232, 0.8)",
                        color: "#fff",
                        fontSize: "0.8rem",
                      },
                    },
                  }}
                >
                  <IconButton color="info" onClick={openEditDialog}>
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title="Réinitialiser mot de passe"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: "rgba(123, 128, 154, 0.8)",
                        color: "#fff",
                        fontSize: "0.8rem",
                      },
                    },
                  }}
                >
                  <IconButton color="secondary" onClick={handleResetPassword}>
                    <Icon>lock_reset</Icon>
                  </IconButton>
                </Tooltip>
              </>
            )}
            {auth.permissions.find((p) => p.entity === "employe")?.can_delete === 1 && (
              <Tooltip
                title="Supprimer"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(244, 67, 53, 0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <IconButton
                  variant="text"
                  size="medium"
                  color="error"
                  onClick={() => handleDelete(personal.id)}
                >
                  <Icon>delete</Icon>
                </IconButton>
              </Tooltip>
            )}
          </MDBox>
          <Grid container spacing={2}>
            {displayField("Département", personal.fonction.service.departement.designation)}
            {displayField("Service", personal.fonction.service.designation)}
            {displayField("Fonction", personal.fonction.designation)}
            {displayField("Matricule", personal.matricule)}
            {displayField("Nom", personal.nom)}
            {displayField("Prénom", personal.prenom)}
            {displayField("Adresse", personal.adresse)}
            {displayField("Ville", personal.ville)}
            {displayField("Nationalité", personal.nationalite)}
            {displayField("CIN", personal.cin)}
            {displayField("Sejour", personal.sejour)}
            {displayField("Téléphone mobile", personal.telephone_mobile)}
            {displayField("Téléphone fixe", personal.telephone_fixe)}
            {displayField("Email", personal.email)}
            {displayField("Nombre d'enfants", personal.nb_enfants)}
            {displayField("Nombre de deductions", personal.nb_deductions)}
            {displayField("Date de naissance", personal.date_de_naissance)}
            {displayField("Date d'embauche", personal.date_embauche)}
            {displayField("Date d'entrée", personal.date_embauche)}
            {displayField("Civilité", personal.civilite)}
            {displayField("Situation familiale", personal.situation_familiale)}
            {displayField("Taux d'ancienneté", personal.taux_anciennete)}
          </Grid>
        </Card>
      </>
    );
  };

  // Contrat tab UI
  const renderContrat = () => {
    if (!contrat) return <Typography>Aucun contrat trouvé.</Typography>;
    return (
      <>
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            {auth.permissions.find((p) => p.entity === "employe")?.can_update === 1 && (
              <Tooltip
                title="Modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26, 115, 232, 0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <IconButton color="info" onClick={openEditDialog}>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            )}
          </MDBox>
          <Grid container spacing={2}>
            {displayField("Type contrat", contrat.type_contrat)}
            {displayField("Type rémunération", contrat.type_remuneration)}
            {displayField("Statut", contrat.statut)}
            {displayField("Date fin", contrat.date_fin)}
            {displayField("Salaire de base", contrat.salaire_base + " DH")}
            {displayField("Taux horaire", contrat.taux_horaire)}
            {displayField("Avocat", contrat.est_avocat ? "Oui" : "Non")}
            {displayField("Domestique", contrat.est_domestique ? "Oui" : "Non")}
            {displayField("Saisonnier", contrat.est_saisonnier ? "Oui" : "Non")}
            {displayField("Nombre de jours de saisonnier", contrat.nb_jours_saisonnier)}
            {displayField("Nouveau declarant", contrat.nouveau_declarant ? "Oui" : "Non")}
          </Grid>
        </Card>
      </>
    );
  };

  // Caisse Sociale tab UI
  const renderCaisse = () => {
    if (!caisseSociale) return <Typography>Aucune caisse sociale trouvée.</Typography>;
    return (
      <>
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            {auth.permissions.find((p) => p.entity === "employe")?.can_update === 1 && (
              <Tooltip
                title="Modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26, 115, 232, 0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <IconButton color="info" onClick={openEditDialog}>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            )}
          </MDBox>
          <Grid container spacing={2}>
            {displayField("Numéro CNSS", caisseSociale.numero_cnss)}
            {displayField("Numéro Mutuelle", caisseSociale.numero_mutuelle)}
            {displayField("Numéro Adhérent CIMR", caisseSociale.numero_adherent_cimr)}
            {displayField("Numéro Catégorie CIMR", caisseSociale.numero_categorie_cimr)}
            {displayField("Matricule CIMR", caisseSociale.matricule_cimr)}
            {displayField("Taux cotisation CIMR", caisseSociale.taux_cotisation_cimr)}
            {displayField("Date affiliation CIMR", caisseSociale.date_affiliation_cimr)}
          </Grid>
        </Card>
      </>
    );
  };

  // Paiement tab UI
  const renderPaiement = () => {
    if (!paiement) return <Typography>Aucune info de paiement.</Typography>;
    return (
      <>
        <Card sx={{ p: 3 }}>
          <MDBox display="flex" justifyContent="flex-end" mb={2}>
            {auth.permissions.find((p) => p.entity === "employe")?.can_update === 1 && (
              <Tooltip
                title="Modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26, 115, 232, 0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <IconButton color="info" onClick={openEditDialog}>
                  <Icon>edit</Icon>
                </IconButton>
              </Tooltip>
            )}
          </MDBox>
          <Grid container spacing={2}>
            {displayField("Mode paiement", paiement.mode_paiement)}
            {displayField("Banque", paiement.banque)}
            {displayField("Numéro compte", paiement.numero_compte)}
            {displayField("adresse_banque", paiement.adresse_banque)}
          </Grid>
        </Card>
      </>
    );
  };

  // Documents section — full layout as provided by you
  const renderDocuments = () => (
    <Grid item xs={12}>
      <Card sx={{ p: 3 }}>
        <MDBox display="flex" justifyContent="flex-end" mb={2}>
          {auth.permissions.find((p) => p.entity === "employe")?.can_update === 1 && (
            <Tooltip
              title="Modifier"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: "rgba(26, 115, 232, 0.8)",
                    color: "#fff",
                    fontSize: "0.8rem",
                  },
                },
              }}
            >
              <IconButton color="info" onClick={openEditDialog}>
                <Icon>edit</Icon>
              </IconButton>
            </Tooltip>
          )}
        </MDBox>
        <CardContent>
          <List>
            {Object.entries(documents)
              .filter(
                ([key, file]) => !["id", "employe_id", "created_at", "updated_at"].includes(key)
              )
              .map(([key, file]) => {
                const label =
                  labels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return (
                  <ListItem
                    key={key}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                      py: 0.5,
                      border: "1px solid",
                      borderColor: "grey.200",
                      "&:hover": {
                        bgcolor: "grey.100",
                      },
                    }}
                  >
                    <ListItemIcon>
                      {file ? (
                        <Avatar sx={{ bgcolor: "success.light", width: 28, height: 28 }}>
                          <Icon>check_circle</Icon>
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: "error.light", width: 28, height: 28 }}>
                          <Icon>error</Icon>
                        </Avatar>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {label}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {file ? file.name : "Aucun fichier"}
                        </Typography>
                      }
                    />

                    {file && (
                      <ListItemSecondaryAction>
                        <Tooltip title={`Prévisualiser`}>
                          <IconButton
                            size="small"
                            onClick={() => handlePreviewOpen(label, file)}
                            sx={{
                              mr: 2,
                              color: "secondary.dark",
                              "&:hover": {
                                color: "info.main",
                              },
                            }}
                          >
                            <Icon>visibility</Icon>
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                );
              })}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );

  // Contrat tab UI
  const renderPermissions = () => {
    const columns = [
      { Header: "Entité", accessor: "entity" },
      {
        Header: "Peut créer",
        accessor: "can_create",
        Cell: ({ value }) => (value ? "Oui" : "Non"),
      },
      {
        Header: "Peut lire",
        accessor: "can_read",
        Cell: ({ value }) => (value ? "Oui" : "Non"),
      },
      {
        Header: "Peut modifier",
        accessor: "can_update",
        Cell: ({ value }) => (value ? "Oui" : "Non"),
      },
      {
        Header: "Peut supprimer",
        accessor: "can_delete",
        Cell: ({ value }) => (value ? "Oui" : "Non"),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Tooltip
            title="modifier"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "rgba(26, 115, 232, 0.8)",
                  color: "#fff",
                  fontSize: "0.8rem",
                },
              },
            }}
          >
            <Button
              onClick={() => fetchPermission(row.original.entity)}
              variant="text"
              color="primary"
              size="large"
            >
              <Icon>edit</Icon>
            </Button>
          </Tooltip>
        ),
      },
    ];
    if (Object.keys(permissions).length === 0)
      return <Typography>Aucun permissions trouvé.</Typography>;
    return (
      <>
        <Card sx={{ p: 3 }}>
          <DataTable
            table={{ columns, rows: permissions }}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
        </Card>
      </>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            backgroundColor: "#f0f2f5", // background of tabs bar
            "& .MuiTab-root": {
              fontWeight: "bold",
              fontSize: "14px",
              textTransform: "none",
              minWidth: "120px",
              padding: "12px 16px",
            },
            "& .Mui-selected": {
              color: "info.main", // selected text color
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "info.main", // indicator color
              height: "3px",
              borderRadius: "2px",
            },
          }}
        >
          <Tab label="Personnel" value="personal" />
          <Tab label="Contrat" value="contrat" />
          <Tab label="Caisse Sociale" value="caisseSociale" />
          <Tab label="Paiement" value="paiement" />
          <Tab label="Documents" value="documents" />
          {auth.role === "SUPERVISOR" && <Tab label="Permissions" value="permissions" />}
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {activeTab === "personal" && renderPersonal()}
          {activeTab === "contrat" && renderContrat()}
          {activeTab === "caisseSociale" && renderCaisse()}
          {activeTab === "paiement" && renderPaiement()}
          {activeTab === "documents" && renderDocuments()}
          {activeTab === "permissions" && renderPermissions()}
        </Box>

        {/* Edit Personnal Dialog */}
        <Dialog
          open={editOpenPersonnal}
          onClose={() => setEditOpenPersonnal(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modifier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: "matricule", label: "Matricule", required: true },
                { name: "nom", label: "Nom", required: true },
                { name: "prenom", label: "Prénom", required: true },
                { name: "adresse", label: "Adresse", required: true },
                { name: "ville", label: "Ville", required: true },
                { name: "nationalite", label: "Nationalité", required: true },
                { name: "cin", label: "CIN" },
                { name: "sejour", label: "Sejour" },
                { name: "telephone_mobile", label: "Téléphone mobile", required: true },
                { name: "telephone_fixe", label: "Téléphone fixe" },
                { name: "lieu_de_naissance", label: "Date de naissance", required: true },
                { name: "email", label: "Email", required: true, type: "email" },
                { name: "nb_enfants", label: "Nombre d'enfants", type: "number", required: true },
                {
                  name: "nb_deductions",
                  label: "Nombre de deductions",
                  type: "number",
                  required: true,
                },
                {
                  name: "taux_anciennete",
                  label: "Taux d'ancienneté",
                  type: "number",
                  required: true,
                },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={editFormPersonnal[field.name]}
                    onChange={handlePersonnalChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]?.[0] || errors[field.name]}
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
                  value={editFormPersonnal.date_de_naissance}
                  onChange={handlePersonnalChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.date_de_naissance)}
                  helperText={errors.date_de_naissance?.[0] || errors.date_de_naissance}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date d'embauche"
                  name="date_embauche"
                  type="date"
                  value={editFormPersonnal.date_embauche}
                  onChange={handlePersonnalChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.date_embauche)}
                  helperText={errors.date_embauche?.[0] || errors.date_embauche}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date d'entrée"
                  name="date_entree"
                  type="date"
                  value={editFormPersonnal.date_entree}
                  onChange={handlePersonnalChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.date_entree)}
                  helperText={errors.date_entree?.[0] || errors.date_entree}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Civilité"
                  name="civilite"
                  fullWidth
                  value={editFormPersonnal.civilite}
                  onChange={handlePersonnalChange}
                  error={Boolean(errors.civilite)}
                  helperText={errors.civilite?.[0] || errors.civilite}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "45px",
                    },
                  }}
                >
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="MME">MME</MenuItem>
                  <MenuItem value="MLLE">MLLE</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Situation familiale"
                  name="situation_familiale"
                  fullWidth
                  value={editFormPersonnal.situation_familiale}
                  onChange={handlePersonnalChange}
                  error={Boolean(errors.situation_familiale)}
                  helperText={errors.situation_familiale?.[0] || errors.situation_familiale}
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
                  value={fonctions.find((f) => f.id === personal.fonction_id) || null}
                  onChange={(e, val) =>
                    setEditFormPersonnal((prev) => ({ ...prev, fonction_id: val?.id || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Fonction"
                      error={Boolean(errors.fonction_id)}
                      helperText={errors.fonction_id?.[0] || errors.fonction_id}
                      sx={{
                        ".MuiInputBase-root": {
                          height: "45px",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenPersonnal(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Contrat Dialog */}
        <Dialog
          open={editOpenContrat}
          onClose={() => setEditOpenContrat(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modifier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Type contrat"
                  name="type_contrat"
                  fullWidth
                  value={editFormContrat.type_contrat}
                  onChange={handleConctratChange}
                  error={Boolean(errors.type_contrat)}
                  helperText={errors.type_contrat}
                  sx={{ ".MuiInputBase-root": { height: "45px" } }}
                >
                  <MenuItem value="CDI">CDI</MenuItem>
                  <MenuItem value="CDD">CDD</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Type rémunération"
                  name="type_remuneration"
                  fullWidth
                  value={editFormContrat.type_remuneration}
                  onChange={handleConctratChange}
                  error={Boolean(errors.type_remuneration)}
                  helperText={errors.type_remuneration}
                  sx={{ ".MuiInputBase-root": { height: "45px" } }}
                >
                  <MenuItem value="MENSUEL">Mensuel</MenuItem>
                  <MenuItem value="HORAIRE">Horaire</MenuItem>
                  <MenuItem value="QUINZAINE">Quinzaine</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Statut"
                  name="statut"
                  fullWidth
                  value={editFormContrat.statut}
                  onChange={handleConctratChange}
                  error={Boolean(errors.statut)}
                  helperText={errors.statut}
                  sx={{ ".MuiInputBase-root": { height: "45px" } }}
                >
                  <MenuItem value="PERMANENT">Permanent</MenuItem>
                  <MenuItem value="VACATAIRE">Vacataire</MenuItem>
                  <MenuItem value="OCCASIONNEL">Occasionnel</MenuItem>
                  <MenuItem value="STAGAIRE">Stagaire</MenuItem>
                  <MenuItem value="TAHFIZ">Tahfiz</MenuItem>
                  <MenuItem value="PCS">PCS</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Date fin (optionnel)"
                  name="date_fin"
                  type="date"
                  value={editFormContrat.date_fin}
                  onChange={handleConctratChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.date_fin)}
                  helperText={errors.date_fin}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Salaire de base"
                  name="salaire_base"
                  type="number"
                  value={editFormContrat.salaire_base}
                  onChange={handleConctratChange}
                  fullWidth
                  error={Boolean(errors.salaire_base)}
                  helperText={errors.salaire_base}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Taux horaire"
                  name="taux_horaire"
                  type="number"
                  value={editFormContrat.taux_horaire}
                  onChange={handleConctratChange}
                  fullWidth
                  error={Boolean(errors.taux_horaire)}
                  helperText={errors.taux_horaire}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  label="Classification"
                  name="classification"
                  fullWidth
                  value={editFormContrat.classification}
                  onChange={handleConctratChange}
                  error={Boolean(errors.classification)}
                  helperText={errors.classification}
                  sx={{ ".MuiInputBase-root": { height: "45px" } }}
                >
                  {["NR", "SO", "DE", "IT", "IL", "AT", "CS", "MS", "MP"].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <label>
                  <input
                    type="checkbox"
                    name="est_avocat"
                    checked={editFormContrat.est_avocat}
                    onChange={handleConctratChange}
                  />{" "}
                  Est avocat
                </label>
              </Grid>
              <Grid item xs={12} md={6}>
                <label>
                  <input
                    type="checkbox"
                    name="est_domestique"
                    checked={editFormContrat.est_domestique}
                    onChange={handleConctratChange}
                  />{" "}
                  Est domestique
                </label>
              </Grid>
              <Grid item xs={12} md={6}>
                <label>
                  <input
                    type="checkbox"
                    name="est_saisonnier"
                    checked={editFormContrat.est_saisonnier}
                    onChange={handleConctratChange}
                  />{" "}
                  Est saisonnier
                </label>
              </Grid>

              {editFormContrat.est_saisonnier && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre de jours de saisonnier"
                    name="nb_jours_saisonnier"
                    type="number"
                    value={editFormContrat.nb_jours_saisonnier}
                    onChange={handleConctratChange}
                    fullWidth
                    error={Boolean(errors.nb_jours_saisonnier)}
                    helperText={errors.nb_jours_saisonnier}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <label>
                  <input
                    type="checkbox"
                    name="nouveau_declarant"
                    checked={editFormContrat.nouveau_declarant}
                    onChange={handleConctratChange}
                  />{" "}
                  Nouveau déclarant
                </label>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenContrat(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Caisse Dialog */}
        <Dialog
          open={editOpenCaisse}
          onClose={() => setEditOpenCaisse(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modifier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: "numero_cnss", label: "Numéro CNSS", required: true },
                { name: "numero_mutuelle", label: "Numéro Mutuelle", required: true },
                { name: "numero_adherent_cimr", label: "Numéro Adhérent CIMR", required: true },
                { name: "numero_categorie_cimr", label: "Numéro Catégorie CIMR", required: true },
                { name: "matricule_cimr", label: "Matricule CIMR", required: true },
                {
                  name: "taux_cotisation_cimr",
                  label: "Taux cotisation CIMR",
                  required: true,
                  type: "number",
                },
                {
                  name: "date_affiliation_cimr",
                  label: "Date affiliation CIMR",
                  required: true,
                  type: "date",
                },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={editFormCaisse[field.name]}
                    onChange={handleCaisseChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]}
                    required={field.required}
                    type={field.type || "text"}
                    InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenCaisse(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Paiement Dialog */}
        <Dialog
          open={editOpenPaiement}
          onClose={() => setEditOpenPaiement(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modifier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: "mode_paiement", label: "Mode paiement" },
                { name: "banque", label: "Banque" },
                { name: "numero_compte", label: "Numéro compte" },
                { name: "adresse_banque", label: "Adresse banque" },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <TextField
                    fullWidth
                    name={field.name}
                    label={field.label}
                    value={editFormPaiement[field.name]}
                    onChange={handlePaiementChange}
                    error={Boolean(errors[field.name])}
                    helperText={errors[field.name]}
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenPaiement(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Document Dialog */}
        <Dialog
          open={editOpenDocument}
          onClose={() => {
            setEditOpenDocument(false);
            fetchDocuments();
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Modifier <br />
            <Typography
              variant="caption"
              gutterBottom
              sx={{ color: "secondary.main", fontWeight: "bold" }}
            >
              Clic droit pour supprimer un fichier
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: "chemin_cin", label: "CIN" },
                { name: "chemin_cnss", label: "CNSS" },
                { name: "chemin_contrat_travail", label: "Contrat travail" },
                { name: "chemin_tableau_amortissement", label: "Tableau amortissement" },
                { name: "lettre_demission", label: "Lettre démission" },
                { name: "diplome_un", label: "Diplôme 1" },
                { name: "diplome_deux", label: "Diplôme 2" },
                { name: "diplome_trois", label: "Diplôme 3" },
                { name: "diplome_quatre", label: "Diplôme 4" },
                { name: "diplome_cinq", label: "Diplôme 5" },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <Button
                    variant="outlined"
                    color="info"
                    component="label"
                    fullWidth
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const updatedDocs = { ...editFormDocument, [field.name]: null };
                      setEditFormDocument(updatedDocs);

                      const input = document.querySelector(`input[name="${field.name}"]`);
                      if (input) input.value = ""; // Clear input
                    }}
                    sx={
                      editFormDocument[field.name]
                        ? { color: "info.main" }
                        : { color: "secondary.main" }
                    }
                  >
                    {editFormDocument[field.name] ? field.label : `Choisir fichier: ${field.label}`}
                    <input
                      hidden
                      type="file"
                      name={field.name}
                      onChange={handleDocumentChange}
                      accept="application/pdf/*"
                    />
                  </Button>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenDocument(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit Permission Dialog */}
        <Dialog
          open={editOpenPermission}
          onClose={() => setEditOpenPermission(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Modifier</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {[
                { name: "can_create", label: "Peut créee" },
                { name: "can_read", label: "Peut lire" },
                { name: "can_update", label: "Peut modifier" },
                { name: "can_delete", label: "Peut supprimer" },
              ].map((field) => (
                <Grid item xs={12} md={6} key={field.name}>
                  <label>
                    <input
                      name={field.name}
                      checked={editFormPermission[field.name]}
                      onChange={handlePermissionsChange}
                      type="checkbox"
                    />{" "}
                    {field.label}
                  </label>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpenPermission(false)}>Annuler</Button>
            <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog
          open={previewOpen}
          onClose={handlePreviewClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Prévisualisation du fichier
            {previewFile && (
              <Chip
                label={previewFile.name}
                size="small"
                sx={{
                  bgcolor: "white",
                  color: "secondary.main",
                  ml: "auto",
                }}
              />
            )}
          </DialogTitle>

          <DialogContent dividers sx={{ p: 0 }}>
            {previewFile ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                  bgcolor: "grey.50",
                }}
              >
                <embed
                  src={previewFile.file}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  style={{ borderRadius: 8 }}
                />
              </Box>
            ) : null}
          </DialogContent>

          <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
            <Button
              onClick={handlePreviewClose}
              variant="contained"
              sx={{ borderRadius: 2, color: "#fff" }}
            >
              Fermer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirme Delete Dialog */}
        <Dialog
          open={confirmDeleteOpen}
          onClose={handleCancelDelete}
          aria-labelledby="confirm-delete-title"
          aria-describedby="confirm-delete-description"
        >
          <DialogTitle id="confirm-delete-title">Confirmation</DialogTitle>
          <DialogContent>
            <Typography id="confirm-delete-description" sx={{ mt: 1 }}>
              Êtes-vous sûr de vouloir supprimer cet employé ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Annuler</Button>
            <Button
              onClick={handleDeleteConfirmed}
              variant="text"
              color="error"
              sx={{ color: "error.main" }}
            >
              Confirmer la suppression
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </MDBox>
    </DashboardLayout>
  );
}
