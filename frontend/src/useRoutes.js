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
import UserProfile from "./pages/UserProfile";
import Absences from "./pages/Absences";
import HeuresSupplementaires from "./pages/HeuresSupplementaires";
import BulletinSalaire from "./pages/BulletinSalaire";

export function useRoutes() {
  const { permissions } = useAuth();
  const role = localStorage.getItem("user_role");
  const [allRoutes, setAllRoutes] = useState([
    {
      type: "collapse",
      name: "Profil",
      key: "profil",
      icon: <Icon fontSize="small">person4</Icon>,
      route: "/profil",
      component: <UserProfile />,
    },
  ]);
  // const [allRoutes, setAllRoutes] = useState([{}]);

  useEffect(() => {
    if (!permissions) return;

    const newRoutes = [];
    if (permissions.find((p) => p.entity === "bulltein")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Bultein de paie",
        key: "bultein",
        icon: <Icon fontSize="small">account_balance_wallet</Icon>,
        route: "/bultein",
        component: <BulletinSalaire />,
      });
    }
    if (permissions.find((p) => p.entity === "prime")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Primes",
        key: "employe-primes",
        icon: <Icon fontSize="small">payment</Icon>,
        route: "/employe-primes",
        component: <EmployePrimes />,
      });
    }
    if (permissions.find((p) => p.entity === "heure_supplementaire")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Heures supplémentaires",
        key: "heure_supplementaire",
        icon: <Icon fontSize="small">more_time</Icon>,
        route: "/heure-supplementaire",
        component: <HeuresSupplementaires />,
      });
    }
    if (permissions.find((p) => p.entity === "absence")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Absences",
        key: "absence",
        icon: <Icon fontSize="small">person_off</Icon>,
        route: "/absence",
        component: <Absences />,
      });
    }
    if (permissions.find((p) => p.entity === "employe")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Employés",
        key: "employes",
        icon: <Icon fontSize="small">group</Icon>,
        route: "/employes",
        component: <Employes />,
      });
    }
    if (permissions.find((p) => p.entity === "fonction")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Fonctions",
        key: "fonctions",
        icon: <Icon fontSize="small">work</Icon>,
        route: "/fonctions",
        component: <Fonctions />,
      });
    }
    if (permissions.find((p) => p.entity === "service")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Services",
        key: "services",
        icon: <Icon fontSize="small">location_city</Icon>,
        route: "/services",
        component: <Services />,
      });
    }
    if (permissions.find((p) => p.entity === "departement")?.can_read) {
      newRoutes.unshift({
        type: "collapse",
        name: "Départements",
        key: "departements",
        icon: <Icon fontSize="small">apartment</Icon>,
        route: "/departements",
        component: <Departements />,
      });
    }
    if (role === "SUPERVISOR") {
      newRoutes.unshift({
        type: "collapse",
        name: "Tableau de bord",
        key: "dashboard",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/dashboard",
        component: <Dashboard />,
      });
    }
    // setAllRoutes((prev) => [...prev, ...newRoutes]);
    setAllRoutes((prev) => [...newRoutes, ...prev]);
  }, [permissions]);

  return allRoutes;
}
