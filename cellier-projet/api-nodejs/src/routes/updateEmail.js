const {updateEmail} = require("../queryHelpers");
const genericError = "Marche pô";

module.exports = (app) => {
  app.patch("/api/update/email/:email", async function (request, response) {
    try {
      var email = request.params.email
      const result = await updateEmail(request.body, email);
      response.send({ success: true, result });
    } catch (error) {
      response.status(500).send({
        success: false,
        error: genericError,
      });
    }
  })
}