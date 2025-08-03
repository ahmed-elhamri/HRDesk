// useRoutes.js
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Icon from "@mui/material/Icon";
import Dashboard from "layouts/dashboard";
import Departements from "./pages/departement/Departements";
import Services from "./pages/service/Services";
import Fonctions from "./pages/fonction/Fonctions";
import Employes from "./pages/employe/Employes";
import EmployePrimes from "./pages/EmployePrimes";
import PersonalInformations from "./pages/employe/PersonalInformations";

export function useRoutes() {
  const { permissions } = useAuth();
  const [allRoutes, setAllRoutes] = useState([
    {
      type: "collapse",
      name: "Tableau de bord",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
    // {
    //   type: "collapse",
    //   name: "Mes Informations",
    //   key: "personal-informations",
    //   icon: <Icon fontSize="small">person4</Icon>,
    //   route: "/personal-informations",
    //   component: <PersonalInformations />,
    // },
  ]);
  // const [allRoutes, setAllRoutes] = useState([{}]);

  useEffect(() => {
    if (!permissions) return;

    const newRoutes = [];
    if (permissions.find((p) => p.entity === "departement")?.can_read) {
      newRoutes.push({
        type: "collapse",
        name: "Départements",
        key: "departements",
        icon: <Icon fontSize="small">apartment</Icon>,
        route: "/departements",
        component: <Departements />,
      });
    }
    if (permissions.find((p) => p.entity === "service")?.can_read) {
      newRoutes.push({
        type: "collapse",
        name: "Services",
        key: "services",
        icon: <Icon fontSize="small">location_city</Icon>,
        route: "/services",
        component: <Services />,
      });
    }
    if (permissions.find((p) => p.entity === "fonction")?.can_read) {
      newRoutes.push({
        type: "collapse",
        name: "Fonctions",
        key: "fonctions",
        icon: <Icon fontSize="small">work</Icon>,
        route: "/fonctions",
        component: <Fonctions />,
      });
    }
    if (permissions.find((p) => p.entity === "employe")?.can_read) {
      newRoutes.push({
        type: "collapse",
        name: "Employés",
        key: "employes",
        icon: <Icon fontSize="small">group</Icon>,
        route: "/employes",
        component: <Employes />,
      });
    }
    if (permissions.find((p) => p.entity === "prime")?.can_read) {
      newRoutes.push({
        type: "collapse",
        name: "Primes",
        key: "employe-primes",
        icon: <Icon fontSize="small">payment</Icon>,
        route: "/employe-primes",
        component: <EmployePrimes />,
      });
    }

    setAllRoutes((prev) => [...prev, ...newRoutes]);
  }, [permissions]);

  return allRoutes;
}
