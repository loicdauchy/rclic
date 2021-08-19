  ////////////////////// ON PAGE LOAD //////////////////////
  window.onload = () => {

    callConfig();
    callPrestations();
    callCollaborateur();

}

////////////////////// ARRAY PART //////////////////////
var category = [];
var prestations = [];
var collaborateur = [];
var workSpec = [];
var agendaEvents = [];
var selectedPrestaArray = [];
var selectedCollaborateurArray = [];
var creneaux = [];
var config = [];

////////////////////// VARIABLE PART //////////////////////
var userId = document.getElementById('userId').value;
var interface = document.getElementById('interface');
var cal ;
var selectedPresta ;
var selectedCollaborateur ;
var workMin ;
var workMax ;
var workDays ;
var hideDays ;
var increment = 0;
var selectedStart;
var now ;

////////////////////// LISTENER PART //////////////////////
document.addEventListener("click", categoryChoice );
document.addEventListener("click", prestationsChoice );
document.addEventListener("click", showCollaborateurDispo );
document.addEventListener("click", registerRdv );
document.addEventListener("click", selectDate );

////////////////////// METHOD PART //////////////////////
function callCategory (){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/category/get/"+userId);
    xhr.onload = () => {

        var response = JSON.parse(xhr.response);

        for(var i = 0; i < response['hydra:member'][0].length; i++){
            category.push(response['hydra:member'][0][i]);
        }

        console.log({
            type: "CONSOLE CATEGORY",
            data: category
        })

        showCategorie();

    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function callConfig(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/config/get/"+userId);
    xhr.onload = () => {

        var response = JSON.parse(xhr.response)['hydra:member'][0];
        config = response;
    
        console.log({
            type: "CONSOLE CONFIG",
            data: config
        })

    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function setConfigInterface(interfaceBg, interfaceColor, buttonBg, buttonColor){

    var body = document.getElementsByTagName('body');
    for(var i = 0; i < body.length; i++){
        console.log(body[i]);
        body[i].style.backgroundColor = interfaceBg;
        body[i].style.color = interfaceColor;
    }

    var btn = document.getElementsByTagName('input');
    for(var i = 0; i < btn.length; i++){
        if(btn[i].type === "submit"){

            console.log(btn[i]);
            btn[i].style.backgroundColor = buttonBg;
            btn[i].style.color = buttonColor;

        }
    }

    if(cal){

        var title = document.getElementsByClassName('fc-toolbar-title');
        for(var i = 0; i < title.length; i++){
            title[i].style.color = config.textColor;
        }
        
        var calendarBtn = document.getElementsByTagName('button');
        for(var i = 0; i < calendarBtn.length; i++){
            calendarBtn[i].style.color = config.buttonTextColor;
            calendarBtn[i].style.backgroundColor = config.buttonBackgroundColor;
            calendarBtn[i].style.border = "none";
        }

        var fcIcon = document.getElementsByClassName('fc-icon');
        for(var i = 0; i < fcIcon.length; i++){
            fcIcon[i].style.color = config.buttonTextColor;
        }

    }

}

function callPrestations (){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/prestations/get/"+userId);
    xhr.onload = () => {

        var response = JSON.parse(xhr.response);

        for(var i = 0; i < response['hydra:member'][0].length; i++){
    
            if(response['hydra:member'][0][i].category === null){

                prestations.push(response['hydra:member'][0][i]);

            }

        }

        callCategory();

        console.log({
            type: "CONSOLE PRESTATIONS",
            data: prestations
        })

    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function callCollaborateur(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/collaborateurs/get/"+userId);
    xhr.onload = () => {

        var response = JSON.parse(xhr.response);

        for(var i = 0; i < response['hydra:member'][0].length; i++){
            collaborateur.push(response['hydra:member'][0][i]);
        }

        console.log({
            type: "CONSOLE COLLABORATEUR",
            data: collaborateur
        })

    }
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function callAppointments(){
    
    for(var i = 0; i < collaborateur.length; i++){

        var c = collaborateur[i];

        if(c.companyName === selectedCollaborateur){

            workSpec = c.workDays;                    
    
            workMin = workSpec.map(item => item.startTime).sort().shift()
            workMax = workSpec.map(item => item.endTime).sort().pop()
            workDays = [...new Set(workSpec.flatMap(item => item.daysOfWeek))]
            hideDays = [...Array(7).keys()].filter(day => !workDays.includes(day))

            calendarOptions = {...calendarOptions, slotMinTime: workMin, 
                                                    slotMaxTime: workMax,
                                                    hiddenDays: hideDays,
                                                    businessHours: workSpec
              
                                                  };
            selectedCollaborateurArray = c;
            console.log(c);
            
            agendaEvents = [];

            for(var x = 0; x < c.rdv.length; x++){

                var rdv = c.rdv[x];

                agendaEvents.push({
                    title: "",
                    start: new Date(rdv.start).toISOString(),
                    end: new Date(rdv.end).toISOString(),
                    id: rdv.id,
                    groupId: rdv.groupeId,
                    description: rdv.note,
                    prestation: rdv.prestation.name,
                    prestationId: rdv.prestation.id,
                    backgroundColor: getEventBackgroundColor("#e22e2e"),
                    borderColor: getEventBackgroundColor("#e22e2e")
                })

            }

        //    calendarOptions = {...calendarOptions, events: agendaEvents};

            
        }
    }

    console.log({
        type: "CONSOLE RDV",
        data: agendaEvents,
        data2: workSpec
    })

    increment++
    showCalendar(true);
    setTimeout(() => {
        increment = 0;
    }, 100)
}

function showCategorie(){
    generateCards(category, null, interface, true, "http://127.0.0.1:8000/images/", 1, "btn-category", "image", "name", null, true, false, false, true);
    if(prestations.length > 0){
        generateCards(prestations, null, interface, false, "http://127.0.0.1:8000/logo/more.svg", 1, "btn-category", "image", "Autre", null, true, false, false, true);
    }

    setConfigInterface(config.interfaceBackgroundColor, config.textColor, config.buttonBackgroundColor, config.buttonTextColor);
}

function categoryChoice(event){

    var element = event.target;
    if(element.tagName == "INPUT" && element.classList.contains("btn-category")){

        for(var i = 0; i < category.length; i++){          
        
            if(category[i].name === element.value){

                generateCards(category[i].prestations, null, interface, true, "http://127.0.0.1:8000/images/", 1, "btn-prestations", "image", "name", null, true, false, false, true);

                var backButton = document.createElement("i");
                    backButton.classList.add("fas", "fa-arrow-left", "backButton");
                    backButton.style.color = config.textColor;
                    backButton.addEventListener("click", function(){
                        window.location.reload();
                    });
                
                interface.appendChild(backButton);

            }

            if(element.value === "Autre"){

                generateCards(prestations, null, interface, true, "http://127.0.0.1:8000/images/", 1, "btn-prestations", "image", "name", null, true, false, false, true);

                var backButton = document.createElement("i");
                    backButton.classList.add("fas", "fa-arrow-left", "backButton");
                    backButton.style.color = config.textColor;
                    backButton.addEventListener("click", function(){
                        window.location.reload();
                    });
                
                interface.appendChild(backButton);

            }

        }

        setConfigInterface(config.interfaceBackgroundColor, config.textColor, config.buttonBackgroundColor, config.buttonTextColor);

    }

}

function prestationsChoice(event){

    var element = event.target;
    if(element.tagName == "INPUT" && element.classList.contains("btn-prestations")){

        selectedPresta = element.value;
        for(var i = 0; i < prestations.length; i++){
            if(prestations[i].name === selectedPresta){
                selectedPrestaArray = prestations[i];
            }
        }

        if(selectedPrestaArray.length === 0){
            for(var i = 0; i < category.length; i++){
                for(var x = 0; x < category[i].prestations.length; x++){
                    if(category[i].prestations[x].name === selectedPresta){
                        selectedPrestaArray = category[i].prestations[x];
                    }
                }
            }
        }

        console.log(selectedPrestaArray);

        interface.innerHTML = "";

        var backButton = document.createElement("i");
            backButton.classList.add("fas", "fa-arrow-left", "backButton");
            backButton.style.color = config.textColor;
            backButton.addEventListener("click", function(){
                window.location.reload();
            });
        
        interface.appendChild(backButton);

        for(var x = 0; x < collaborateur.length; x++){

            var categoryDiv = document.createElement("div");
                categoryDiv.classList.add("card", 'mx-1', 'my-1');
                categoryDiv.style = "width: 13rem;";

            var divAnother = document.createElement("div");
                divAnother.classList.add("card-img-top", "imageCategory", "d-flex", "justify-content-center", "align-items-center");

            var image = document.createElement("i");
                image.classList.add("fa", "fa-user-circle", "iUser");
                image.style = "color:"+collaborateur[x].employeColor+";";

            var infoDiv = document.createElement("div");
                infoDiv.classList.add("card-body");
                infoDiv.style = `
                    display: flex;
                    justify-content-center;
                    align-items-center;
                    padding: 0!important;
                `;

            var btn = document.createElement("input");
                btn.classList.add("btn", "btn-primary", "btn-collaborateur");
                btn.style = `
                        width: 100% !important;
                        height: 100% !important;
                    `;
                btn.type = "submit";
                btn.value = collaborateur[x].companyName;

            interface.appendChild(categoryDiv);
            categoryDiv.appendChild(divAnother);
            divAnother.appendChild(image);
            categoryDiv.appendChild(infoDiv);
            infoDiv.appendChild(btn);

        }

        setConfigInterface(config.interfaceBackgroundColor, config.textColor, config.buttonBackgroundColor, config.buttonTextColor);

    }

}

function createForm(){
    var formGroup1 = document.createElement('div');
        formGroup1.classList.add('form-group', 'd-flex', 'justify-content-start', 'align-items-center', 'w-100');

    var nom = document.createElement('input');
        nom.classList.add("form-control");
        nom.style.margin = "5px 10px";
        nom.id = "formNom";
        nom.type = "text";
        nom.setAttribute('placeholder', 'Nom');

    var prenom = document.createElement('input');
        prenom.classList.add('form-control');
        prenom.style.margin = "5px 10px";
        prenom.id = "formPrenom";
        prenom.type = "text";
        prenom.setAttribute('placeholder', 'Prénom');

    var formGroup2 = document.createElement('div');
        formGroup2.classList.add('form-group', 'd-flex', 'justify-content-start', 'align-items-center', 'w-100');

    var mail = document.createElement('input');
        mail.classList.add('form-control');
        mail.style.margin = "5px 10px";
        mail.id = "formMail";
        mail.type = "email";
        mail.setAttribute('placeholder', 'E-mail');

    var tel = document.createElement('input');
        tel.classList.add('form-control');
        tel.style.margin = "5px 10px";
        tel.id = "formTel";
        tel.type = "tel";
        tel.setAttribute('placeholder', 'Tél');

    var formGroup3 = document.createElement('div');
        formGroup3.classList.add('form-group', 'w-100');

    var note = document.createElement('textarea');
        note.classList.add('form-control');
        note.style.margin = "5px 10px";
        note.style.maxWidth = "97.3%";
        note.id = "formNote";
        note.setAttribute('placeholder', 'Nous faire parvenir une note...');

    var submit = document.createElement('input');
        submit.classList.add("btn", "btn-primary", "btn-submit");
        submit.style.margin = "20px 0px 0px 10px";
        submit.type = "submit";
        submit.value = "Prendre rdv";

    interface.innerHTML = "";
    interface.classList.add('flex-column');
    interface.appendChild(formGroup1);
    interface.appendChild(formGroup2);
    interface.appendChild(formGroup3);
    formGroup1.appendChild(nom);
    formGroup1.appendChild(prenom);
    formGroup2.appendChild(tel);
    formGroup2.appendChild(mail);
    formGroup3.appendChild(note);
    formGroup3.appendChild(submit);

    setConfigInterface(config.interfaceBackgroundColor, config.textColor, config.buttonBackgroundColor, config.buttonTextColor);

    
}

function showSuccess(){
    var alert = document.createElement('div');
        alert.classList.add('alert', 'alert-success', 'text-center');
        alert.innerHTML = "Votre Rendez-vous à était enregistré avec succès, vous recevrez un sms de rappel 2h avant votre rendez-vous.";

    interface.innerHTML = "";
    interface.appendChild(alert);
}

function registerRdv(event){
    var element = event.target;
    if(element.tagName == "INPUT" && element.classList.contains("btn-submit")){
        console.log('rdv enregistré');
        var start = new Date(selectedStart);
            start.setHours(start.getHours() + 2);

        var end = new Date(selectedStart);
            end.setHours(end.getHours() + 2);
            end.setMinutes(end.getMinutes() + selectedPrestaArray.prestaTime);
        
        var uniqGroupId = getRandomIntInclusive(1, 100000000);

        var formulaire = {
            firstname: document.getElementById('formPrenom').value,
            lastname: document.getElementById('formNom').value,
            email: document.getElementById('formMail').value,
            tel: document.getElementById('formTel').value,
            start: start,
            end: end,
            note: document.getElementById('formNote').value || null,
            groupeId : parseInt(uniqGroupId),
            prestation: "/api/prestations/"+selectedPrestaArray.id,
            users: "/api/users/"+userId,
            userTakeAppointments: "/api/users/"+selectedCollaborateurArray.id,
          }
          console.log(formulaire)

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/appointments/post');
        xhr.onload = () => {
            const res = JSON.parse(xhr.response);  
            console.log({
                type: "CONSOLE RESPONSE",
                data: res
            })

            if(selectedPrestaArray.breakTime === null){
                showSuccess();           
            }      
        }
        xhr.setRequestHeader("Content-Type", "application/json");    
        xhr.send(JSON.stringify(formulaire));

        if(selectedPrestaArray.breakTime !== null){

            var newStart = new Date(end);
                newStart.setMinutes(newStart.getMinutes() + selectedPrestaArray.breakTime);

            var newEnd = new Date(newStart);
                newEnd.setMinutes(newEnd.getMinutes() + selectedPrestaArray.prestaTime2);

            console.log({
                type: "CONSOLE DATE",
                newStart: newStart,
                newEnd: newEnd
            })

            var formulaire2 = {
                firstname: document.getElementById('formPrenom').value,
                lastname: document.getElementById('formNom').value,
                email: document.getElementById('formMail').value,
                tel: document.getElementById('formTel').value,
                start: newStart,
                end: newEnd,
                note: document.getElementById('formNote').value || null,
                groupeId : parseInt(uniqGroupId),
                prestation: "/api/prestations/"+selectedPrestaArray.id,
                users: "/api/users/"+userId,
                userTakeAppointments: "/api/users/"+selectedCollaborateurArray.id,
            }
            console.log(formulaire2)

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/appointments/post');
            xhr.onload = () => {
              const res = JSON.parse(xhr.response);  
              showSuccess();
              setTimeout(()=> {
                // window.location.reload();
              }, 5000)
            }

            xhr.setRequestHeader("Content-Type", "application/json");    
            xhr.send(JSON.stringify(formulaire2));
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function getEventBackgroundColor(color){
    if(color === ""){
      return "#30C8CD";
    }else{
      return color;
    }
}

function formatDateForGetHourForCompare(dateForHour){
    var date = new Date(dateForHour);
    var hour = date.getHours() - 2;
    if(hour < 10){
      hour = '0'+hour;
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = '0'+minutes;
    }
    var fullHour = hour+':'+minutes;

    return fullHour.toString();
}


function changeCalendarAppearance(currentDate){
    var dataToSup = [];
    creneaux = [];
    var el = document.getElementsByClassName('fc-timegrid-slot');
    for(var i = 0; i < el.length; i++){

        var e = el[i];

        if(e.classList.contains("fc-timegrid-slot-label")){

            var child = e.children;
            if(child.length > 0){

                child[0].children[0].innerHTML = "";

            }

        }

        if(e.classList.contains("fc-timegrid-slot-lane")){

            console.log(e);

            var date = e.getAttribute('data-time');
   
            var dateToCompare = date.toString().substring(0, 5).replace(':', '');
            var dateToCompareEnd = new Date('2021-04-11T'+date+'Z');
            dateToCompareEnd.setMinutes(dateToCompareEnd.getMinutes() + selectedPrestaArray.prestaTime);

            var dateToCompareEndMinutes = formatDateForGetHourForCompare(dateToCompareEnd).replace(':', '');
       
            var dayToCompare = currentDate;

            var worksDayCompare = new Date(dayToCompare).getDay();
            if(worksDayCompare === 0){
                worksDayCompare = 7;
            }

            var endDayHour ;

            if(selectedPrestaArray.breakTime !== null){
                var newStart = dateToCompareEnd.setMinutes(dateToCompareEnd.getMinutes() + selectedPrestaArray.breakTime);
                var newStartMinutes = formatDateForGetHourForCompare(newStart).replace(':', '');

                var newEnd = new Date(newStart);
                    newEnd.setMinutes(newEnd.getMinutes() + selectedPrestaArray.prestaTime2);
                var newEndMinutes = formatDateForGetHourForCompare(newEnd).replace(':', '');
            }

            for(var y = 0; y < selectedCollaborateurArray.workDays.length; y++){
                if(selectedCollaborateurArray.workDays[y].daysOfWeek[0] === worksDayCompare){
                    endDayHour = selectedCollaborateurArray.workDays[y].endTime.replace(':', '');
                }
            }

            for(var x = 0; x < agendaEvents.length; x++){

                var otherDayToCompare = agendaEvents[x].start;

                if(dateWithoutHoursIsEqual(dayToCompare, otherDayToCompare)){            

                    console.log({
                        element: date,
                        agendaEvents: agendaEvents,
                        agendaEventOnTheBoucle: agendaEvents[x],
                        firstDayToCompare: new Date(dayToCompare).getDate(),
                        secondDayToCompare: new Date(otherDayToCompare).getDate(),
                        dayToCompare: dayToCompare
                    })
                    if(
                        parseInt(dateToCompareEndMinutes) > parseInt(endDayHour) ||
                        parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) >= parseInt(dateToCompare) &&
                        parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) < parseInt(dateToCompareEndMinutes) || 
                        parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', '')) > parseInt(dateToCompare) &&
                        parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', '')) <= parseInt(dateToCompareEndMinutes)||

                        parseInt(dateToCompare) >= parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) &&
                        parseInt(dateToCompare) < parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', '')) || 
                        parseInt(dateToCompareEndMinutes) > parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) &&
                        parseInt(dateToCompareEndMinutes) <= parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', ''))
                    ){

                            dataToSup.push(e);                      
                        
                    }

                    if(selectedPrestaArray.breakTime !== null){
                        if(
                            parseInt(newEndMinutes) > parseInt(endDayHour) ||
                            parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) >= parseInt(newStartMinutes) &&
                            parseInt(formatDateForGetHourForCompare(agendaEvents[x].start).replace(':', '')) < parseInt(newEndMinutes) || 
                            parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', '')) > parseInt(newStartMinutes) &&
                            parseInt(formatDateForGetHourForCompare(agendaEvents[x].end).replace(':', '')) <= parseInt(newEndMinutes)
                        ){

                                dataToSup.push(e);                      
                            
                        }
                    }

                }else{

                    if(parseInt(dateToCompareEndMinutes) > parseInt(endDayHour)){
                        dataToSup.push(e);
                    }

                    if(selectedPrestaArray.breakTime !== null){
                        if(parseInt(newEndMinutes) > parseInt(endDayHour)){
                            dataToSup.push(e);
                        }
                    }
                }

            }

        }
        
    }
       console.log({
            type: "CONSOLE DATATOSUP",
            data: dataToSup
       })

    for(var i = 0; i < dataToSup.length; i++){
        removeElement(dataToSup[i]);
    }

    for(var i = 0; i < el.length; i++){

        var e = el[i];

        if(e.classList.contains("fc-timegrid-slot-lane")){

            e.innerHTML = "";

            var date = e.getAttribute('data-time');

            var dateText = document.createElement('input');
                dateText.type = "submit";
                dateText.classList.add('text-center', 'btn', 'btn-primary', 'btn-select-date', 'rounded');
                dateText.style.margin = "5px";
                dateText.value = date.toString().substring(0, 5);

            creneaux.push(dateText);
            
            
            e.appendChild(dateText);

        }
        
    }

    var table = document.getElementsByClassName("fc-view-harness");
        table[0].classList.add('dispoView');
        table[0].innerHTML = "";
   
    for(var i = 0; i < creneaux.length; i++){
        table[0].appendChild(creneaux[i]);
    }

    setConfigInterface(config.interfaceBackgroundColor, config.textColor, config.buttonBackgroundColor, config.buttonTextColor);

}

function switchDay(arg){

    var view = arg.start;

    now = view;

    showCalendar(false);

    cal.changeView('timeGridDay', view);

    console.log(cal.currentData.currentDate)

    changeCalendarAppearance(cal.currentData.currentDate);
    
}

function removeElement(e){
    e.closest('tr').remove();
}

function showCollaborateurDispo(event){

    var element = event.target;
    if(element.tagName == "INPUT" && element.classList.contains("btn-collaborateur")){

        selectedCollaborateur = element.value;

        console.log(selectedPresta);
        console.log(selectedCollaborateur);

        callAppointments();

    }

}

function selectDate(event){
    var element = event.target;
  
    if(element.tagName === "INPUT" && element.classList.contains("btn-select-date")){
        console.log(element.value);
        var date = new Date(cal.currentData.currentDate);
        console.log(parseInt(element.value.slice(0, 2)));
        console.log(parseInt(element.value.slice(3, 5)));
            date.setHours(parseInt(element.value.slice(0, 2)));
            date.setMinutes(parseInt(element.value.slice(3, 5)));
            date.setSeconds(0);


        console.log(date);
        
        selectedStart = date;

        createForm();
    }
}

function showCalendar(bool){

    interface.innerHTML = "";

    var backButton = document.createElement("i");
        backButton.classList.add("fas", "fa-arrow-left", "backButton");
        backButton.style.color = config.textColor;
        backButton.addEventListener("click", function(){
            window.location.reload();
        });
    
    interface.appendChild(backButton);

    var calDiv = document.createElement("div");
        calDiv.id = "calendar";

    interface.appendChild(calDiv);

    var calendarEl = document.querySelector('#calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, calendarOptions);
   
    console.log(calendar)  
    cal = calendar;     
    calendar.render();

    if(bool === true){
        changeCalendarAppearance(cal.currentData.currentDate);
    }
}



 ////////////////////// CALENDAR OPTIONS PART //////////////////////

 var calendarOptions = {
    initialView: 'timeGridDay',
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
    nowIndicator: true,
    selectable: true,
    editable: false,
    slotMinTime: workMin,
    slotMaxTime: workMax,
    displayEventTime: false,
    height: 'auto',
    allDaySlot: false,
    hiddenDays: hideDays,
    businessHours: workSpec,
    validRange: {
        start: new Date()
    },
    datesSet: (arg) => {
        if(increment === 0){

            increment++;
            switchDay(arg);

            setTimeout(()=> {
                increment = 0;
            },10)

        }                  
    }
  }; 