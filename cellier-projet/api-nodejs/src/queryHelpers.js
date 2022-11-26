const getConnection = require("./db");

/** Bouteilles */

/**
 * Gestion de la récupération d'une bouteille d'un cellier donné
 * @date 2022-11-11
 * @param {int} id
 * @returns {Array}
 */
async function getBouteille (cellier, bouteille) {
  const connection = await getConnection();
  return connection.execute(`SELECT nom, image, code_saq, pays, description, prix_saq, url_saq, url_img, format, vino__type_id, millesime,personnalise, vino__cellier_id, quantite, date_achat, garde_jusqua, notes 
  FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier 
  ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id 
  WHERE vino__cellier_id =`+ cellier +` AND vino__bouteille_has_vino__cellier.vino__bouteille_id =`+ bouteille +``);
};

/**
 * Gestion de la récupération de la liste de bouteilles d'un cellier donné
 * @date 2022-11-11
 * @param {int} id
 * @returns {Array}
 */
async function getAllBouteilles (id) {
  const connection = await getConnection();
  return connection.execute(`SELECT vino__cellier.vino__utilisateur_id, vino__bouteille.id, vino__bouteille.nom, image, code_saq, pays, description, prix_saq, url_saq, url_img, format, vino__type_id, vino__type.type, millesime,personnalise, vino__cellier_id, quantite, date_achat, garde_jusqua, notes FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id where vino__bouteille_has_vino__cellier.vino__cellier_id = `+ id +` ORDER BY vino__bouteille.id ASC`);
};

/**
 * Gestion de la récupération de la liste de bouteilles d'un utilisateur donné
 * @date 2022-11-11
 * @param {int} id
 * @returns {Array}
 */
async function getBouteillesInventaire(id) {
  const connection = await getConnection();
  return connection.execute(`SELECT vino__bouteille.id, vino__bouteille.nom, image, code_saq, pays, description, prix_saq, url_saq, url_img, format, vino__type_id, vino__type.type, millesime,personnalise,SumQuantiteParBouteille.quantite_total, SumQuantiteParBouteille.quantite_total*prix_saq as prix_total FROM vino__bouteille JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN (SELECT  vino__bouteille_has_vino__cellier.vino__bouteille_id as bouteille_id, sum(quantite) as quantite_total from vino__bouteille_has_vino__cellier 
  JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id 
  JOIN vino__utilisateur ON vino__utilisateur.id = vino__cellier.vino__utilisateur_id where vino__utilisateur.id=`+ id +` 
  GROUP BY bouteille_id) SumQuantiteParBouteille ON SumQuantiteParBouteille.bouteille_id = vino__bouteille.id 
  ORDER BY vino__bouteille.id`);
};

/**
 * Gestion de la récupération des inventaires d'une bouteille donné
 * @date 2022-11-11
 * @param {int} utilisateur
 * @param {int} bouteille
 * @returns {Array}
 */
 async function getInventairesBouteille(utilisateur, bouteille) {
  const connection = await getConnection();
  return connection.execute(`
  SELECT vino__bouteille.id , vino__bouteille.nom, image, code_saq, pays, description, prix_saq, url_saq, url_img, format, vino__type_id, vino__type.type, millesime,personnalise,SumQuantiteParBouteille.quantite_total, SumQuantiteParBouteille.quantite_total*prix_saq as prix_total, celliers.cellier_id as cellier_id, celliers.quantite as quantite, celliers.cellier_nom as cellier_nom 
  FROM vino__bouteille 
  JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id
  JOIN (SELECT  vino__bouteille_has_vino__cellier.vino__bouteille_id as bouteille_id, sum(quantite) as quantite_total from vino__bouteille_has_vino__cellier 
  JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id 
  JOIN vino__utilisateur ON vino__utilisateur.id = vino__cellier.vino__utilisateur_id where vino__utilisateur.id=`+ utilisateur +` GROUP BY bouteille_id) SumQuantiteParBouteille
  ON SumQuantiteParBouteille.bouteille_id = vino__bouteille.id
  JOIN (SELECT vino__bouteille_id,vino__cellier_id as cellier_id,vino__cellier.nom as cellier_nom, quantite 
  FROM vino__bouteille_has_vino__cellier JOIN vino__cellier 
  ON vino__cellier.id = vino__bouteille_has_vino__cellier.vino__cellier_id 
  JOIN vino__utilisateur ON vino__utilisateur.id = vino__cellier.vino__utilisateur_id 
  WHERE vino__utilisateur.id=`+ utilisateur +`  and vino__bouteille_id=`+ bouteille +`) celliers 
  ON celliers.vino__bouteille_id = vino__bouteille.id`);
};

/**
 * Gestion de la mise à jour d'une bouteille
 * @date 2022-11-11
 * @param {object} body
 * @returns {array}
 */
async function updateBouteille (body, cellier, bouteille) {
  const connection = await getConnection();
  return connection.execute(`UPDATE vino__bouteille_has_vino__cellier 
  SET quantite="`+ body.quantite +`", date_achat="`+ body.date_achat +`", garde_jusqua="`+ body.garde_jusqua +`" 
  WHERE vino__bouteille_id=`+ bouteille +` 
  AND vino__cellier_id=`+ cellier +``);
};

/**
 * Suppression d'une bouteille
 * @date 2022-11-25
 * @param {int} vin
 * @param {int} cellier
 * @returns {Array}
 */
