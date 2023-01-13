// Début des modifications

import React from "react";
import Axios from 'axios'
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./Appli.scss";
import NavMobile from "./NavMobile";
import NavDesktop from "./NavDesktop";
import PiedDePage from "./PiedDePage.jsx";
import ListeBouteilles from "./ListeBouteilles";
import FrmAjoutCellier from "./FrmAjoutCellier";
import FrmModifierCellier from "./FrmModifierCellier";
import Admin from "./Admin";
import ListeCelliers from "./ListeCelliers";
import Utilisateur, { user } from "./Utilisateur.jsx";
import Profil from "./Profil.jsx";
import Favoris from "./Favoris";
import Aide from "./Aide";
import { Auth } from "aws-amplify";
import { email } from "./utilisateur.js";
import Logo from "./img/png/logo-jaune.png";
import FrmAjoutBouteille from "./FrmAjoutBouteille";
import { dict, formFields } from "./aws-form-traduction.js";
import ListeBouteillesInventaire from "./ListeBouteillesInventaire";

let DATA;

/**
 * Gestion de l'application
 *
 * contenant la gestion des états, la configuration de la varible de l'environnement , des paramètres de routage du système.
 * Prétraitement, acquisition et chargement de toutes les données à render, déploiement logique algorithmique.
 * Disposition des composants
 *
 * @date 2022-09-30
 * @returns {*}
 */
