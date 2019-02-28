function editChart() {
    let date = $('#date').val()
    let hour = $('#hour').val()
    let limite = $('#limite').val()
    showChart(date, hour, limite)
}

function showChart(date, hour, limite) {
    $.getJSON(`http://127.0.0.1:3000/api/graph/${date}/${hour}/${limite}`, (data) => {
        let x = [],
            yTemp = [],
            yHum = [],
            yLux = []

        for (i in data) {
            x.push(data[i].x)
            yTemp.push(data[i].y.split('@')[0])
            yHum.push(data[i].y.split('@')[1])
            yLux.push(data[i].y.split('@')[2])
        }

        if (x.length != 0) {
            $('#showDiv').html('<canvas id="chart"></canvas>');

            let config = {
                type: "line",
                data: {
                    labels: x,
                    datasets: [{
                            label: 'Température',
                            fill: false,
                            backgroundColor: 'rgba(26, 188, 156, 0.75)',
                            borderColor: 'rgba(26, 188, 156, 0.75)',
                            data: yTemp
                        },
                        {
                            label: 'Humidité',
                            fill: false,
                            backgroundColor: 'rgba(192, 57, 43, 0.75)',
                            borderColor: 'rgba(192, 57, 43, 0.75)',
                            data: yHum
                        },
                        {
                            label: 'Lumière',
                            fill: false,
                            backgroundColor: 'rgba(241, 196, 15, 0.75)',
                            borderColor: 'rgba(241, 196, 15, 0.75)',
                            data: yLux
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            display: true
                        }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                max: 100,
                                min: 0,
                                stepSize: 5
                            }
                        }]
                    }
                }
            }

            var ctx = $("#chart")
            let chart = new Chart(ctx, config)
        } else {
            $('#showDiv').html('<div class="col"><div class="alert alert-danger" style="text-align: center;" role="alert">Aucunne donnée pour cette heure donnée</div></div>');
        }

    })
}