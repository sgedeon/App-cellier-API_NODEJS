const {deleteUser} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.delete('/api/delete/utilisateur/:email', async function (request, response) {
    try {
      email = request.params.email
      const result = await deleteUser(email);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}