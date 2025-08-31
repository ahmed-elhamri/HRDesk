/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
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

// Axios helper (reuses same base and auth; optional but reduces overhead)
const api = axios.create({ baseURL: "http://localhost:8000/api" });

export default function Rubriques({ employe_id, mois }) {
  const { permissions } = useAuth();

  // Datasets
  const [employePrimes, setEmployePrimes] = useState([]);
  const [employe, setEmploye] = useState(null);
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

  // Which dialog is open: "prime" | "absence" | "heure" | "jours" | null
  const [activeDialog, setActiveDialog] = useState(null);

  // Forms
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

  // Delete confirmation
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null });

  // AbortController for in-flight requests (cancel stale)
  const inflightRef = useRef(null);

  // Auth token (once)
  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  // Static endpoints
  const API = useMemo(
    () => ({
      employePrimes: "/employe-primes",
      primes: "/primes",
      absences: "/absences",
      heuresSupp: "/heures-supplementaires",
      employe: `/employes/${employe_id}`,
      joursTrav: `/jours-trav/${employe_id}`,
    }),
    [employe_id]
  );

  // Fetch primes once (static list)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(API.primes, { params: { _ts: 1 } }); // cache-bust if needed
        if (mounted) setPrimes(res.data || []);
      } catch {
        /* ignore; non-critical */
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API.primes]);

  // Fetch employe once per employe_id (jours_travailles lives here)
  useEffect(() => {
    if (!employe_id) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(API.employe);
        if (mounted) setEmploye(res.data || null);
      } catch (e) {
        if (mounted) setEmploye(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [API.employe, employe_id]);

  // Fetch datasets that depend on (employe_id, mois)
  const fetchMonthScoped = useCallback(async () => {
    if (!employe_id || !mois) return;
    setLoading(true);
    setLoadError(false);

    // cancel previous
    if (inflightRef.current) inflightRef.current.abort();
    inflightRef.current = new AbortController();

    try {
      const [epRes, absRes, hsRes] = await Promise.all([
        api.get(API.employePrimes, { params: { employe_id }, signal: inflightRef.current.signal }),
        api.get(`${API.absences}/${employe_id}`, {
          params: { mois },
          signal: inflightRef.current.signal,
        }),
        api.get(`${API.heuresSupp}/${employe_id}`, {
          params: { mois },
          signal: inflightRef.current.signal,
        }),
      ]);

      // Batch updates to reduce re-renders
      setEmployePrimes(epRes.data || []);
      setAbsences(absRes.data || []);
      setHeuresSupp(hsRes.data || []);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Load error:", error);
        setLoadError(true);
      }
    } finally {
      setLoading(false);
      inflightRef.current = null;
    }
  }, [API.absences, API.employePrimes, API.heuresSupp, employe_id, mois]);

  useEffect(() => {
    fetchMonthScoped();
    // cleanup cancels in-flight
    return () => {
      if (inflightRef.current) inflightRef.current.abort();
    };
  }, [fetchMonthScoped]);

  // Helpers
  const can = useCallback(
    (entity, action) => permissions.find((p) => p.entity === entity)?.[`can_${action}`] === 1,
    [permissions]
  );

  const resetForms = useCallback(() => {
    setPrimeForm({ id: null, employe_id: employe_id || "", prime_id: "", montant: "" });
    setPrimeErrors({});
    setAbsenceForm({ id: null, employe_id, date: "" });
    setAbsenceErrors({});
    setHeureForm({ id: null, employe_id, date: "", jour: "", periode: "", nombre: "" });
    setHeureErrors({});
    setJoursForm({ employe_id, jours_travailles: "" });
    setJoursErrors({});
  }, [employe_id]);

  const handleOpenDialog = useCallback(
    (type) => {
      closeAddMenu();
      resetForms();
      setActiveDialog(type);
    },
    [resetForms]
  );

  const handleCloseDialog = useCallback(() => setActiveDialog(null), []);

  // --------- MUTATIONS (optimistic, no full refetch) ----------
  const submitPrime = useCallback(async () => {
    try {
      const payload = {
        employe_id: primeForm.employe_id || employe_id,
        prime_id: primeForm.prime_id,
        montant: primeForm.montant,
        id: primeForm.id ?? undefined,
      };

      if (primeForm.id) {
        await api.put(`${API.employePrimes}/${primeForm.id}`, payload);
        setEmployePrimes((prev) =>
          prev.map((r) =>
            r.id === primeForm.id
              ? {
                  ...r,
                  ...payload,
                  prime: primes.find((p) => String(p.id) === String(payload.prime_id)) || r.prime,
                }
              : r
          )
        );
        setSnackbarMessage("Prime modifiée avec succès !");
      } else {
        // create branch
        const { data } = await api.post(API.employePrimes, payload);
        const created = data ?? {
          ...payload,
          id: Date.now(),
        };
        created.prime =
          created.prime || primes.find((p) => String(p.id) === String(created.prime_id)) || null;

        setEmployePrimes((prev) => [...prev, created]);
        setSnackbarMessage("Prime ajoutée avec succès !");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
  }, [API.employePrimes, employe_id, handleCloseDialog, primeForm]);

  const submitAbsence = useCallback(async () => {
    try {
      const payload = {
        employe_id: absenceForm.employe_id || employe_id,
        date: absenceForm.date,
        id: absenceForm.id ?? undefined,
      };

      if (absenceForm.id) {
        await api.put(`${API.absences}/${absenceForm.id}`, payload);
        setAbsences((prev) =>
          prev.map((r) => (r.id === absenceForm.id ? { ...r, ...payload } : r))
        );
        setSnackbarMessage("Absence modifiée avec succès !");
      } else {
        const { data } = await api.post(API.absences, payload);
        setAbsences((prev) => [...prev, data ?? { ...payload, id: Date.now() }]);
        setSnackbarMessage("Absence ajoutée avec succès !");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
  }, [API.absences, employe_id, handleCloseDialog, absenceForm]);

  const submitHeure = useCallback(async () => {
    try {
      const payload = {
        employe_id: heureForm.employe_id || employe_id,
        date: heureForm.date,
        jour: heureForm.jour,
        periode: heureForm.periode,
        nombre: heureForm.nombre,
        id: heureForm.id ?? undefined,
      };

      if (heureForm.id) {
        await api.put(`${API.heuresSupp}/${heureForm.id}`, payload);
        setHeuresSupp((prev) =>
          prev.map((r) => (r.id === heureForm.id ? { ...r, ...payload } : r))
        );
        setSnackbarMessage("Heure supplémentaire modifiée avec succès !");
      } else {
        const { data } = await api.post(API.heuresSupp, payload);
        setHeuresSupp((prev) => [...prev, data ?? { ...payload, id: Date.now() }]);
        setSnackbarMessage("Heure supplémentaire ajoutée avec succès !");
      }

      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
  }, [API.heuresSupp, employe_id, handleCloseDialog, heureForm]);

  const submitJours = useCallback(async () => {
    try {
      const payload = { jours_travailles: joursForm.jours_travailles };
      await api.post(`/jours-trav/${employe_id}`, payload);
      // Optimistic update employe
      setEmploye((prev) => (prev ? { ...prev, jours_travailles: payload.jours_travailles } : prev));
      setSnackbarMessage("Jours travaillés modifiée avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      if (err.response?.status === 422) {
        setHeureErrors(err.response.data.errors || {});
        setSnackbarMessage("Erreur lors de la modification !");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  }, [employe_id, handleCloseDialog, joursForm]);

  // EDIT handlers (populate forms)
  const editPrime = useCallback(
    (row) => {
      setPrimeForm({
        id: row.id,
        employe_id: row.employe_id ?? employe_id ?? "",
        prime_id: row.prime_id ?? row.prime?.id ?? "",
        montant: row.montant ?? "",
      });
      setActiveDialog("prime");
    },
    [employe_id]
  );

  const editAbsence = useCallback((row) => {
    setAbsenceForm({ id: row.id, employe_id: row.employe_id ?? "", date: row.date ?? "" });
    setActiveDialog("absence");
  }, []);

  const editHeure = useCallback((row) => {
    setHeureForm({
      id: row.id,
      employe_id: row.employe_id ?? "",
      date: row.date ?? "",
      jour: row.jour ?? "",
      periode: row.periode ?? "",
      nombre: row.nombre ?? "",
    });
    setActiveDialog("heure");
  }, []);

  const editJours = useCallback(
    (row) => {
      setJoursForm({
        employe_id: row.employe_id ?? employe_id ?? "",
        jours_travailles: row.jours_travailles ?? "",
      });
      setActiveDialog("jours");
    },
    [employe_id]
  );

  // DELETE
  const askDelete = useCallback((type, id) => {
    setDeleteTarget({ type, id });
    setConfirmDeleteOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const { type, id } = deleteTarget;
      if (type === "prime") {
        await api.delete(`${API.employePrimes}/${id}`);
        setEmployePrimes((prev) => prev.filter((r) => r.id !== id));
        setSnackbarMessage("Prime supprimée avec succès !");
      } else if (type === "absence") {
        await api.delete(`${API.absences}/${id}`);
        setAbsences((prev) => prev.filter((r) => r.id !== id));
        setSnackbarMessage("Absence supprimée avec succès !");
      } else if (type === "heure") {
        await api.delete(`${API.heuresSupp}/${id}`);
        setHeuresSupp((prev) => prev.filter((r) => r.id !== id));
        setSnackbarMessage("Heure supplémentaire supprimée avec succès !");
      }
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (e) {
      setSnackbarMessage("Erreur lors de la suppression !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteTarget({ type: null, id: null });
    }
  }, [API.absences, API.employePrimes, API.heuresSupp, deleteTarget]);

  const getPrimeMotif = React.useCallback(
    (row) => {
      if (row?.prime?.motif) return row.prime.motif;
      const p = primes.find((x) => String(x.id) === String(row.prime_id));
      return p?.motif ?? "Prime";
    },
    [primes]
  );
  // Unified rows
  const rows = useMemo(() => {
    const primeRows = (employePrimes || []).map((r) => ({
      __type: "prime",
      id: r.id,
      libelle: getPrimeMotif(r), // <-- was r.prime?.motif ?? "Prime"
      value: r.montant,
      raw: r,
    }));

    const absenceRows = (absences || []).map((r) => ({
      __type: "absence",
      id: r.id,
      libelle: "Absence",
      value: 1,
      raw: r,
    }));

    const heureRows = (heuresSupp || []).map((r) => ({
      __type: "heure",
      id: r.id,
      libelle: `Heure supp (${r.jour ?? ""}${r.periode ? ` - ${r.periode}` : ""})`,
      value: r.nombre,
      raw: r,
    }));

    const e = Array.isArray(employe) ? employe[0] : employe;
    const joursRows = e
      ? [
          {
            __type: "jours",
            id: e.id ?? "jours",
            libelle: "Jours travaillés",
            value: Number(e.jours_travailles ?? 0),
            raw: e,
          },
        ]
      : [];

    return [...joursRows, ...primeRows, ...absenceRows, ...heureRows];
  }, [employePrimes, absences, heuresSupp, employe]);

  const columns = useMemo(
    () => [
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
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    onClick={() => editPrime(raw)}
                  >
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
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    onClick={() => editHeure(raw)}
                  >
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
                  <Button
                    variant="text"
                    color="primary"
                    size="large"
                    onClick={() => editJours(raw)}
                  >
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
    ],
    [askDelete, can, editAbsence, editHeure, editJours, editPrime]
  );

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
                  {/* You can populate 'employes' here if you later add it */}
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

      {/* Absence Dialog */}
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

      {/* Heure Supp Dialog */}
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

      {/* Jours travaillés */}
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
