$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: window.location.origin + "/api/info/all",
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
            url: window.location.origin + "/api/info/all",
            success: function (data) {
                let parse = data.value.split('@')
                $('#temp_bar').attr('data-percentage', parseInt(parse[0]))
                $('#temp_val').text(parseInt(parse[0]) + "°C")

                $('#hum_bar').attr('data-percentage', parseInt(parse[1]))
                $('#hum_val').text(parseInt(parse[1]) + "%")

                $('#lux_val').text(parseInt(parse[2]))
            }
        })
    }, 5000)

    $('#lamp').on('click', () => {
        $.ajax({
            type: "GET",
            url: window.location.origin + "/api/do/lamp/a",
            error: function (request, status, error) {
                alert(request.responseText)
            }
        })
    })

    $('#water').on('click', () => {
        $.ajax({
            type: "GET",
            url: window.location.origin + "/api/do/water/a",
            error: function (request, status, error) {
                alert(request.responseText)
            }
        })
    })

    $('#open').on('click', () => {
        $.ajax({
            type: "GET",
            url: window.location.origin + "/api/do/open/a",
            error: function (request, status, error) {
                alert(request.responseText)
            }
        })
    })

})