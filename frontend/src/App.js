import { useState, useEffect } from "react";

import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";

import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
// import routes from "./routes";
import supervisorRoutes from "./routes/supervisorRoutes";
import adminRoutes from "./routes/adminRoutes";
import employeRoutes from "./routes/employeRoutes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/HRDesk_logo_dark.png";
import brandDark from "assets/images/HRDesk_logo_light.png";
import SignIn from "./pages/authentication/SignIn";
import DepartementDetails from "./pages/departement/DepartementDetails";
import ServiceDetails from "./pages/service/ServiceDetails";
import FonctionDetails from "./pages/fonction/FonctionDetails";
import EmployeDetails from "./pages/employe/EmployeDetails";
import ChangePassword from "./pages/authentication/ChangePassword";
import UserProfile from "./pages/UserProfile";
import Primes from "./pages/Primes";
export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const token = localStorage.getItem("token");
  const user_id = localStorage.getItem("user_id");
  const role = localStorage.getItem("user_role");
  const password_changed = localStorage.getItem("password_changed");
  const [routes, setRoutes] = useState([]);
  useEffect(() => {
    if (role === "ADMIN") {
      setRoutes(adminRoutes);
    } else if (role === "SUPERVISOR") {
      setRoutes(supervisorRoutes);
    } else {
      setRoutes(employeRoutes);
    }
  }, [role]);

  const navigate = useNavigate();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // useEffect(() => {
  //   if (token) {
  //     navigate("/test");
  //   }
  // }, [user, navigate]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="HRDesk"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          {/*<Configurator />*/}
          {/*{configsButton}*/}
        </>
      )}
      {/*{layout === "vr" && <Configurator />}*/}
      <Routes>
        <Route path="/profil" element={<UserProfile />} />
        {token ? (
          <>
            {role === "SUPERVISOR" && (
              <>
                {getRoutes(routes)}
                <Route path="/departements/details/:reference" element={<DepartementDetails />} />
                <Route path="/services/details/:reference" element={<ServiceDetails />} />
                <Route path="/fonctions/details/:reference" element={<FonctionDetails />} />
                <Route path="/employes/details/:matricule" element={<EmployeDetails />} />
                <Route path="/primes" element={<Primes />} />
                <Route path="/profil" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            )}
            {role === "ADMIN" && (
              <>
                {password_changed === "1" ? (
                  getRoutes(routes)
                ) : (
                  <>
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/profil" element={<UserProfile />} />
                    <Route path="/primes" element={<Primes />} />
                    <Route path="*" element={<Navigate to="/change-password" />} />
                  </>
                )}
              </>
            )}
            {role === "EMPLOYE" && (
              <>
                {password_changed === "1" ? (
                  getRoutes(routes)
                ) : (
                  <>
                    <Route path="/change-password" element={<ChangePassword />} />
                    <Route path="/profil" element={<UserProfile />} />
                    <Route path="*" element={<Navigate to="/change-password" />} />
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/*" element={<SignIn />} />
            <Route path="/sign-in" element={<SignIn />} />
          </>
        )}
      </Routes>
    </ThemeProvider>
  );
}
