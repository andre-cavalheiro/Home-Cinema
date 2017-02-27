var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
    res.render('cinema', { id: req.params.id });
});

module.exports = router;

/*   <!-- <video src="demo2.mp4" controls autoplay loop muted preload="auto" poster="demo.jpg">-->
    
    
    magnet:?xt=urn:btih:f605defa9e962e01b33debd85d91e790eba95c5f&dn=Mr.+Nobody+%282009%29+720p+BrRip+x264+-+VPPV&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969
 */