const Appli = () => {
  const [error, setError] = useState([]);
  const [bouteilles, setBouteilles] = useState([]);
  const [bouteillesInventaire, setBouteillesInventaire] = useState([]);
  const [emailUtilisateur, setEmailUtilisateur] = useState([]);
  const [id, setId] = useState([]);
  const [cellier, setCellier] = useState([]);
  const [nomCellier, setNomCellier] = useState([]);
  const [username, setUsername] = useState([]);
  const [utilisateur, setUtilisateur] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [celliers, setCelliers] = useState([]);
  const [indexNav, setIndexNav] = useState(0);
  const [resetBottomNav, setResetBottomNav] = useState(false);
  const ENV = "dev";
  const [URI, setURI] = useState([]);
  const [favorisId, setFavorisId] = useState([]);

  let location = window.location.pathname;
  useEffect(() => {
    if (ENV == "prod") {
      setURI("https://monvino.app/api-php/index.php");
    } else {
      setURI("http://localhost:8888/PW2/cellier-projet/api-php");
      // setURI("http://localhost:3001/api/get");
    }
  }, []);

  useEffect(()=>{
    Axios.get("http://localhost:3001/api/get/bouteilles").then(response => {
        const { data } = response
        console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  },[])

  // ------------------------------- fonctions de gestion des états ----------------------------

  email().then((email) => {
    const emailUtilisateur = email;
    setEmailUtilisateur(emailUtilisateur);
    if (DATA !== undefined) {
      return;
    }
    createUser(emailUtilisateur);
    DATA = true;
  });

  useEffect(() => {
    fetchCelliers();
    setCellier(JSON.parse(localStorage.getItem("cellier")));
    if (localStorage.getItem("celliers") !== null) {
      setCelliers(JSON.parse(localStorage.getItem("celliers")));
    }
    fetchVinsInventaire();
    fetchFavorisId(id);
  }, [id]);

  useEffect(() => {
    fetchVins(cellier);
  }, [cellier]);

  function gererBouteilles(idBouteilles) {
    setBouteilles(idBouteilles);
  }
  function gererCellier(idCellier) {
    setCellier(idCellier);
  }

  // -------------------------- Requêtes Fetch ------------------------------------------------------

  // ----------------------- Gestion des utilisateurs ------------------------------------------------

  async function createUser(emailUtilisateur) {
    let bool = false;
    let DefautUsername = emailUtilisateur.substring(
      0,
      emailUtilisateur.indexOf("@")
    );
    utilisateurs.forEach((utilisateur) => {
      if (utilisateur["email"] === emailUtilisateur && bool === false) {
        bool = true;
      }
    });
    if (!bool) {
      Axios.post(
        "http://localhost:3001/api/ajout/utilisateur",
        { email: emailUtilisateur, nom: DefautUsername },
      )
      .then((res) => res.data)
      .then((res) => {
        console.log(res);
      })
    }
  }

  async function fetchUtilisateurs() {
    Axios.get("http://localhost:3001/api/get/utilisateurs/" + emailUtilisateur + "/").then(response => {
      const { data } = response
      setUtilisateurs(data.result[0]);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  async function fetchUtilisateur() {
    Axios.get("http://localhost:3001/api/get/utilisateur/" + emailUtilisateur + "/").then(response => {
      const { data } = response
      setUtilisateur(data.result[0][0]);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  async function supprimerUtilisateur() {
    await Auth.deleteUser()
      .then(() => {
        setId("");
        setUtilisateur("");
        setBouteilles("");
        setBouteillesInventaire("");
        setCelliers("");
        setEmailUtilisateur("");
        setUsername("");
        DATA = undefined;
      })
      .catch((err) =>
        console.log("Erreur lors de la suppression de viotre profil", err)
      );
    Axios.delete("http://localhost:3001/api/delete/utilisateur/" + emailUtilisateur + "")
    .then((res) => res.data)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de viotre profil", error);
      setError(error);
    });
  }

  async function gererSignOut() {
    await Auth.signOut()
      .then(() => {
        setResetBottomNav(false);
        setId("");
        setUtilisateur("");
        setBouteilles("");
        setBouteillesInventaire("");
        setCelliers("");
        setEmailUtilisateur("");
        setUsername("");
        setIndexNav(0);
        DATA = undefined;
      })
      .catch((err) => console.log("Erreur lors de la déconnexion", err));
  }

  // ---------------------------------- Gestion des celliers -----------------------------

  async function fetchCelliers() {
    Axios.get("http://localhost:3001/api/get/utilisateur/" + id + "/" + "celliers").then(response => {
      const { data } = response
      if (data.success === true) {
        localStorage.setItem("celliers", JSON.stringify(data.result[0]));
        setCelliers(JSON.parse(localStorage.getItem("celliers")));
        setCelliers(data.result[0]);
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  async function fetchNomCellier() {
    Axios.get("http://localhost:3001/api/get/utilisateur/" + id + "/" + "cellier/" + cellier).then(response => {
      const { data } = response
      if (data.success === true) {
        localStorage.setItem("nomCellier", JSON.stringify(data.result[0][0].nom));
        setNomCellier(JSON.parse(localStorage.getItem("nomCellier")));
      }
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  // --------------------------------- Gestion des bouteilles ------------------------------------

  async function fetchVins(cellier) {
    Axios.get("http://localhost:3001/api/get/cellier/" + cellier + "/vins").then(response => {
      const { data } = response
      setBouteilles(data.result[0]);
      console.log(bouteilles)
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  // --------------------------------- Gestion des différentes bouteilles comprises dans tous mes celliers ------------------------------------

  async function fetchVinsInventaire() {
    Axios.get("http://localhost:3001/api/get/utilisateur/" + id + "/vinsInventaire").then(response => {
      const { data } = response
      setBouteillesInventaire(data.result[0]);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  async function fetchAjouterFavoris(vin) {
    Axios.post(
      "http://localhost:3001/api/ajout/favoris",
      { body: vin },
    )
    .then((res) => res.data)
    .then((res) => {
      console.log(res);
      fetchFavorisId(id);
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du favoris : ", error);
      setError(error);
    });
  }

  async function fetchSupprimerFavoris(vin) {
    Axios.delete("http://localhost:3001/api/delete/utilisateur/" + id + "/favoris/vin/" + vin )
    .then((res) => res.data)
    .then((res) => {
      fetchFavorisId(id);
      console.log(res);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  async function fetchFavorisId(utilisateur) {
    Axios.get("http://localhost:3001/api/get/utilisateur/" + utilisateur  + "/favoris").then(response => {
      const { data } = response
      setFavorisId(data.result[0]);
      console.log(data.result[0]);
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      setError(error);
    });
  }

  // ---------------------------------- Rendering -----------------------------------------
  return (
    <div className={Auth.user ? "Appli" : "Login"}>
      {Auth.user && (
        <NavDesktop
          user={Auth.user}
          gererSignOut={gererSignOut}
          utilisateur={utilisateur}
          username={username}
        />
      )}
      <div>
        <img
          className={Auth.user ? "Hidden" : "logo"}
          src={Logo}
          alt="logo-mon-vino"
        ></img>
        <Authenticator className="Authenticator" formFields={formFields}>
          {({ signOut, user }) => (
            <div>
              <Utilisateur
                utilisateur={utilisateur}
                setUtilisateur={setUtilisateur}
                utilisateurs={utilisateurs}
                setUtilisateurs={setUtilisateurs}
                username={username}
                setUsername={setUsername}
                id={id}
                setId={setId}
                emailUtilisateur={emailUtilisateur}
                setEmailUtilisateur={setEmailUtilisateur}
                fetchUtilisateurs={fetchUtilisateurs}
                fetchUtilisateur={fetchUtilisateur}
                createUser={createUser}
              />

              {/* ------------------------------ Routes --------------------------------*/}
              <Routes>
                <Route
                  path={`/profil/:emailUtilisateur`}
                  element={
                    <Profil
                      supprimerUtilisateur={supprimerUtilisateur}
                      emailUtilisateur={emailUtilisateur}
                      setEmailUtilisateur={setEmailUtilisateur}
                      utilisateur={utilisateur}
                      setUsername={setUsername}
                      username={username}
                      setError={setError}
                      fetchUtilisateur={fetchUtilisateur}
                      setUtilisateur={setUtilisateur}
                      gererSignOut={gererSignOut}
                      URI={URI}
                    />
                  }
                />
                <Route
                  path={`/admin/:emailUtilisateur`}
                  element={
                    <Admin
                      emailUtilisateur={emailUtilisateur}
                      setEmailUtilisateur={setEmailUtilisateur}
                      utilisateur={utilisateur}
                      setUtilisateur={setUtilisateur}
                      URI={URI}
                      bouteilles={bouteilles}
                      setBouteilles={setBouteilles}
                      error={error}
                      setError={setError}
                      gererSignOut={gererSignOut}
                      fetchVins={fetchVins}
                    />
                  }
                />
                <Route
                  path={`/cellier/:idCellier/vins`}
                  element={
                    <ListeBouteilles
                      nomCellier={nomCellier}
                      setNomCellier={setNomCellier}
                      fetchNomCellier={fetchNomCellier}
                      bouteilles={bouteilles}
                      setBouteilles={setBouteilles}
                      fetchVins={fetchVins}
                      gererBouteilles={gererBouteilles}
                      cellier={cellier}
                      celliers={celliers}
                      URI={URI}
                      error={error}
                      setError={setError}
                      fetchUtilisateur={fetchUtilisateur}
                      fetchAjouterFavoris={fetchAjouterFavoris}
                      fetchSupprimerFavoris={fetchSupprimerFavoris}
                      favorisId={favorisId}
                      setFavorisId={setFavorisId}
                    />
                  }
                />
                <Route
                  path={`/vins`}
                  element={
                    <FrmAjoutBouteille
                      bouteilles={bouteilles}
                      setBouteilles={setBouteilles}
                      fetchVins={fetchVins}
                      fetchCelliers={fetchCelliers}
                      gererBouteilles={gererBouteilles}
                      celliers={celliers}
                      cellier={cellier}
                      setCellier={setCellier}
                      URI={URI}
                      error={error}
                      setError={setError}
                    />
                  }
                />
                <Route
                  path={`/vinsInventaire`}
                  element={
                    <ListeBouteillesInventaire
                      bouteillesInventaire={bouteillesInventaire}
                      setBouteillesInventaire={setBouteillesInventaire}
                      fetchVinsInventaire={fetchVinsInventaire}
                      user_id={id}
                      URI={URI}
                      error={error}
                      setError={setError}
                      cellier={cellier}
                      fetchVins={fetchVins}
                      fetchNomCellier={fetchNomCellier}
                      gererCellier={gererCellier}
                    />
                  }
                />
                <Route
                  path={`/`}
                  element={
                    <ListeCelliers
                      bouteilles={bouteilles}
                      setBouteilles={setBouteilles}
                      celliers={celliers}
                      setCelliers={setCelliers}
                      cellier={cellier}
                      setCellier={setCellier}
                      fetchCelliers={fetchCelliers}
                      fetchVins={fetchVins}
                      id={id}
                      emailUtilisateur={emailUtilisateur}
                      utilisateur={utilisateur}
                      gererCellier={gererCellier}
                      URI={URI}
                      error={error}
                      setError={setError}
                    />
                  }
                />
                <Route
                  path={`/PW2/cellier-projet`}
                  element={
                    <ListeCelliers
                      celliers={celliers}
                      setCelliers={setCelliers}
                      cellier={cellier}
                      setCellier={setCellier}
                      fetchCelliers={fetchCelliers}
                      fetchVins={fetchVins}
                      id={id}
                      emailUtilisateur={emailUtilisateur}
                      utilisateur={utilisateur}
                      gererCellier={gererCellier}
                      URI={URI}
                      error={error}
                      setError={setError}
                    />
                  }
                />
                <Route
                  path={`/cellier/ajout/celliers`}
                  element={
                    <FrmAjoutCellier
                      celliers={celliers}
                      fetchCelliers={fetchCelliers}
                      URI={URI}
                      setError={setError}
                    />
                  }
                />
                <Route
                  path={`/modifier-cellier`}
                  element={
                    <FrmModifierCellier
                      fetchCelliers={fetchCelliers}
                      URI={URI}
                      error={error}
                      setError={setError}
                    />
                  }
                />
                <Route
                  path={`/favoris`}
                  element={
                    <Favoris
                      URI={URI}
                      error={error}
                      setError={setError}
                      id={id}
                      nomCellier={nomCellier}
                      setNomCellier={setNomCellier}
                      fetchNomCellier={fetchNomCellier}
                      bouteilles={bouteilles}
                      setBouteilles={setBouteilles}
                      fetchVins={fetchVins}
                      gererBouteilles={gererBouteilles}
                      cellier={cellier}
                      celliers={celliers}
                      fetchUtilisateur={fetchUtilisateur}
                      fetchAjouterFavoris={fetchAjouterFavoris}
                      fetchSupprimerFavoris={fetchSupprimerFavoris}
                      favorisId={favorisId}
                      setFavorisId={setFavorisId}
                    />
                  }
                />
                <Route
                  path={`/aide`}
                  element={<Aide URI={URI} error={error} setError={setError} />}
                />
              </Routes>
            </div>
          )}
        </Authenticator>
        <p className={Auth.user ? "Hidden" : "Auth-sub-title"}>
          Commencez dès maintenant votre collection de vin !
        </p>
        <NavMobile
          Auth={Auth}
          emailUtilisateur={emailUtilisateur}
          utilisateur={utilisateur}
          setIndexNav={setIndexNav}
          indexNav={indexNav}
          setResetBottomNav={setResetBottomNav}
          resetBottomNav={resetBottomNav}
        />
      </div>
      <PiedDePage />
    </div>
  );
};

export default Appli;
