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
  Autocomplete,
  Tooltip,
  Icon,
  MenuItem,
} from "@mui/material";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function Employes() {
  const [employes, setEmployes] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [form, setForm] = useState({
    email: "",
    fonction_id: "",
    matricule: "",
    nom: "",
    prenom: "",
    cin: "",
    sexe: "HOMME",
    nationalite: "",
    date_de_naissance: "",
    pays: "",
    ville: "",
    adresse_actuelle: "",
    telephone_mobile: "",
    telephone_fixe: "",
    email_personnel: "",
    situation_familiale: "CELIBATAIRE",
    date_embauche: "",
    salaire_base: "",
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedFonction, setSelectedFonction] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDepartement, setSelectedDepartement] = useState(null);

  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const fetchEmployes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employes");
      setEmployes(res.data);
    } catch (error) {
      console.error("Error fetching employes:", error);
    }
  };

  const fetchFonctions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fonctions");
      setFonctions(res.data);
    } catch (error) {
      console.error("Error fetching fonctions:", error);
    }
  };

  useEffect(() => {
    fetchEmployes();
    fetchFonctions();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setErrors({});
    setForm({
      email: "",
      fonction_id: "",
      matricule: "",
      nom: "",
      prenom: "",
      cin: "",
      sexe: "HOMME",
      nationalite: "",
      date_de_naissance: "",
      pays: "",
      ville: "",
      adresse_actuelle: "",
      telephone_mobile: "",
      telephone_fixe: "",
      email_personnel: "",
      situation_familiale: "CELIBATAIRE",
      date_embauche: "",
      salaire_base: "",
    });
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await axios.put(`http://localhost:8000/api/employes/${form.id}`, form);
      } else {
        await axios.post("http://localhost:8000/api/employes", form);
      }
      fetchEmployes();
      handleClose();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    }
  };

  const handleEdit = (emp) => {
    setForm({
      ...emp,
      email: emp.user?.email || "",
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/employes/${id}`);
      fetchEmployes();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  const columns = [
    { Header: "Matricule", accessor: "matricule" },
    { Header: "Nom", accessor: "nom" },
    { Header: "Prénom", accessor: "prenom" },
    {
      Header: "Fonction",
      accessor: "fonction.designation",
      Cell: ({ row }) => row.original.fonction?.designation || "",
    },
    {
      Header: "Service",
      accessor: "fonction.service.designation",
      Cell: ({ row }) => row.original.fonction?.service?.designation || "",
    },
    {
      Header: "Département",
      accessor: "fonction.service.departement.designation",
      Cell: ({ row }) => row.original.fonction?.service?.departement?.designation || "",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: ({ row }) => (
        <>
          {/*<Tooltip title="Modifier">*/}
          {/*  <Button onClick={() => handleEdit(row.original)} variant="text" size="small">*/}
          {/*    <Icon>edit</Icon>*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Supprimer">*/}
          {/*  <Button onClick={() => handleDelete(row.original.id)} variant="text" size="small">*/}
          {/*    <Icon sx={{ color: "error.main" }}>delete</Icon>*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
          {/*<Tooltip title="Détails">*/}
          {/*  <Button*/}
          {/*    onClick={() => navigate(`/employes/details/${row.original.matricule}`)}*/}
          {/*    variant="text"*/}
          {/*    size="small"*/}
          {/*    color="secondary"*/}
          {/*  >*/}
          {/*    <Icon>info</Icon>*/}
          {/*  </Button>*/}
          {/*</Tooltip>*/}
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
              onClick={() => handleEdit(row.original)}
              variant="text"
              color="primary"
              size="large"
            >
              <Icon>edit</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title="supprimer"
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
            <Button
              onClick={() => handleDelete(row.original.id)}
              variant="text"
              size="large"
              sx={{ ml: 1 }}
            >
              <Icon sx={{ color: "error.main" }}>delete</Icon>
            </Button>
          </Tooltip>
          <Tooltip
            title="détails"
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
            <Button
              onClick={() => navigate(`/employes/details/${row.original.matricule}`)}
              variant="text"
              color="secondary"
              size="large"
              sx={{ ml: 1 }}
            >
              <Icon>info</Icon>
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
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
                display="flex"
                justifyContent="space-between"
              >
                <MDTypography variant="h6" color="white">
                  Employés
                </MDTypography>
                <Tooltip title="Ajouter employé">
                  <Button variant="contained" color="success" onClick={handleOpen}>
                    <Icon sx={{ color: "info.main" }}>add</Icon>
                  </Button>
                </Tooltip>
              </MDBox>
              <MDBox pt={2}>
                <MDBox
                  px={2}
                  py={2}
                  display="flex"
                  justifyContent="flex-end"
                  gap={2}
                  flexWrap="wrap"
                >
                  <TextField
                    label="Recherche"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="small"
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={fonctions}
                    getOptionLabel={(option) => option.designation}
                    value={selectedFonction}
                    onChange={(e, val) => setSelectedFonction(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par fonction" size="small" />
                    )}
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={
                      selectedFonction
                        ? [selectedFonction.service]
                        : Array.from(new Set(fonctions.map((f) => JSON.stringify(f.service)))).map(
                            (s) => JSON.parse(s)
                          )
                    }
                    getOptionLabel={(option) => option?.designation || ""}
                    value={selectedService}
                    onChange={(e, val) => setSelectedService(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par service" size="small" />
                    )}
                    sx={{ width: 200 }}
                  />

                  <Autocomplete
                    options={
                      selectedService
                        ? [selectedService.departement]
                        : Array.from(
                            new Set(fonctions.map((f) => JSON.stringify(f.service?.departement)))
                          ).map((d) => JSON.parse(d))
                    }
                    getOptionLabel={(option) => option?.designation || ""}
                    value={selectedDepartement}
                    onChange={(e, val) => setSelectedDepartement(val)}
                    renderInput={(params) => (
                      <TextField {...params} label="Filtrer par département" size="small" />
                    )}
                    sx={{ width: 230 }}
                  />

                  <Button
                    variant="text"
                    onClick={() => {
                      setSearchText("");
                      setSelectedFonction(null);
                      setSelectedService(null);
                      setSelectedDepartement(null);
                    }}
                  >
                    <Icon>filter_alt_off</Icon>
                  </Button>
                </MDBox>

                <DataTable
                  table={useMemo(
                    () => ({
                      columns,
                      rows: employes.filter((emp) => {
                        const matchesSearch =
                          emp.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                          emp.prenom.toLowerCase().includes(searchText.toLowerCase()) ||
                          emp.matricule.toLowerCase().includes(searchText.toLowerCase());

                        const matchesFonction = selectedFonction
                          ? emp.fonction_id === selectedFonction.id
                          : true;
                        const matchesService = selectedService
                          ? emp.fonction?.service?.id === selectedService.id
                          : true;
                        const matchesDepartement = selectedDepartement
                          ? emp.fonction?.service?.departement?.id === selectedDepartement.id
                          : true;

                        return (
                          matchesSearch && matchesFonction && matchesService && matchesDepartement
                        );
                      }),
                    }),
                    [employes]
                  )}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{form.id ? "Modifier Employé" : "Ajouter Employé"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {[
              { name: "email", label: "Email (connexion)", required: true },
              { name: "matricule", label: "Matricule" },
              { name: "nom", label: "Nom" },
              { name: "prenom", label: "Prénom" },
              { name: "cin", label: "CIN" },
              { name: "nationalite", label: "Nationalité" },
              { name: "pays", label: "Pays" },
              { name: "ville", label: "Ville" },
              { name: "adresse_actuelle", label: "Adresse actuelle" },
              { name: "telephone_mobile", label: "Téléphone mobile" },
              { name: "telephone_fixe", label: "Téléphone fixe" },
              { name: "email_personnel", label: "Email personnel" },
              { name: "salaire_base", label: "Salaire de base", type: "number" },
            ].map((field) => (
              <Grid item xs={12} md={6} key={field.name}>
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  value={form[field.name]}
                  onChange={handleChange}
                  error={Boolean(errors[field.name])}
                  helperText={errors[field.name]?.[0]}
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
                value={form.date_de_naissance}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.date_de_naissance)}
                helperText={errors.date_de_naissance?.[0]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date d'embauche"
                name="date_embauche"
                type="date"
                value={form.date_embauche}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.date_embauche)}
                helperText={errors.date_embauche?.[0]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Sexe"
                name="sexe"
                fullWidth
                value={form.sexe}
                onChange={handleChange}
                error={Boolean(errors.sexe)}
                helperText={errors.sexe?.[0]}
                sx={{
                  ".MuiInputBase-root": {
                    height: "45px",
                  },
                }}
              >
                <MenuItem value="HOMME">HOMME</MenuItem>
                <MenuItem value="FEMME">FEMME</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Situation familiale"
                name="situation_familiale"
                fullWidth
                value={form.situation_familiale}
                onChange={handleChange}
                error={Boolean(errors.situation_familiale)}
                helperText={errors.situation_familiale?.[0]}
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
                value={fonctions.find((f) => f.id === form.fonction_id) || null}
                onChange={(e, val) => setForm({ ...form, fonction_id: val?.id || "" })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fonction"
                    error={Boolean(errors.fonction_id)}
                    helperText={errors.fonction_id?.[0]}
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
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {form.id ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}
