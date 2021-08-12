// WINDOW ONLOAD PART

window.onload = () => {
    main.classList.add('row', 'justify-content-center', 'align-items-center', 'my-5');
    HttpRequest("GET", "/api/appointments/get/", null, userId).then( res => {

        res['hydra:member'][0].forEach(element => {
            rdv.push(element);
        });        
        
        HttpRequest("GET", "/api/users/", null, userId).then( response => {

            timeLaps = response.workDays;
            getDay(timeLaps);
    
            increment = 1;
            switchDay(null, false);
            setTimeout(() => {
                increment = 0;
            }, 500);
           
            
        });

    });
    
}

// VARIABLE PARTS

var userId = document.getElementById('userId').value;
var main = document.getElementById('main');
var main2 = document.getElementById('main2');
var cal ;
var increment = 0;

// ARRAY PARTS

var rdv = [];
var timeLaps = [];
var labels = [];
var dataAndLabel = [];
var data = [];
var CA = [];
var now ;

// EVENTLISTENER PARTS

// FUNCTION PARTS

function showCalendar(){

    main.innerHTML = "";
    
    var calDiv = document.createElement("div");
        calDiv.id = "calendar";
        calDiv.style.marginTop = "20px";
        calDiv.style.width = "100%";

    main.appendChild(calDiv);

    var calendarEl = document.querySelector('#calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, calendarOptions);
   
    cal = calendar;     
    calendar.render();

}


function getDay(array){
    array.forEach(element => {
        if(element.daysOfWeek[0] === 1){
            labels.push('Lundi');
            dataAndLabel.push({
                label: 'Lundi',
                day: 1,
                rdv: 0,
                ca: 0
            });
        }else if(element.daysOfWeek[0] === 2){
            labels.push('Mardi');
            dataAndLabel.push({
                label: 'Mardi',
                day: 2,
                rdv: 0,
                ca: 0
            });
        }else if(element.daysOfWeek[0] === 3){
            labels.push('Mercredi');
            dataAndLabel.push({
                label: 'Mercredi',
                day: 3,
                rdv: 0,
                ca: 0
            });
        }else if(element.daysOfWeek[0] === 4){
            labels.push('Jeudi');
            dataAndLabel.push({
                label: 'Jeudi',
                day: 4,
                rdv: 0,
                ca: 0
            });
        }else if (element.daysOfWeek[0] === 5){
            labels.push('Vendredi');
            dataAndLabel.push({
                label: 'Vendredi',
                day: 5,
                rdv: 0,
                ca: 0
            });
        }else if (element.daysOfWeek[0] === 6){
            labels.push('Samedi');
            dataAndLabel.push({
                label: 'Samedi',
                day: 6,
                rdv: 0,
                ca: 0
            });
        }else if(element.daysOfWeek[0] === 7){
            labels.push('Dimanche');
            dataAndLabel.push({
                label: 'Dimanche',
                day: 7,
                rdv: 0,
                ca: 0
            });
        }
    });

}

function getData(array){

    var exclude = [];
    var excludeInt = 0;
    data = [];
    CA = [];

    dataAndLabel.forEach(element => {
        element.rdv = 0;
        element.ca = 0;
    });

    array.forEach(element => {
        if(dateIsBetween(element.start, cal.currentData.viewApi.activeStart, cal.currentData.viewApi.activeEnd)){

            console.log(element)
   
            var date = new Date(element.start).getDay();
            if(date === 0){
                date = 7;
            }

            exclude.forEach(el => {
                if(el === element.groupeId){
                    excludeInt = 1;
                }
            });

            if(excludeInt === 0){
                exclude.push(element.groupeId);
                dataAndLabel.forEach(el => {
                    if(date === el.day){
                        el.rdv++;
                        el.ca += element.prestation.price;
                    }
                });
            }else{
                excludeInt = 0;
            }
            
        }
    });

    dataAndLabel.forEach(element => {
        data.push(element.rdv);
        CA.push(element.ca);
    });

}

function switchDay(arg, bool){

    if(bool === true){
        var view = arg;
        console.log(view);
        now = view;
    }
   
    showCalendar();

    if(bool === true){
        cal.changeView('timeGridWeek', view.start);
    }

    getData(rdv);

    showChiffres();

    
}

function showChiffres(){
    var table = document.getElementsByClassName("fc-view-harness");
        table[0].id = 'chiffresView';
        table[0].innerHTML = "";

    var containerChart = document.createElement('div');
    containerChart.style.minHeight = "300px";
    containerChart.style.maxWidth = "100%";
    containerChart.style.marginTop = "20px";

    var canvas = document.createElement('canvas');
        canvas.id = "myChart";
        canvas.style.minHeight = "300px";
        canvas.style.maxWidth = "100%";

    table[0].appendChild(containerChart);
    containerChart.appendChild(canvas);


    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Rendez-vous',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // forces step size to be 50 units
                            stepSize: 1
                        }
                    }
                }
            }
    });

    var containerChart2 = document.createElement('div');
        containerChart2.style.minHeight = "300px";
        containerChart2.style.maxWidth = "100%";
        containerChart2.style.marginTop = "20px";

    var canvasCA = document.createElement('canvas');
        canvasCA.id = "myChartCA";
        canvasCA.style.minHeight = "300px";
        canvasCA.style.maxWidth = "100%";
        canvasCA.style.marginTop = "20px";

    table[0].appendChild(containerChart2);
    containerChart2.appendChild(canvasCA);

    var ctxCA = document.getElementById('myChartCA').getContext('2d');
    var myChartCA = new Chart(ctxCA, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Chiffres d\'affaire',
                data: CA,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            // forces step size to be 50 units
                            stepSize: 1
                        }
                    }
                }
            }
    });
}

// FULLCALENDAR OPTIONS PART

var calendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today',
    },
    buttonText: {
      today: "Aujourd'hui",
      day: "Jour",
      month: "Mois",
      week: "Semaine",
      list: "Liste"
    },
    locale: 'fr',
    timeZone: 'Europe/Paris',
    selectable: false,
    editable: false,
    height: 'auto',
    allDaySlot: false,
    datesSet: (arg) => {

        if(increment === 0){
            increment++
            switchDay(arg, true);   
            setTimeout(() => {
                increment = 0;
            }, 100);
        }
                      
    }
  }; 

