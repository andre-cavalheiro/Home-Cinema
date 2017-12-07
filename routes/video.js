var express = require('express');
var router = express.Router();
var ffmpeg = require('fluent-ffmpeg');


var videoPresets = [{
        quality: '720p',
        video: {
            codec: 'libvpx',
            bitrate: '4096k'
        },
        audio: {
            codec: 'libvorbis',
            bitrate: '256k'
        },
        picture: {
            resolution: '1280x?'
        }
    },
    {
        quality: '480p',
        video: {
            codec: 'libvpx',
            bitrate: '3072k'
        },
        audio: {
            codec: 'libvorbis',
            bitrate: '192k'
        },
        picture: {
            resolution: '854x?'
        }
    },
    {
        quality: '360p',
        video: {
            codec: 'libvpx',
            bitrate: '2048k'
        },
        audio: {
            codec: 'libvorbis',
            bitrate: '128k'
        },
        picture: {
            resolution: '640x?'
        }
    },
    {
        quality: '240p',
        video: {
            codec: 'libvpx',
            bitrate: '1024k'
        },
        audio: {
            codec: 'libvorbis',
            bitrate: '96k'
        },
        picture: {
            resolution: '426x?'
        }
    },
    {
        quality: '144p',
        video: {
            codec: 'libvpx',
            bitrate: '512k'
        },
        audio: {
            codec: 'libvorbis',
            bitrate: '64k'
        },
        picture: {
            resolution: '256x?'
        }
    }
];


var getVideoParams = function(quality) {
    var params;
    for (i = 0; i < videoPresets.length; i++) {
        if (videoPresets[i].quality == quality) {
            params = videoPresets[i];
        }
    }
    return params;
};


router.get('/:infoHash/:index', function(req, res, next) {

    try {
        var client = req.app.client;
        var torrent = client.get(req.params.infoHash)
        var index = req.params.index;
        var params = getVideoParams("720p");

        var start = false;
        if (typeof req.query.start != 'undefined' && req.query.start != null) {
            start = parseFloat(req.query.start);
        }

        res.contentType('webm');

        var command = ffmpeg('http://localhost:' + req.app.port + '/stream/head/' + req.params.infoHash + '/' + index)
            .format('webm')
            .size(params.picture.resolution)
            .videoCodec(params.video.codec)
            .videoBitrate(params.video.bitrate)
            .audioCodec(params.audio.codec)
            .audioBitrate(params.audio.bitrate)
            .audioChannels(2)
            .on('end', function() {
                console.log("Ficheiro convertido");
            })
            .outputOptions([ //Nao faço ideia para que é que isto serve mas torna o video menos lento
                '-deadline realtime',
                '-error-resilient 1'
            ])
            .on('error', function(err) {
                console.log('Erro na converção do ficheiro: ' + err.message);
            });

        if (start) {
            command.seekInput(start);
        }
        command.pipe(res, { end: true });
    } catch (err) {
        res.status(500).send('Error: ' + err.toString());
    }
});

module.exports = router;
