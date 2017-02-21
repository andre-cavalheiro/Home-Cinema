var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    res.render('cinema', { id: req.params.id });
});

module.exports = router;

/*   <!-- <video src="demo2.mp4" controls autoplay loop muted preload="auto" poster="demo.jpg">-->
 */