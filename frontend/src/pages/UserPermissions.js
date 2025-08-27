/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Tooltip,
  Button,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import MDBox from "components/MDBox";
import DataTable from "examples/Tables/DataTable";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { setAuthToken } from "./http";
import { useParams } from "react-router-dom";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout"; // adjust path if needed

const API_BASE = "http://localhost:8000/api";

export default function UserPermissions() {
  const auth = useAuth();
  const { id } = useParams();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    entity: "",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  });
  const [errors, setErrors] = useState({});

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setAuthToken(localStorage.getItem("token") || null);
  }, []);

  const fetchPermissions = async () => {
    if (!id) return;
    setLoading(true);
    setLoadError(false);
    try {
      const res = await axios.get(`${API_BASE}/permissions`, {
        params: { id: id },
      });
      console.log(res.data);
      const rows = Array.isArray(res.data) ? res.data : Object.values(res.data || {});
      setPermissions(rows || []);
    } catch (err) {
      setLoadError(true);
      setSnackbarMessage("Erreur lors du chargement des permissions.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissionForEntity = async (entity) => {
    if (!id) return;
    try {
      const res = await axios.get(`${API_BASE}/permissions/${id}`, {
        params: { entity },
      });
      const p = (Array.isArray(res.data) ? res.data[0] : res.data) || {};
      setEditForm({
        entity,
        can_create: !!p.can_create,
        can_read: !!p.can_read,
        can_update: !!p.can_update,
        can_delete: !!p.can_delete,
      });
      setErrors({});
      setEditOpen(true);
    } catch (err) {
      setSnackbarMessage("Erreur lors du chargement de la permission.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      await axios.put(`${API_BASE}/permissions/${id}`, editForm);
      setSnackbarMessage("Permissions mises à jour avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditOpen(false);
      fetchPermissions();
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setSnackbarMessage("Erreur lors de la sauvegarde des permissions.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [id]);

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
          <span>
            <Button
              onClick={() => fetchPermissionForEntity(row.original.entity)}
              variant="text"
              color="primary"
              size="large"
              disabled={auth?.role !== "SUPERVISOR"} // only supervisors edit
            >
              <Icon>edit</Icon>
            </Button>
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 3 }}>
        {/*{loading ? (*/}
        {/*  <Typography>Chargement…</Typography>*/}
        {/*) : loadError || permissions.length === 0 ? (*/}
        {/*  <Typography>Aucun permissions trouvé.</Typography>*/}
        {/*) : (*/}
        {/*  <DataTable*/}
        {/*    table={{ columns, rows: permissions }}*/}
        {/*    isSorted={false}*/}
        {/*    entriesPerPage={false}*/}
        {/*    showTotalEntries={false}*/}
        {/*    noEndBorder*/}
        {/*  />*/}
        {/*)}*/}
        <DataTable
          table={{ columns, rows: permissions }}
          isSorted={false}
          entriesPerPage={false}
          showTotalEntries={false}
          noEndBorder
        />
      </Card>

      {/* Edit Permission Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Entité : <b>{editForm.entity}</b>
              </Typography>
            </Grid>

            {[
              { name: "can_create", label: "Peut créer" },
              { name: "can_read", label: "Peut lire" },
              { name: "can_update", label: "Peut modifier" },
              { name: "can_delete", label: "Peut supprimer" },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.name}>
                <label>
                  <input
                    type="checkbox"
                    name={f.name}
                    checked={!!editForm[f.name]}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, [f.name]: e.target.checked }))
                    }
                  />{" "}
                  {f.label}
                </label>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} variant="contained" sx={{ color: "#fff" }}>
            Enregistrer
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
    </DashboardLayout>
  );
}
