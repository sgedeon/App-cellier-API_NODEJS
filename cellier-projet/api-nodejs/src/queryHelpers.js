const getConnection = require("./db");

/** Bouteilles */

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
 * Ajout de la mention favoris à une bouteille donnée
 * @date 2022-11-11
 * @param {object} body
 * @returns {array}
 */
 async function addFavoris (body) {
  const connection = await getConnection();
  return connection.execute(`INSERT INTO vino__favoris (vino__bouteille_id, vino__utilisateur_id) VALUES ("`+ body.body.vino__bouteille_id +`", "`+ body.body.vino__utilisateur_id +`")`);
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

/** Favoris */

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
 * Récupérations d'un vin favoris
 * @date 2022-11-23
 * @param {int} vin
 * @returns {Array}
 */
 async function deleteFavoris (utilisateur, vin) {
  const connection = await getConnection();
  return connection.execute(`DELETE FROM vino__favoris WHERE vino__bouteille_id=`+ vin +` AND vino__utilisateur_id=`+ utilisateur +``);
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
  getAllBouteilles,
  getBouteillesInventaire,
  addFavoris,
  deleteFavoris,
  getAllCelliers,
  getCellier,
  createUser,
  deleteUser,
  findUtilisateur,
  findUtilisateurs,
};
