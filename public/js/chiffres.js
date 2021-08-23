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

        if (window.matchMedia("(max-width: 700px)").matches) {
            var h4 = document.createElement('h4');
                h4.id = "titleAgendaId";
                h4.style.width = "100%";
                h4.style.marginTop = "10px";
                h4.innerHTML = arg.view.title;
            
            document.getElementsByClassName('fc-header-toolbar')[0].appendChild(h4);
        }
    }
    

    getData(rdv);

    showChiffres();

    
}

function getTotal(array){

    var count = 0;

    array.forEach(element => {
        count += element;
    });

    return count;
}

function showChiffres(){
    var table = document.getElementsByClassName("fc-view-harness");
        table[0].id = 'chiffresView';
        table[0].innerHTML = "";

    var containerChart = document.createElement('div');
        containerChart.id = "chartOneWidget";
        containerChart.classList.add('col-xl-8', 'col-lg-8,', 'col-md-6', 'col-sm-12', 'col-12', 'layout-spacing');
        containerChart.style.marginTop = "20px";

    var widget = document.createElement('div');
        widget.classList.add('statbox', 'widget', 'box', 'box-shadow');

    var widgetHeader = document.createElement('div');
        widgetHeader.classList.add('widget-header');

    var widgetRow = document.createElement('div');
        widgetRow.classList.add('row');

    var widgetColHeader = document.createElement('div');
        widgetColHeader.classList.add('col-xl-12', 'col-md-12', 'col-sm-12', 'col-12');

    var widgetHeaderh4 = document.createElement('h4');
        widgetHeaderh4.innerHTML = "Rendez-vous total: <span class='text-success'>"+getTotal(data)+"</span>";

    var widgetMainContent = document.createElement('div');
        widgetMainContent.classList.add('widget-content', 'widget-content-area');

    var containerForChart = document.createElement('div');
        containerForChart.id = "chartOne";

    // containerChart.appendChild(canvas);

    var sLineArea = {
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
              show: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: 'Rendez-vous',
            data: data
        }],
        xaxis: {
            categories: labels,                
        },
        yaxis: {
            allowDecimals: false,
        }
    }

    containerChart.appendChild(widget);
    widget.appendChild(widgetHeader);
    widgetHeader.appendChild(widgetRow);
    widgetRow.appendChild(widgetColHeader);
    widgetColHeader.appendChild(widgetHeaderh4);

    widgetMainContent.appendChild(containerForChart);
    widget.appendChild(widgetMainContent);

    table[0].appendChild(containerChart);


    setTimeout(()=>{
        var chart = new ApexCharts(
            containerForChart,
            sLineArea
        );
    
        chart.render();
    }, 10)

    

    var containerChart2 = document.createElement('div');
    containerChart2.id = "chartTwoWidget";
    containerChart2.classList.add('col-xl-8', 'col-lg-8,', 'col-md-6', 'col-sm-12', 'col-12', 'layout-spacing');
    containerChart2.style.marginTop = "20px";

    var widget2 = document.createElement('div');
        widget2.classList.add('statbox', 'widget', 'box', 'box-shadow');

    var widgetHeader2 = document.createElement('div');
        widgetHeader2.classList.add('widget-header');

    var widgetRow2 = document.createElement('div');
        widgetRow2.classList.add('row');

    var widgetColHeader2 = document.createElement('div');
        widgetColHeader2.classList.add('col-xl-12', 'col-md-12', 'col-sm-12', 'col-12');

    var widgetHeaderh42 = document.createElement('h4');
        widgetHeaderh42.innerHTML = "Chiffres d'affaire total: <span class='text-success'>"+getTotal(CA)+"</span>";

    var widgetMainContent2 = document.createElement('div');
        widgetMainContent2.classList.add('widget-content', 'widget-content-area');

    var containerForChart2 = document.createElement('div');
        containerForChart2.id = "chartTwo";

    var sBar = {
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
              show: false,
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        series: [{
            name: "Chiffres d'affaire",
            data: CA
        }],
        xaxis: {
            categories: labels,
        }
    }
    
   
    table[0].appendChild(containerChart2);
    containerChart2.appendChild(widget2);
    widget2.appendChild(widgetHeader2);
    widgetHeader2.appendChild(widgetRow2);
    widgetRow2.appendChild(widgetColHeader2);
    widgetColHeader2.appendChild(widgetHeaderh42);

    widgetMainContent2.appendChild(containerForChart2);
    widget2.appendChild(widgetMainContent2);

    setTimeout(()=> {
        var chart = new ApexCharts(
            containerForChart2,
            sBar
        );
        
        chart.render();
    },10)

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