async function deleteBouteille (vin, cellier) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__bouteille_has_vino__cellier 
  WHERE vino__bouteille_has_vino__cellier.vino__bouteille_id=`+ vin +`
  AND vino__bouteille_has_vino__cellier.vino__cellier_id=`+ cellier +``);
};

/** Celliers */

/**
 * Gestion de la récupération de la liste de celliers d'un utilisateur donné
 * @date 2022-11-11
 * @param {int} id
 * @returns {Array}
 */
async function getAllCelliers(id) {
  const connection = await getConnection();
  return connection.execute(`SELECT vino__cellier.id, vino__cellier.nom, vino__utilisateur_id FROM vino__cellier JOIN vino__utilisateur ON vino__utilisateur.id =vino__cellier.vino__utilisateur_id where vino__cellier.vino__utilisateur_id =`+ id +``);
};

/**
 * Gestion de la récupération d'un cellier donné
 * @date 2022-11-11
 * @param {int} cellier
 * @returns {Array}
 */
async function getCellier(cellier) {
  const connection = await getConnection();
  return connection.execute(`SELECT  vino__cellier.nom FROM vino__cellier WHERE vino__cellier.id = `+ cellier +``);
};

/**
 * Gestion de la suppression d'un cellier donné
 * @date 2022-11-11
 * @param {int} cellier
 * @returns {Array}
 */
async function deleteCellier(cellier) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__cellier WHERE vino__cellier.id=`+ cellier +``);
};


/**
 * Gestion de la récupération des statistiques d'un cellier donné
 * @date 2022-11-26
 * @param {int} cellier
 * @returns {Array}
 */
 async function getCellierStats(cellier) {
  const connection = await getConnection();
  return connection.execute(`SELECT count(*) as compte, sum(prix_saq * quantite) as somme FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier 
  ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id 
  JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id 
  JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id 
  where vino__bouteille_has_vino__cellier.vino__cellier_id =`+ cellier +` ORDER BY vino__bouteille.id ASC`);
};

/** Favoris */

/**
 * Ajout de la mention favoris à une bouteille donnée
 * @date 2022-11-11
 * @param {object} body
 * @returns {array}
 */
 async function addFavoris (body) {
  const connection = await getConnection();
  return connection.execute(`INSERT INTO vino__favoris (vino__bouteille_id, vino__utilisateur_id) VALUES ("`+ body.body.vino__bouteille_id +`", "`+ body.body.vino__utilisateur_id +`")`);
};

/**
 * Suppression de la dénomination favoris d'un vin
 * @date 2022-11-23
 * @param {int} vin
 * @param {int} utilisateur
 * @returns {Array}
 */
async function deleteFavoris (utilisateur, vin) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__favoris WHERE vino__bouteille_id=`+ vin +` AND vino__utilisateur_id=`+ utilisateur +``);
};

/**
 * Gestion de la récupération des ID des vins favoris
 * @date 2022-11-24
 * @param {int} utilisateur
 * @returns {Array}
 */
async function getFavorisId(utilisateur) {
  const connection = await getConnection();
  return connection.execute(`SELECT vino__favoris.vino__bouteille_id FROM vino__favoris JOIN vino__utilisateur ON vino__favoris.vino__utilisateur_id= vino__utilisateur.id WHERE vino__favoris.vino__utilisateur_id =`+ utilisateur +` GROUP BY vino__favoris.vino__bouteille_id`);
};

/** Utilisateurs */

/**
 * Gestion de la création d'un utilisateur et d'un cellier lié
 * @date 2022-11-11
 * @param {object} body
 * @returns {array}
 */
async function createUser (body) {
  const connection = await getConnection();
  const addUser = await connection.execute(`INSERT INTO vino__utilisateur (vino__utilisateur.email, vino__utilisateur.nom) VALUES ("`+ body.email +`" ,"`+ body.nom +`")`);
  return connection.execute(`INSERT INTO vino__cellier (vino__cellier.nom, vino__utilisateur_id) VALUES ("Coucou", `+ addUser[0].insertId +`)`);
};

/**
 * Suppression d'un utilisateur 
 * @date 2022-11-21
 * @param {string} email
 * @returns {Array}
 */
async function deleteUser (email) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__utilisateur WHERE vino__utilisateur.email="`+ email +`"`);
};

/**
 * Récupération d'un utilisateur donné
 * @date 2022-11-11
 * @param {string} emailUtilisateur
 * @returns {array}
 */
async function findUtilisateur (emailUtilisateur) {
  const connection = await getConnection();
  return connection.execute(`SELECT DISTINCT vino__utilisateur.id, vino__utilisateur.email, vino__utilisateur.privilege, vino__utilisateur.nom FROM vino__utilisateur JOIN vino__cellier ON vino__utilisateur.id=vino__cellier.vino__utilisateur_id WHERE vino__utilisateur.email="`+ emailUtilisateur +`"`);
};

/**
 * Récupération de l'ensemble des utilisateurs
 * @date 2022-11-11
 * @param {string} emailUtilisateur
 * @returns {array}
 */
async function findUtilisateurs (emailUtilisateur) {
  const connection = await getConnection();
  return connection.execute("SELECT vino__utilisateur.id, vino__utilisateur.email, vino__utilisateur.nom FROM vino__utilisateur");
};

module.exports = {
  getBouteille,
  getAllBouteilles,
  getInventairesBouteille,
  getBouteillesInventaire,
  updateBouteille,
  deleteBouteille,
  addFavoris,
  deleteFavoris,
  getFavorisId,
  getAllCelliers,
  getCellier,
  deleteCellier,
  getCellierStats,
  createUser,
  deleteUser,
  findUtilisateur,
  findUtilisateurs,
};
