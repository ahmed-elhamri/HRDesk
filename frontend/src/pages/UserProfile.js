import React, { useState, useEffect } from "react";
import { Card, Grid, Typography, CircularProgress, TextField, Button, Icon } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  // const [user, setUser] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const loadUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const res = await axios.get("/api/user");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   loadUser();
  // }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await axios.put("/api/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      alert("Mot de passe changé avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erreur lors du changement de mot de passe.");
      }
    }
  };

  const displayField = (label, value) => (
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle2" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Grid>
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

  if (!user) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox pt={6} pb={3} textAlign="center">
          <Typography variant="h6" color="error">
            Utilisateur non connecté.
          </Typography>
        </MDBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {/* User Info */}
        <Card sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Mon Profil
          </Typography>
          <Grid container spacing={3}>
            {displayField("Email", user.email)}
            {displayField("Rôle", user.role)}
          </Grid>
        </Card>

        {/* Change Password */}
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Changer le mot de passe
          </Typography>
          <form onSubmit={handlePasswordChange}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Ancien mot de passe"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={!!errors.old_password}
                  helperText={errors.old_password?.[0]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nouveau mot de passe"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errors.new_password}
                  helperText={errors.new_password?.[0]}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.new_password_confirmation}
                  helperText={errors.new_password_confirmation?.[0]}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ color: "#fff" }}
                >
                  Changer le mot de passe
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}
