$(function() {
        $('#getmagnet').on('submit', funciton(event) {
            var magnet = $('#magnetURL');
            $.ajax({
                url: '/torrent_magnet',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ magnet.val() }),
                success: function(response) {
                    console.log("This shit is happening!")
                }
            });
        });
    )
};