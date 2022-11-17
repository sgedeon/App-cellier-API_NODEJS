const getAllBouteilles = async (id) => {
    const connection = await getConnection();
    return connection.execute(`SELECT * FROM vino__bouteille JOIN vino__bouteille_has_vino__cellier ON vino__bouteille.id=vino__bouteille_has_vino__cellier.vino__bouteille_id JOIN vino__type ON vino__bouteille.vino__type_id=vino__type.id JOIN vino__cellier ON vino__cellier.id =vino__bouteille_has_vino__cellier.vino__cellier_id where vino__bouteille_has_vino__cellier.vino__cellier_id = `+ id +` ORDER BY vino__bouteille.id ASC`);
};

module.exports = (app) => {
    app.get("/api/get/cellier/:id/vins", async function (request, response) {
        try {
        var id = request.params.id;
        console.log(id);
        const [result] = await getAllBouteilles(id);
        response.send({ success: true, result });
        } catch (error) {
        response.status(500).send({
            success: false,
            error: genericError,
        });
        }
    });
}