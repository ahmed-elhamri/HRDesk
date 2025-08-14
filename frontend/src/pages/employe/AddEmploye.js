/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CardHeader,
  CardContent,
  Paper,
  ListItemSecondaryAction,
  Chip,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { green } from "@mui/material/colors";

const SLIDES = {
  EMPLOYE: 0,
  CONTRAT: 1,
  CAISSE_SOCIALE: 2,
  PAIEMENT: 3,
  DOCUMENTS: 4,
  REVIEW: 5,
};

export default function AddEmploye() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // States for data
  const [fonctions, setFonctions] = useState([]);

  // Current slide index
  const [activeStep, setActiveStep] = useState(SLIDES.EMPLOYE);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Confirmation popup
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const countdownTimer = useRef(null);
  const [countdown, setCountdown] = useState(10);

  const handlePreviewOpen = (file) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };
  // --- Form state for all tables ---

  // 1. Employe
  const [employe, setEmploye] = useState({
    fonction_id: "",
    matricule: "",
    civilite: "M",
    nom: "",
    prenom: "",
    adresse: "",
    ville: "",
    nationalite: "",
    cin: "",
    sejour: "",
    telephone_mobile: "",
    telephone_fixe: "",
    email: "",
    date_de_naissance: "",
    lieu_de_naissance: "",
    email_personnel: "",
    situation_familiale: "CELIBATAIRE",
    nb_enfants: "",
    nb_deductions: "",
    date_embauche: "",
    date_entree: "",
    taux_anciennete: "",
  });

  // 2. Contrat
  const [contrat, setContrat] = useState({
    type_contrat: "CDI",
    type_remuneration: "MENSUEL",
    statut: "PERMANENT",
    date_fin: "",
    salaire_base: "",
    taux_horaire: "",
    classification: "NR",
    est_avocat: false,
    est_domestique: false,
    est_saisonnier: false,
    nb_jours_saisonnier: "",
    nouveau_declarant: false,
  });

  // 3. Caisse Sociale
  const [caisse, setCaisse] = useState({
    numero_cnss: "",
    numero_mutuelle: "",
    numero_adherent_cimr: "",
    numero_categorie_cimr: "",
    matricule_cimr: "",
    taux_cotisation_cimr: "",
    date_affiliation_cimr: "",
  });

  // 4. Paiement
  const [paiement, setPaiement] = useState({
    mode_paiement: "",
    banque: "",
    numero_compte: "",
    adresse_banque: "",
  });

  // 5. Documents (files)
  const [documents, setDocuments] = useState({
    chemin_cin: null,
    chemin_cnss: null,
    chemin_contrat_travail: null,
    chemin_tableau_amortissement: null,
    lettre_demission: null,
    diplome_un: null,
    diplome_deux: null,
    diplome_trois: null,
    diplome_quatre: null,
    diplome_cinq: null,
  });

  // Errors for validation per slide
  const [errors, setErrors] = useState({});

  // --- Fetch fonctions on mount ---
  useEffect(() => {
    const fetchFonctions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/fonctions");
        setFonctions(res.data);
        setLoadError(false);
      } catch (error) {
        console.error("Error fetching fonctions:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchFonctions();
  }, []);

  // --- Validation rules per slide ---

  // Simple helper functions for validation
  const isRequired = (val) => val !== "" && val !== null && val !== undefined;

  // Validate Employe slide fields (required fields only)
  const validateEmploye = () => {
    let errs = {};

    if (!isRequired(employe.fonction_id)) errs.fonction_id = "Fonction is required";

    if (!isRequired(employe.matricule)) errs.matricule = "Matricule is required";

    if (!isRequired(employe.civilite)) errs.civilite = "Civilité is required";
    else if (!["M", "MME", "MLLE"].includes(employe.civilite)) errs.civilite = "Civilité invalide";

    if (!isRequired(employe.nom)) errs.nom = "Nom is required";
    if (!isRequired(employe.prenom)) errs.prenom = "Prénom is required";
    if (!isRequired(employe.adresse)) errs.adresse = "Adresse est requise";
    if (!isRequired(employe.ville)) errs.ville = "Ville est requise";
    if (!isRequired(employe.nationalite)) errs.nationalite = "Nationalité est requise";

    // CIN and SEJOUR are nullable – no validation needed unless you want regex check

    if (!isRequired(employe.telephone_mobile))
      errs.telephone_mobile = "Téléphone mobile est requis";
    // téléphone_fixe is nullable

    if (!isRequired(employe.email)) errs.email = "Email est requis";
    else if (!/\S+@\S+\.\S+/.test(employe.email)) errs.email = "Email invalide";

    if (!isRequired(employe.date_de_naissance))
      errs.date_de_naissance = "Date de naissance requise";
    if (!isRequired(employe.lieu_de_naissance)) errs.lieu_de_naissance = "Lieu de naissance requis";

    if (!isRequired(employe.situation_familiale))
      errs.situation_familiale = "Situation familiale requise";
    else if (!["MARIE", "CELIBATAIRE"].includes(employe.situation_familiale))
      errs.situation_familiale = "Valeur de situation familiale invalide";

    if (!isRequired(employe.nb_enfants)) errs.nb_enfants = "Nombre d'enfants requis";
    else if (isNaN(Number(employe.nb_enfants))) errs.nb_enfants = "Doit être un nombre";

    if (!isRequired(employe.nb_deductions)) errs.nb_deductions = "Nombre de déductions requis";
    else if (isNaN(Number(employe.nb_deductions))) errs.nb_deductions = "Doit être un nombre";

    if (!isRequired(employe.date_embauche)) errs.date_embauche = "Date d'embauche requise";
    if (!isRequired(employe.date_entree)) errs.date_entree = "Date d'entrée requise";

    if (!isRequired(employe.taux_anciennete)) errs.taux_anciennete = "Taux ancienneté requis";
    else if (isNaN(Number(employe.taux_anciennete)))
      errs.taux_anciennete = "Taux doit être un nombre";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateContrat = () => {
    let errs = {};
    if (!isRequired(contrat.type_contrat)) errs.type_contrat = "Type contrat is required";
    if (!isRequired(contrat.type_remuneration))
      errs.type_remuneration = "Type rémunération is required";
    if (!isRequired(contrat.statut)) errs.statut = "Statut is required";

    if (contrat.date_fin && isNaN(Date.parse(contrat.date_fin))) errs.date_fin = "Date fin invalid";

    if (!isRequired(contrat.salaire_base)) errs.salaire_base = "Salaire base is required";
    else if (isNaN(Number(contrat.salaire_base)))
      errs.salaire_base = "Salaire base doit être un nombre";

    if (!isRequired(contrat.taux_horaire)) errs.taux_horaire = "Taux horaire is required";
    else if (isNaN(Number(contrat.taux_horaire)))
      errs.taux_horaire = "Taux horaire doit être un nombre";

    if (!isRequired(contrat.classification)) errs.classification = "Classification is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Caisse Sociale slide
  const validateCaisse = () => {
    let errs = {};
    if (!isRequired(caisse.numero_cnss)) errs.numero_cnss = "Numéro CnssCotisations est requis";
    if (!isRequired(caisse.numero_mutuelle)) errs.numero_mutuelle = "Numéro Mutuelle est requis";
    if (!isRequired(caisse.numero_adherent_cimr))
      errs.numero_adherent_cimr = "Numéro Adhérent CIMR est requis";
    if (!isRequired(caisse.numero_categorie_cimr))
      errs.numero_categorie_cimr = "Catégorie CIMR est requise";
    if (!isRequired(caisse.matricule_cimr)) errs.matricule_cimr = "Matricule CIMR est requis";

    if (!isRequired(caisse.taux_cotisation_cimr))
      errs.taux_cotisation_cimr = "Taux cotisation CIMR est requis";
    else if (isNaN(Number(caisse.taux_cotisation_cimr)))
      errs.taux_cotisation_cimr = "Taux cotisation doit être un nombre";

    if (!isRequired(caisse.date_affiliation_cimr))
      errs.date_affiliation_cimr = "Date affiliation CIMR est requise";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Paiement slide (all nullable so no required)
  const validatePaiement = () => {
    setErrors({});
    return true; // No required fields
  };

  // Documents slide has no required fields, no validation needed
  const validateDocuments = () => {
    setErrors({});
    return true;
  };

  // --- Handlers for inputs ---

  // Generic handler for employe fields
  const handleEmployeChange = (e) => {
    const { name, value } = e.target;
    setEmploye((prev) => ({ ...prev, [name]: value }));
  };

  // Contrat inputs
  const handleContratChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContrat((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Caisse Sociale inputs
  const handleCaisseChange = (e) => {
    const { name, value } = e.target;
    setCaisse((prev) => ({ ...prev, [name]: value }));
  };

  // Paiement inputs
  const handlePaiementChange = (e) => {
    const { name, value } = e.target;
    setPaiement((prev) => ({ ...prev, [name]: value }));
  };

  // Documents inputs (file inputs)
  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prev) => ({ ...prev, [name]: files.length > 0 ? files[0] : null }));
  };

  // const handleDeleteDocument = (name) => {
  //   const updatedDocuments = { ...documents, [name]: null };
  //   setDocuments(updatedDocuments);
  // };

  // --- Navigation handlers ---

  const handleNext = () => {
    let valid = false;
    switch (activeStep) {
      case SLIDES.EMPLOYE:
        valid = validateEmploye();
        break;
      case SLIDES.CONTRAT:
        valid = validateContrat();
        break;
      case SLIDES.CAISSE_SOCIALE:
        valid = validateCaisse();
        break;
      case SLIDES.PAIEMENT:
        valid = validatePaiement();
        break;
      case SLIDES.DOCUMENTS:
        valid = validateDocuments();
        break;
      default:
        valid = true;
    }
    if (valid) {
      setErrors({});
      setActiveStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((s) => Math.max(s - 1, 0));
  };

  // --- Submit handler ---

  const handleSubmit = async () => {
    try {
      // Step 1: Create Employe and get id
      const employePayload = { ...employe };

      const empRes = await axios.post("http://localhost:8000/api/employes", employePayload);
      const employeId = empRes.data.id;

      // Step 2: Post Contrat
      const contratPayload = {
        employe_id: employeId,
        ...contrat,
      };
      console.log(contratPayload);
      await axios.post("http://localhost:8000/api/contrats", contratPayload);

      // Step 3: Post Caisse Sociale
      const caissePayload = {
        employe_id: employeId,
        ...caisse,
      };
      await axios.post("http://localhost:8000/api/caisses-sociales", caissePayload);

      // Step 4: Post Paiement
      const paiementPayload = {
        employe_id: employeId,
        ...paiement,
      };
      await axios.post("http://localhost:8000/api/paiements", paiementPayload);

      // Step 5: Post Documents (handle file uploads with FormData)
      const formData = new FormData();
      formData.append("employe_id", employeId);
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
      await axios.post("http://localhost:8000/api/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Success: open dialog and start countdown
      setSuccessDialogOpen(true);
      setCountdown(10);
      countdownTimer.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(countdownTimer.current);
            navigate("/employes");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
        // If errors, go to slide 0 so user can see
        setActiveStep(SLIDES.EMPLOYE);
      } else {
        alert("Error during submission. See console.");
        console.error(err);
      }
    }
  };

  const displayField = (label, value) => (
    <Grid item xs={12} key={label} sx={{ display: "flex", gap: 0.5 }}>
      <Typography color="textSecondary" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
        {label}:
      </Typography>
      <Typography sx={{ fontSize: "1rem" }}>{value || "-"}</Typography>
    </Grid>
  );

  // --- UI for each slide ---

  const SlideEmploye = (
    <>
      <Typography variant="h6" gutterBottom>
        Informations Employé
      </Typography>
      <Grid container spacing={2}>
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
          { name: "nb_deductions", label: "Nombre de deductions", type: "number", required: true },
          { name: "taux_anciennete", label: "Taux d'ancienneté", type: "number", required: true },
        ].map((field) => (
          <Grid item xs={12} md={6} key={field.name}>
            <TextField
              fullWidth
              name={field.name}
              label={field.label}
              value={employe[field.name]}
              onChange={handleEmployeChange}
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
            value={employe.date_de_naissance}
            onChange={handleEmployeChange}
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
            value={employe.date_embauche}
            onChange={handleEmployeChange}
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
            value={employe.date_entree}
            onChange={handleEmployeChange}
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
            value={employe.civilite}
            onChange={handleEmployeChange}
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
            value={employe.situation_familiale}
            onChange={handleEmployeChange}
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
            value={fonctions.find((f) => f.id === employe.fonction_id) || null}
            onChange={(e, val) => setEmploye((prev) => ({ ...prev, fonction_id: val?.id || "" }))}
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
    </>
  );

  const SlideContrat = (
    <>
      <Typography variant="h6" gutterBottom>
        Contrat
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            select
            label="Type contrat"
            name="type_contrat"
            fullWidth
            value={contrat.type_contrat}
            onChange={handleContratChange}
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
            value={contrat.type_remuneration}
            onChange={handleContratChange}
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
            value={contrat.statut}
            onChange={handleContratChange}
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
            value={contrat.date_fin}
            onChange={handleContratChange}
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
            value={contrat.salaire_base}
            onChange={handleContratChange}
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
            value={contrat.taux_horaire}
            onChange={handleContratChange}
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
            value={contrat.classification}
            onChange={handleContratChange}
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
              checked={contrat.est_avocat}
              onChange={handleContratChange}
            />{" "}
            Est avocat
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            <input
              type="checkbox"
              name="est_domestique"
              checked={contrat.est_domestique}
              onChange={handleContratChange}
            />{" "}
            Est domestique
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            <input
              type="checkbox"
              name="est_saisonnier"
              checked={contrat.est_saisonnier}
              onChange={handleContratChange}
            />{" "}
            Est saisonnier
          </label>
        </Grid>

        {contrat.est_saisonnier && (
          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre de jours de saisonnier"
              name="nb_jours_saisonnier"
              type="number"
              value={contrat.nb_jours_saisonnier}
              onChange={handleContratChange}
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
              checked={contrat.nouveau_declarant}
              onChange={handleContratChange}
            />{" "}
            Nouveau déclarant
          </label>
        </Grid>
      </Grid>
    </>
  );

  const SlideCaisse = (
    <>
      <Typography variant="h6" gutterBottom>
        Caisse Sociale
      </Typography>
      <Grid container spacing={2}>
        {[
          { name: "numero_cnss", label: "Numéro CnssCotisations", required: true },
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
              value={caisse[field.name]}
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
    </>
  );

  const SlidePaiement = (
    <>
      <Typography variant="h6" gutterBottom>
        Paiement (optionnel)
      </Typography>
      <Grid container spacing={2}>
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
              value={paiement[field.name]}
              onChange={handlePaiementChange}
              error={Boolean(errors[field.name])}
              helperText={errors[field.name]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );

  const SlideDocuments = (
    <>
      <Typography variant="h6" gutterBottom>
        Documents
      </Typography>
      <Typography
        variant="caption"
        gutterBottom
        sx={{ color: "secondary.main", fontWeight: "bold" }}
      >
        Clic droit pour supprimer un fichier
      </Typography>
      <Grid container spacing={2}>
        {[
          { name: "chemin_cin", label: "CIN" },
          { name: "chemin_cnss", label: "CnssCotisations" },
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
                const updatedDocs = { ...documents, [field.name]: null };
                setDocuments(updatedDocs);
                const input = document.querySelector(`input[name="${field.name}"]`);
                if (input) input.value = ""; // Clear input
              }}
              sx={documents[field.name] ? { color: "info.main" } : { color: "secondary.main" }}
            >
              {documents[field.name]
                ? documents[field.name].name
                : `Choisir fichier: ${field.label}`}
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
    </>
  );

  const SlideReview = (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 600,
            borderBottom: "2px solid",
            pb: 1,
            mb: 3,
          }}
        >
          Vérification des informations
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Employee Information */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <Icon>person</Icon>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Employé
                </Typography>
              }
            />
            <CardContent>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontFamily: "Monaco, Consolas, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {/*{JSON.stringify(employe, null, 2)}*/}
                  {displayField(
                    "Fonction",
                    employe.fonction_id
                      ? fonctions.find((f) => f.id === employe.fonction_id).designation
                      : "-"
                  )}
                  {displayField("Nom", employe.nom)}
                  {displayField("Prénom", employe.prenom)}
                  {displayField("Adresse", employe.adresse)}
                  {displayField("Ville", employe.ville)}
                  {displayField("Nationalité", employe.nationalite)}
                  {displayField("CIN", employe.cin)}
                  {displayField("Sejour", employe.sejour)}
                  {displayField("Téléphone mobile", employe.telephone_mobile)}
                  {displayField("Téléphone fixe", employe.telephone_fixe)}
                  {displayField("Email", employe.email)}
                  {displayField("Nombre d'enfants", employe.nb_enfants)}
                  {displayField("Nombre de deductions", employe.nb_deductions)}
                  {displayField("Date de naissance", employe.date_de_naissance)}
                  {displayField("Date d'embauche", employe.date_embauche)}
                  {displayField("Date d'entrée", employe.date_embauche)}
                  {displayField("Civilité", employe.civilite)}
                  {displayField("Situation familiale", employe.situation_familiale)}
                  {displayField("Taux d'ancienneté", employe.taux_anciennete)}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Contract Information */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <Icon>description</Icon>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="secondary.main">
                  Contrat
                </Typography>
              }
            />
            <CardContent>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontFamily: "Monaco, Consolas, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {/*{JSON.stringify(contrat, null, 2)}*/}
                  {displayField("Type contrat", contrat.type_contrat)}
                  {displayField("Type rémunération", contrat.type_remuneration)}
                  {displayField("Statut", contrat.statut)}
                  {displayField("Date fin", contrat.date_fin)}
                  {displayField("Salaire de base", contrat.salaire_base)}
                  {displayField("Taux horaire", contrat.taux_horaire)}
                  {displayField("Avocat", contrat.est_avocat ? "Oui" : "Non")}
                  {displayField("Domestique", contrat.est_domestique ? "Oui" : "Non")}
                  {displayField("Saisonnier", contrat.est_saisonnier ? "Oui" : "Non")}
                  {displayField("Nombre de jours de saisonnier", contrat.nb_jours_saisonnier)}
                  {displayField("Nouveau declarant", contrat.nouveau_declarant ? "Oui" : "Non")}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Social Security Information */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <Icon>security</Icon>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  Caisse Sociale
                </Typography>
              }
            />
            <CardContent>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontFamily: "Monaco, Consolas, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {/*{JSON.stringify(caisse, null, 2)}*/}
                  {displayField("Numéro CnssCotisations", caisse.numero_cnss)}
                  {displayField("Numéro Mutuelle", caisse.numero_mutuelle)}
                  {displayField("Numéro Adhérent CIMR", caisse.numero_adherent_cimr)}
                  {displayField("Numéro Catégorie CIMR", caisse.numero_categorie_cimr)}
                  {displayField("Matricule CIMR", caisse.matricule_cimr)}
                  {displayField("Taux cotisation CIMR", caisse.taux_cotisation_cimr)}
                  {displayField("Date affiliation CIMR", caisse.date_affiliation_cimr)}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Information */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                elevation: 4,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <Icon>payment</Icon>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  Paiement
                </Typography>
              }
            />
            <CardContent>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    fontFamily: "Monaco, Consolas, monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {/*{JSON.stringify(paiement, null, 2)}*/}
                  {displayField("Mode paiement", paiement.mode_paiement)}
                  {displayField("Banque", paiement.banque)}
                  {displayField("Numéro compte", paiement.numero_compte)}
                  {displayField("adresse_banque", paiement.adresse_banque)}
                </pre>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <Icon>attach_file</Icon>
                </Avatar>
              }
              title={
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  Documents
                </Typography>
              }
            />
            <CardContent>
              <List>
                {Object.entries(documents).map(([key, file]) => (
                  <ListItem
                    key={key}
                    sx={{
                      bgcolor: "grey.50",
                      borderRadius: 2,
                      mb: 1,
                      px: 2,
                      border: "1px solid",
                      borderColor: "grey.200",
                      "&:hover": {
                        bgcolor: "grey.100",
                      },
                    }}
                  >
                    <ListItemIcon>
                      {file ? (
                        <Avatar sx={{ bgcolor: "success.light", width: 32, height: 32 }}>
                          <Icon>check_circle</Icon>
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: "error.light", width: 32, height: 32 }}>
                          <Icon>error</Icon>
                        </Avatar>
                      )}
                    </ListItemIcon>

                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {key}
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
                        <Tooltip title={`Prévisualiser ${key}`}>
                          <IconButton
                            size="small"
                            onClick={() => handlePreviewOpen(file)}
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
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Preview Dialog */}
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
                src={URL.createObjectURL(previewFile)}
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
    </>
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
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              {activeStep === SLIDES.EMPLOYE && SlideEmploye}
              {activeStep === SLIDES.CONTRAT && SlideContrat}
              {activeStep === SLIDES.CAISSE_SOCIALE && SlideCaisse}
              {activeStep === SLIDES.PAIEMENT && SlidePaiement}
              {activeStep === SLIDES.DOCUMENTS && SlideDocuments}
              {activeStep === SLIDES.REVIEW && SlideReview}

              <MDBox mt={3} display="flex" justifyContent="space-between">
                {activeStep > SLIDES.EMPLOYE && (
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={handleBack}
                    sx={{ color: "info.main" }}
                  >
                    Précédent
                  </Button>
                )}

                {activeStep < SLIDES.REVIEW && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    sx={{ color: "#fff" }}
                  >
                    Suivant
                  </Button>
                )}

                {activeStep === SLIDES.REVIEW && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ color: "#fff" }}
                  >
                    Envoyer
                  </Button>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1, minWidth: 400 },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 0 }}>
          <Icon sx={{ color: green[500], fontSize: 30 }}>check_circle</Icon>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employé ajouté avec succès
          </Typography>
          <IconButton onClick={() => setSuccessDialogOpen(false)} size="small">
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography>
            La page sera redirigée vers la liste des employés dans <strong>{countdown}</strong>{" "}
            secondes.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              clearInterval(countdownTimer.current);
              setSuccessDialogOpen(false);
              navigate("/employes");
            }}
            startIcon={<Icon>check_circle</Icon>}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
