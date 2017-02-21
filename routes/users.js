var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.query); //Imprime query string aka parametros passados por link da forma /___?var=__&var2=__
    res.render('users', { title: 'Users_page', qs: req.query }); //Passar como parametro

});

module.exports = router;