$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/api/info/all",
        success: function (data) {
            let parse = data.value.split('@')
            $('#temp_bar').attr('data-percentage', parseInt(parse[0]))
            $('#temp_val').text(parseInt(parse[0]) + "°C")

            $('#hum_bar').attr('data-percentage', parseInt(parse[1]))
            $('#hum_val').text(parseInt(parse[1]) + "%")

            $('#lux_val').text(parseInt(parse[2]))
        },
        error: function (request, status, error) {
            alert(request.responseText)
        }
    })

    setInterval(() => {
        $.ajax({
            type: "GET",
            url: "http://127.0.0.1:3000/api/info/all",
            success: function (data) {
                let parse = data.value.split('@')
                $('#temp_bar').attr('data-percentage', parseInt(parse[0]))
                $('#temp_val').text(parseInt(parse[0]) + "°C")

                $('#hum_bar').attr('data-percentage', parseInt(parse[1]))
                $('#hum_val').text(parseInt(parse[1]) + "%")

                $('#lux_val').text(parseInt(parse[2]))
            },
            error: function (request, status, error) {
                alert(request.responseText)
            }
        })
    }, 5000)

})