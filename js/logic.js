window.onload = function() {
    $(".button-collapse").sideNav();

    var obj = new game();
    obj.play();
}

var game = function() {
    return {
        play: function() {
            var tempRas = '+';
            var category = 'Пицца';
            var number = '';
            var icon = 'local_pizza';
            var data = [
                /*{
                    name: '',
                    price: '',
                    data: '',
                    icon: ''
                }*/
            ];

            $('.carousel.carousel-slider').carousel({fullWidth: true});
            $('#customCarousel').css('height', '110%')
            /*BTNS*/
            $('#btn-home').click(function() {
                $('#main-box-container').css('visibility', 'visible');
                $('#history-container').css('visibility', 'hidden');
                $('#slide-nav-container').css('visibility', 'hidden');
                $('.button-collapse').sideNav('hide');
            })
            $('#btn-stats, #m-menu-0-0').click(function() {
                $('#main-box-container').css('visibility', 'hidden');
                $('#history-container').css('visibility', 'visible');
                $('#slide-nav-container').css('visibility', 'visible');

                Stats.show();
            })

            $('#m-menu-1-0').click(function() {
                $('#m-menu-1-0').addClass('checked-ras');
                $('#m-menu-1-1').removeClass('checked-ras');
                tempRas = '-';
                $('#m-number').text(tempRas + number)
            })

            $('#m-menu-1-1').click(function() {
                $('#m-menu-1-1').addClass('checked-ras');
                $('#m-menu-1-0').removeClass('checked-ras');
                tempRas = '+';
                $('#m-number').text(tempRas + number)
            })

            $('.m-number-0').click(function() {
                if ($(this).attr('key') != 'Добавить') {
                    $('.m-number-0').removeClass('checked-img');
                    $(this).addClass('checked-img');
                    category = $(this).attr('key');
                }

                var elem = $(this);
                var temp = 0;
                $('.h1').each(function() {
                    if ($(this).text() == elem.attr('key')) {
                        icon = $('.m-icon:eq(' + temp + ')').text();
                    } else {
                        temp++;
                    }
                })

                console.log(icon)
            })

            $('.m-number').click(function() {
                number += $(this).text();
                $('#m-number').text(tempRas + number)
                $("#m-number").scrollLeft(3000);
            })

            $('.m-number-clean').click(function() {
                number = number.substring(0, number.length - 1)
                $('#m-number').text(tempRas + number)
            })

            /*Done*/
            $('#m-menu-0-2').click(function() {
                Stats.start();
                localSave.save();
            })

            $('#m-number-img').click(function(){
                $('#search-container').css('visibility', 'visible');
                $('#main-box-container').css('visibility', 'hidden');
                $('#history-container').css('visibility', 'hidden');
                $('#slide-nav-container').css('visibility', 'hidden');
                $('.button-collapse').sideNav('hide');
            })

            /*TEMP*/
            $('.h-box').click(function(){
                localSave.clear();
            })

            var Stats = {
                statsData: { in: 0,
                    out: 0,
                },

                start: function() {
                    this.add();
                },
                add: function() {
                    if (number.length != 0) {
                        var date = new Date();

                        data.push({
                            name: category,
                            price: tempRas + number,
                            icon: icon,
                            day: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear(),
                            time: date.getHours() + ":" + date.getMinutes(),
                        })
                        this.toast();
                        console.log(data)
                    }
                },
                toast: function() {
                    var state = 'Доход! ';
                    if (tempRas != '+') {
                        state = 'Расход! ';
                    }
                    var $toastContent = $('<span>' + state + category + ', ' + tempRas + number + ' &#8376; ' + '</span>').add($('<button class="btn-flat toast-action">Удалить</button>'));
                    Materialize.toast($toastContent, 5000);

                    $('.btn-flat').click(function() {
                        $toastContent.text('Удалено')
                        $(this).hide();
                        data.splice(data.length - 1, data.length);
                    })
                },

                show: function() {
                    var code = '';
                    for (var i = 0; i < data.length; i++) {
                        var moneyState = 'good-money';
                        if (data[i].price.substring(0, 1) == '-') {
                            moneyState = 'bad-money'
                        }
                        code += '<div class="h-elem-container">' +
                            '<div class="h-elem">' +
                            '<i class="large material-icons h-img">' + data[i].icon + '</i>' +
                            '<div class="h-elem-text">' + data[i].name + '</div>' +
                            '<div class="h-elem-num-container">' +
                            '<div class="h-elem-money ' + moneyState + '">' + data[i].price + ' ₸</div>' +
                            '<div class="h-elem-time">' + data[i].day + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }

                    $('#h-body').html(code);

                    this.avarage();
                    FireBase.writeUserData('user-test', data);
                    Charts.start();
                },

                avarage: function() {
                    $.each(data, function(index, value) {
                        if (data[index].price.substring(0, 1) == '+') {
                            Stats.statsData.in += data[index].price * 1;
                        } else {
                            Stats.statsData.out += data[index].price * -1;
                        }
                    })
                    console.log(Stats.statsData)
                }
            }

            var Charts = {
                start: function() {

                    this.circle();
                    this.diagramm();
                },
                circle: function() {
                    var ctx = document.getElementById('myChart').getContext('2d');
                    var myPieChart = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [Stats.statsData.in, Stats.statsData.out, 1000],
                                backgroundColor: ['#36a2eb', '#ff6384', '#cc65fe']
                            }],
                            labels: [
                                'Доход',
                                'Расход',
                                'Еще что то'
                            ]
                        },
                        options: {
                            legend: {
                                labels: {
                                    fontSize: 20,
                                }
                            }
                        }
                    });
                },
                diagramm: function() {
                    var randomScalingFactor = function() {
                        return Math.ceil(Math.random() * 10.0) * Math.pow(10, Math.ceil(Math.random() * 5));
                    };

                    var myLabel = [];
                    var myIn = [];
                    var myOut = [];
                    $.each(data, function(index, value){
                        myLabel.push( data[index].time );
                        if (data[index].price.substring(0, 1) == '+') {
                            myIn.push( data[index].price*1 );
                        } else {
                            myOut.push( data[index].price*-1 );
                        }
                    })
                    console.log(myIn, myOut)

                    var ctx = document.getElementById('myChart-diagramm').getContext('2d');
                    var stackedLine = new Chart(ctx, {
                        type: 'line',
                         data: {
                            labels: myLabel,
                            datasets: [{
                                label: "Расход",
                                backgroundColor: '#ffffff',
                                borderColor: '#FF6384',
                                fill: false,
                                data: myOut,
                            }, {
                                label: "Доход",
                                backgroundColor: '#ffffff',
                                borderColor: '#36A2EB',
                                fill: false,
                                data: myIn,
                            }]
                        },
                        options: {
                            responsive: true,
                            title: {
                                display: true,
                                text: 'График доходов и расходов по минутам'
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                }],
                                yAxes: [{
                                    display: true,
                                    /*type: 'logarithmic',*/
                                }]
                            }
                        }
                    });
                }
            }


            var FireBase = {
                start: function() {
                    var config = {
                        apiKey: "AIzaSyDJeeZcY5eTk-DmbFnJRFEXMMgVRsqhmm4",
                        authDomain: "fir-simpleone.firebaseapp.com",
                        databaseURL: "https://fir-simpleone.firebaseio.com",
                        projectId: "fir-simpleone",
                        storageBucket: "fir-simpleone.appspot.com",
                        messagingSenderId: "231149585415"
                    };
                    firebase.initializeApp(config);
                },

                writeUserData: function(userId, data) {
                    firebase.database().ref('users/' + userId).set({
                        data: data,
                    });
                }
            }

            var localSave = {
                save: function() {
                    localStorage.setItem('testData', JSON.stringify(data));
                },
                load: function() {
                    if (localStorage.getItem('testData') != null) {
                        var retrievedObject = localStorage.getItem('testData');
                        retrievedObject = JSON.parse(retrievedObject);
                        data = retrievedObject;
                    }
                    console.log(data)
                },
                clear: function(){
                    localStorage.removeItem('testData');
                }
            }

            var search = {
                start: function(){
                    
                }
            }

            search.start();
            localSave.load();
            FireBase.start();
        }
    }
}