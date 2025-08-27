/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState } from "react";
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
  Menu,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import { useAuth } from "../context/AuthContext";
import { setAuthToken } from "./http";

// Combined component
export default function Rubriques({ employe_id }) {
  const { permissions } = useAuth();
  console.log(employe_id);
  // Datasets
  const [employePrimes, setEmployePrimes] = useState([]);
  const [employe, setEmploye] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [heuresSupp, setHeuresSupp] = useState([]);
  const [primes, setPrimes] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Global snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Add dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const addMenuOpen = Boolean(anchorEl);
  const openAddMenu = (e) => setAnchorEl(e.currentTarget);
  const closeAddMenu = () => setAnchorEl(null);

  // Which dialog is open: "prime" | "absence" | "heure" | null
  const [activeDialog, setActiveDialog] = useState(null);

  // Form states
  const [primeForm, setPrimeForm] = useState({
    id: null,
    employe_id: employe_id || "",
    prime_id: "",
    montant: "",
  });
  const [primeErrors, setPrimeErrors] = useState({});

  const [absenceForm, setAbsenceForm] = useState({
    id: null,
    employe_id: employe_id,
    date: "",
  });
  const [absenceErrors, setAbsenceErrors] = useState({});

  const [heureForm, setHeureForm] = useState({
    id: null,
    employe_id: employe_id,
    date: "",
    jour: "",
    periode: "",
    nombre: "",
  });
  const [heureErrors, setHeureErrors] = useState({});

  const [joursForm, setJoursForm] = useState({
    employe_id: employe_id,
    jours_travailles: "",
  });
  const [joursErrors, setJoursErrors] = useState({});

  // Delete confirmation (generic)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null }); // type: 'prime'|'absence'|'heure'

  // Endpoints
  const API = {
    employePrimes: "http://localhost:8000/api/employe-primes",
    primes: "http://localhost:8000/api/primes",
    absences: `http://localhost:8000/api/absences`,
    heuresSupp: `http://localhost:8000/api/heures-supplementaires`,
    employe: `http://localhost:8000/api/employes/${employe_id}`,
  };

  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const epRes = await axios.get(API.employePrimes, { params: { employe_id } });
      const primesRes = await axios.get(API.primes);
      const absRes = await axios.get(`${API.absences}/${employe_id}`);
      console.log(absRes.data);
      const hsRes = await axios.get(`${API.heuresSupp}/${employe_id}`);
      const empRes = await axios.get(API.employe);
      setEmployePrimes(epRes.data || []);
      setPrimes(primesRes.data || []);
      setAbsences(absRes.data || []);
      setHeuresSupp(hsRes.data || []);
      setEmploye(empRes.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [employe_id]);

  // Helpers
  const can = (entity, action) =>
    permissions.find((p) => p.entity === entity)?.[`can_${action}`] === 1;

  const resetForms = () => {
    setPrimeForm({
      id: null,
      employe_id: employe_id,
      prime_id: "",
      montant: "",
    });
    setPrimeErrors({});

    setAbsenceForm({
      id: null,
      employe_id: employe_id,
      date: "",
    });
    setAbsenceErrors({});

    setHeureForm({
      id: null,
      employe_id: employe_id,
      date: "",
      jour: "",
      periode: "",
      nombre: "",
    });
    setHeureErrors({});

    setJoursForm({
      employe_id: employe_id,
      jours_travailles: "",
    });
    setJoursErrors({});
  };

  const handleOpenDialog = (type) => {
    closeAddMenu();
    resetForms();
    setActiveDialog(type);
  };

  const handleCloseDialog = () => {
    setActiveDialog(null);
  };

  // --- CREATE / UPDATE handlers ---
  const submitPrime = async () => {
    try {
      const payload = {
        employe_id: primeForm.employe_id,
        prime_id: primeForm.prime_id,
        montant: primeForm.montant,
        id: primeForm.id ?? undefined,
      };

      if (primeForm.id) {
        await axios.put(`${API.employePrimes}/${primeForm.id}`, payload);
        setSnackbarMessage("Prime modifiée avec succès !");
      } else {
        await axios.post(API.employePrimes, payload);
        setSnackbarMessage("Prime ajoutée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAll();
      handleCloseDialog();
    } catch (err) {
      if (err.response?.status === 422) {
        setPrimeErrors(err.response.data.errors || {});
        setSnackbarMessage(
          primeForm.id ? "Erreur lors de la modification !" : "Erreur lors de l'ajout !"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const submitAbsence = async () => {
    try {
      const payload = {
        employe_id: absenceForm.employe_id,
        date: absenceForm.date,
        id: absenceForm.id ?? undefined,
      };

      if (absenceForm.id) {
        await axios.put(`${API.absences}/${absenceForm.id}`, payload);
        setSnackbarMessage("Absence modifiée avec succès !");
      } else {
        await axios.post(API.absences, payload);
        setSnackbarMessage("Absence ajoutée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAll();
      handleCloseDialog();
    } catch (err) {
      if (err.response?.status === 422) {
        setAbsenceErrors(err.response.data.errors || {});
        setSnackbarMessage(
          absenceForm.id ? "Erreur lors de la modification !" : "Erreur lors de l'ajout !"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const submitHeure = async () => {
    try {
      const payload = {
        employe_id: heureForm.employe_id,
        date: heureForm.date,
        jour: heureForm.jour,
        periode: heureForm.periode,
        nombre: heureForm.nombre,
        id: heureForm.id ?? undefined,
      };

      if (heureForm.id) {
        await axios.put(`${API.heuresSupp}/${heureForm.id}`, payload);
        setSnackbarMessage("Heure supplémentaire modifiée avec succès !");
      } else {
        await axios.post(API.heuresSupp, payload);
        setSnackbarMessage("Heure supplémentaire ajoutée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAll();
      handleCloseDialog();
    } catch (err) {
      if (err.response?.status === 422) {
        setHeureErrors(err.response.data.errors || {});
        setSnackbarMessage(
          heureForm.id ? "Erreur lors de la modification !" : "Erreur lors de l'ajout !"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const submitJours = async () => {
    try {
      const payload = {
        jours_travailles: joursForm.jours_travailles,
      };
      await axios.post(`http://localhost:8000/api/jours-trav/${employe_id}`, payload);
      setSnackbarMessage("Jours travaillés modifiée avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAll();
      handleCloseDialog();
    } catch (err) {
      if (err.response?.status === 422) {
        setHeureErrors(err.response.data.errors || {});
        setSnackbarMessage("Erreur lors de la modification !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // --- EDIT handlers (populate forms) ---
  const editPrime = (row) => {
    setPrimeForm({
      id: row.id,
      employe_id: row.employe_id ?? employe_id ?? "",
      prime_id: row.prime_id ?? row.prime?.id ?? "",
      montant: row.montant ?? "",
    });
    setActiveDialog("prime");
  };

  const editAbsence = (row) => {
    setAbsenceForm({
      id: row.id,
      employe_id: row.employe_id ?? "",
      date: row.date ?? "",
    });
    setActiveDialog("absence");
  };

  const editHeure = (row) => {
    setHeureForm({
      id: row.id,
      employe_id: row.employe_id ?? "",
      date: row.date ?? "",
      jour: row.jour ?? "",
      periode: row.periode ?? "",
      nombre: row.nombre ?? "",
    });
    setActiveDialog("heure");
  };

  const editJours = (row) => {
    setJoursForm({
      employe_id: row.employe_id ?? "",
      jours_travailles: row.jours_travailles ?? "",
    });
    setActiveDialog("jours");
  };

  // --- DELETE ---
  const askDelete = (type, id) => {
    setDeleteTarget({ type, id });
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { type, id } = deleteTarget;
      if (type === "prime") {
        await axios.delete(`${API.employePrimes}/${id}`);
        setSnackbarMessage("Prime supprimée avec succès !");
      } else if (type === "absence") {
        await axios.delete(`${API.absences}/${id}`);
        setSnackbarMessage("Absence supprimée avec succès !");
      } else if (type === "heure") {
        await axios.delete(`${API.heuresSupp}/${id}`);
        setSnackbarMessage("Heure supplémentaire supprimée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchAll();
    } catch (e) {
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteTarget({ type: null, id: null });
    }
  };

  // --- Unified rows ---
  const rows = useMemo(() => {
    const primeRows = (employePrimes || []).map((r) => ({
      __type: "prime",
      id: r.id,
      libelle: r.prime?.motif ?? "Prime",
      value: r.montant,
      raw: r,
    }));

    const absenceRows = (absences || []).map((r) => ({
      __type: "absence",
      id: r.id,
      libelle: "Absence",
      value: 1, // always 1 on table
      raw: r,
    }));

    const heureRows = (heuresSupp || []).map((r) => ({
      __type: "heure",
      id: r.id,
      libelle: `Heure supp (${r.jour ?? ""}${r.periode ? ` - ${r.periode}` : ""})`,
      value: r.nombre,
      raw: r,
    }));

    const e = Array.isArray(employe) ? employe[0] : employe; // robust if it ever becomes an array
    const joursRows = e
      ? [
          {
            __type: "jours",
            id: e.id ?? "jours", // give it a stable id for actions/keys
            libelle: "Jours travaillés",
            value: Number(e.jours_travailles ?? 0),
            raw: e,
          },
        ]
      : [];

    return [...joursRows, ...primeRows, ...absenceRows, ...heureRows];
  }, [employePrimes, absences, heuresSupp, employe_id]);

  const columns = [
    { Header: "Libellé", accessor: "libelle" },
    { Header: "Montant / Nombre", accessor: "value" },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => {
        const { __type, raw } = row.original;
        return (
          <>
            {__type === "prime" && can("prime", "update") && (
              <Tooltip
                title="modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26,115,232,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button variant="text" color="primary" size="large" onClick={() => editPrime(raw)}>
                  <Icon>edit</Icon>
                </Button>
              </Tooltip>
            )}
            {__type === "absence" && can("absence", "update") && (
              <Tooltip
                title="modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26,115,232,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button
                  variant="text"
                  color="primary"
                  size="large"
                  onClick={() => editAbsence(raw)}
                >
                  <Icon>edit</Icon>
                </Button>
              </Tooltip>
            )}
            {__type === "heure" && can("heure_supplementaire", "update") && (
              <Tooltip
                title="modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26,115,232,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button variant="text" color="primary" size="large" onClick={() => editHeure(raw)}>
                  <Icon>edit</Icon>
                </Button>
              </Tooltip>
            )}

            {__type === "jours" && can("heure_supplementaire", "update") && (
              <Tooltip
                title="modifier"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(26,115,232,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button variant="text" color="primary" size="large" onClick={() => editJours(raw)}>
                  <Icon>edit</Icon>
                </Button>
              </Tooltip>
            )}

            {__type === "prime" && can("prime", "delete") && (
              <Tooltip
                title="supprimer"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(244,67,53,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button
                  variant="text"
                  size="large"
                  onClick={() => askDelete("prime", raw.id)}
                  sx={{ ml: 1 }}
                >
                  <Icon sx={{ color: "error.main" }}>delete</Icon>
                </Button>
              </Tooltip>
            )}
            {__type === "absence" && can("absence", "delete") && (
              <Tooltip
                title="supprimer"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(244,67,53,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button
                  variant="text"
                  size="large"
                  onClick={() => askDelete("absence", raw.id)}
                  sx={{ ml: 1 }}
                >
                  <Icon sx={{ color: "error.main" }}>delete</Icon>
                </Button>
              </Tooltip>
            )}
            {__type === "heure" && can("heure_supplementaire", "delete") && (
              <Tooltip
                title="supprimer"
                componentsProps={{
                  tooltip: {
                    sx: {
                      backgroundColor: "rgba(244,67,53,0.8)",
                      color: "#fff",
                      fontSize: "0.8rem",
                    },
                  },
                }}
              >
                <Button
                  variant="text"
                  size="large"
                  onClick={() => askDelete("heure", raw.id)}
                  sx={{ ml: 1 }}
                >
                  <Icon sx={{ color: "error.main" }}>delete</Icon>
                </Button>
              </Tooltip>
            )}
          </>
        );
      },
    },
  ];

  if (loading) {
    return (
      <MDBox pt={6} pb={3} textAlign="center">
        <CircularProgress />
      </MDBox>
    );
  }

  if (loadError) {
    return (
      <MDBox pt={6} pb={3} textAlign="center">
        <Typography variant="h6" color="error">
          Aucune donnée trouvée ou une erreur est survenue.
        </Typography>
      </MDBox>
    );
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <MDBox>
          <MDBox mx={2} mb={3} display="flex" justifyContent="flex-end" alignItems="center">
            <div>
              <Tooltip title="Ajouter">
                <Button
                  variant="contained"
                  color="success"
                  onClick={openAddMenu}
                  endIcon={<Icon>arrow_drop_down</Icon>}
                >
                  <Icon sx={{ color: "info.main" }}>add</Icon>
                </Button>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={addMenuOpen} onClose={closeAddMenu}>
                {can("prime", "create") && (
                  <MenuItem onClick={() => handleOpenDialog("prime")}>Prime</MenuItem>
                )}
                {can("absence", "create") && (
                  <MenuItem onClick={() => handleOpenDialog("absence")}>Absence</MenuItem>
                )}
                {can("heure_supplementaire", "create") && (
                  <MenuItem onClick={() => handleOpenDialog("heure")}>Heure supp</MenuItem>
                )}
              </Menu>
            </div>
          </MDBox>
          <DataTable
            table={{ columns, rows }}
            isSorted={false}
            entriesPerPage={false}
            showTotalEntries={false}
            noEndBorder
          />
        </MDBox>
      </Grid>

      {/* Prime Dialog */}
      <Dialog open={activeDialog === "prime"} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{primeForm.id ? "Modifier" : "Ajouter"} Prime</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            {!employe_id && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="employe_id"
                  value={primeForm.employe_id}
                  onChange={(e) => setPrimeForm((f) => ({ ...f, employe_id: e.target.value }))}
                  error={Boolean(primeErrors.employe_id)}
                  helperText={primeErrors.employe_id?.[0] || ""}
                  SelectProps={{ native: true }}
                >
                  <option value="">-- Choisir un employé --</option>
                  {employes.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom} {emp.prenom}
                    </option>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Autocomplete
                options={primes}
                getOptionLabel={(option) => option.motif ?? ""}
                value={primes.find((p) => p.id === primeForm.prime_id) || null}
                onChange={(e, newValue) =>
                  setPrimeForm((f) => ({ ...f, prime_id: newValue ? newValue.id : "" }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prime"
                    error={Boolean(primeErrors.prime_id)}
                    helperText={primeErrors.prime_id?.[0] || ""}
                  />
                )}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="montant"
                label="Montant"
                value={primeForm.montant}
                onChange={(e) => setPrimeForm((f) => ({ ...f, montant: e.target.value }))}
                error={Boolean(primeErrors.montant)}
                helperText={primeErrors.montant?.[0] || ""}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={submitPrime} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {primeForm.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Absence Dialog (date only in form, not in table) */}
      <Dialog open={activeDialog === "absence"} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{absenceForm.id ? "Modifier" : "Ajouter"} Absence</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={absenceForm.date}
                onChange={(e) => setAbsenceForm((f) => ({ ...f, date: e.target.value }))}
                error={Boolean(absenceErrors.date)}
                helperText={absenceErrors.date?.[0] || ""}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button
            onClick={submitAbsence}
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            {absenceForm.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Heure Supp Dialog (date only in form, not in table) */}
      <Dialog open={activeDialog === "heure"} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{heureForm.id ? "Modifier" : "Ajouter"} Heure supp</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                name="date"
                label="Date"
                value={heureForm.date}
                onChange={(e) => setHeureForm((f) => ({ ...f, date: e.target.value }))}
                error={Boolean(heureErrors.date)}
                helperText={heureErrors.date?.[0] || ""}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="jour"
                label="Jour"
                value={heureForm.jour}
                onChange={(e) => setHeureForm((f) => ({ ...f, jour: e.target.value }))}
                error={Boolean(heureErrors.jour)}
                helperText={heureErrors.jour?.[0] || ""}
                sx={{ ".MuiInputBase-root": { height: "45px" } }}
              >
                <MenuItem value="OUVRABLE">OUVRABLE</MenuItem>
                <MenuItem value="FERIES">FERIES</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                name="periode"
                label="Période"
                value={heureForm.periode}
                onChange={(e) => setHeureForm((f) => ({ ...f, periode: e.target.value }))}
                error={Boolean(heureErrors.periode)}
                helperText={heureErrors.periode?.[0] || ""}
                sx={{ ".MuiInputBase-root": { height: "45px" } }}
              >
                <MenuItem value="JOUR">JOUR</MenuItem>
                <MenuItem value="NUIT">NUIT</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                name="nombre"
                label="Nombre"
                value={heureForm.nombre}
                onChange={(e) => setHeureForm((f) => ({ ...f, nombre: e.target.value }))}
                error={Boolean(heureErrors.nombre)}
                helperText={heureErrors.nombre?.[0] || ""}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={submitHeure} variant="contained" color="primary" sx={{ color: "#fff" }}>
            {heureForm.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={activeDialog === "jours"} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Modifier jours travaillés</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                name="nombre"
                label="Nombre"
                value={joursForm.jours_travailles}
                onChange={(e) => setJoursForm((f) => ({ ...f, jours_travailles: e.target.value }))}
                error={Boolean(joursErrors.jours_travailles)}
                helperText={joursErrors.jours_travailles?.[0] || ""}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={submitJours} variant="contained" color="primary" sx={{ color: "#fff" }}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Êtes-vous sûr de vouloir supprimer cet élément ?</Typography>
          <Typography sx={{ color: "error.main", fontSize: "medium" }} variant="caption">
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="text" sx={{ color: "error.main" }}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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
    </Grid>
  );
}
