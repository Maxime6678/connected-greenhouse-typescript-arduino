$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/info/temp",
        success: function (data) {
            $('#temp_val').text(data.value)
        },
        error: function (request, status, error) {
            alert(request.responseText)
        }
    })
})