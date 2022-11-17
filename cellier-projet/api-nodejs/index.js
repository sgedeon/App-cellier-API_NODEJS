const express = require("express");
const path = require("path");
const {
  getAllBouteilles,
} = require("./utils/queryHelpers");
const app = express();
const cors = require("cors");

const genericError = "Marche pö";

app.use(express.json());

//app.use(express.static(path.join(__dirname + "/public")));

const whitelist = ["http://localhost:3000"]; //Change to the port in which react app is running
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// app.get("/", async function (request, response) {
//   try {
//     const [result] = await getAllBouteilles();
//     response.send({ success: true, result });
//   } catch (error) {
//     response.status(500).send({
//       success: false,
//       error: genericError,
//     });
//   }
// });

app.get("/api/get/cellier/:id/vins", async function (request, response) {
  try {
    var id = request.params.id;
    const [result] = await getAllBouteilles(id);
    response.send({ success: true, result });
  } catch (error) {
    response.status(500).send({
      success: false,
      error: genericError,
    });
  }
});

app.listen(3001, ()=>{
  console.log(`Server is running on ${3001}`)
})
