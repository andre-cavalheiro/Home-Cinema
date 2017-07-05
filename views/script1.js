$('#getmagnet').on('submit', funciton(event) {
    var magnet = $('#magnetURL');
    $.ajax({
        url: '/download',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ magnet.val() }),
        success: function(response) {
            console.log("yep");
            magnet.val('');
        }
    })
})