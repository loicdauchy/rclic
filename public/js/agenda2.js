$(document).ready(function() {

    // VARIABLES/ARRAY PART

    var userId = document.getElementById('userId').value;
    var userInfos = [];

    var agendaEvents = [];
    var prestations = [];
    var collaborateurs = [];

    var cal = null;

    let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
    let myModalEdit = new bootstrap.Modal(document.getElementById('editRdvModal'), {});

    var x = 0;

    var workSpec = []
    var workMin
    var workMax
    var workDays
    var hideDays
    var breaktime;
    var breakTimeMinutes = 0;
    var prestaTime2 = 0;
    var eventColor = "";
    var firstname = document.getElementById('firstnameEdit');
    var lastname = document.getElementById('lastnameEdit');
    var email = document.getElementById('emailEdit');
    var tel = document.getElementById('telEdit');
    var start = document.getElementById('startEdit');
    var end = document.getElementById('endEdit');
    var deleteId = null;
    var eventColorUp = "";
    var editorAdd;
    var editorEdit;


    // Get the modal
    var modal = document.getElementById("addEventsModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the Add Event button
    var addEvent = document.getElementById("add-e");
    // Get the Edit Event button
    var editEvent = document.getElementById("edit-event");
    // Get the Discard Modal button
    var discardModal = document.querySelectorAll("[data-dismiss='modal']")[0];
    
    // Get the Add Event button
    var addEventTitle = document.getElementsByClassName("add-event-title")[0];
    // Get the Edit Event button
    var editEventTitle = document.getElementsByClassName("edit-event-title")[0];

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // Get the all <input> elements insdie the modal
    var input = document.querySelectorAll('input[type="text"]');
    var radioInput = document.querySelectorAll('input[type="radio"]');

    // Get the all <textarea> elements insdie the modal
    var textarea = document.getElementsByTagName('textarea');

    // Create BackDrop ( Overlay ) Element
    function createBackdropElement () {
        var btn = document.createElement("div");
        btn.setAttribute('class', 'modal-backdrop fade show')
        document.body.appendChild(btn);
    }

    // Reset radio buttons

    function clearRadioGroup(GroupName) {
      var ele = document.getElementsByName(GroupName);
        for(var i=0;i<ele.length;i++)
        ele[i].checked = false;
    }

    // Reset Modal Data on when modal gets closed
    function modalResetData() {
        modal.style.display = "none";
        for (i = 0; i < input.length; i++) {
            input[i].value = '';
        }
        for (j = 0; j < textarea.length; j++) {
            textarea[j].value = '';
          i
        }
        clearRadioGroup("marker");
        // Get Modal Backdrop
        var getModalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        document.body.removeChild(getModalBackdrop)
    }

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        addEvent.style.display = 'block';
        editEvent.style.display = 'none';
        addEventTitle.style.display = 'block';
        editEventTitle.style.display = 'none';
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        createBackdropElement();
        enableDatePicker();
    }

    // Clear Data and close the modal when the user clicks on Discard button
    discardModal.onclick = function() {
        modalResetData();
        document.getElementsByTagName('body')[0].removeAttribute('style');
    }

    // Clear Data and close the modal when the user clicks on <span> (x).
    span.onclick = function() {
        modalResetData();
        document.getElementsByTagName('body')[0].removeAttribute('style');
    }

    // Clear Data and close the modal when the user clicks anywhere outside of the modal.
    window.onclick = function(event) {
        if (event.target == modal) {
            modalResetData();
            document.getElementsByTagName('body')[0].removeAttribute('style');
        }
    }

    newDate = new Date()
    monthArray = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12' ]

    function getDynamicMonth( monthOrder ) {
        var getNumericMonth = parseInt(monthArray[newDate.getMonth()]);
        var getNumericMonthInc = parseInt(monthArray[newDate.getMonth()]) + 1;
        var getNumericMonthDec = parseInt(monthArray[newDate.getMonth()]) - 1;

        if (monthOrder === 'default') {

            if (getNumericMonth < 10 ) {
                return '0' + getNumericMonth;
            } else if (getNumericMonth >= 10) {
                return getNumericMonth;
            }

        } else if (monthOrder === 'inc') {

            if (getNumericMonthInc < 10 ) {
                return '0' + getNumericMonthInc;
            } else if (getNumericMonthInc >= 10) {
                return getNumericMonthInc;
            }

        } else if (monthOrder === 'dec') {

            if (getNumericMonthDec < 10 ) {
                return '0' + getNumericMonthDec;
            } else if (getNumericMonthDec >= 10) {
                return getNumericMonthDec;
            }
        }
    }

    function showCalendar(){
        setTimeout(()=> {
            var calendar = $('#calendar').fullCalendar(calendarOptions);
            console.log(calendar.fullCalendar);
        }, 100)    
    }

    /* initialize the calendar
    -----------------------------------------------------------------*/
        var calendarOptions = {
        defaultView: 'agendaDay',
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'agendaDay,agendaWeek,listDay',
        },
        buttonText: {
            today: "Aujourd'hui",
            day: "Jour",
            month: "Mois",
            week: "Semaine",
            list: "Liste"
        },
        views: {
            listDay: {
                noEventsMessage: "Aucun rendez-vous à afficher.",        
            },
        },
        locale: 'fr',
        timeZone: 'Europe/Paris',
        nowIndicator: true,
        selectable: true,
        editable: true,
        events: agendaEvents,
        eventLimit: true,
        minTime: workMin,
        maxTime: workMax,
        hiddenDays: hideDays,
        businessHours: workSpec,
        eventMouseover: function(event, jsEvent, view) {
            $(this).attr('id', event.id);

            $('#'+event.id).popover({
                template: '<div class="popover popover-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                title: event.title,
                content: event.description,
                placement: 'top',
            });

            $('#'+event.id).popover('show');
        },
        eventMouseout: function(event, jsEvent, view) {
            $('#'+event.id).popover('hide');
        },
        eventClick: function(info) {

            addEvent.style.display = 'none';
            editEvent.style.display = 'block';

            addEventTitle.style.display = 'none';
            editEventTitle.style.display = 'block';
            modal.style.display = "block";
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            createBackdropElement();

            // Calendar Event Featch
            var eventTitle = info.title;
            var eventDescription = info.description;

            // Task Modal Input
            var taskTitle = $('#write-e');
            var taskTitleValue = taskTitle.val(eventTitle);

            var taskDescription = $('#taskdescription');
            var taskDescriptionValue = taskDescription.val(eventDescription);

            var taskInputStarttDate = $("#start-date");
            var taskInputStarttDateValue = taskInputStarttDate.val(info.start.format("YYYY-MM-DD HH:mm:ss"));

            var taskInputEndDate = $("#end-date");
            var taskInputEndtDateValue = taskInputEndDate.val(info.end.format("YYYY-MM-DD HH:mm:ss"));
        
            var startDate = flatpickr(document.getElementById('start-date'), {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                defaultDate: info.start.format("YYYY-MM-DD HH:mm:ss"),
            });

            var abv = startDate.config.onChange.push(function(selectedDates, dateStr, instance) {
                var endtDate = flatpickr(document.getElementById('end-date'), {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: dateStr
                });
            })

            var endtDate = flatpickr(document.getElementById('end-date'), {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                defaultDate: info.end.format("YYYY-MM-DD HH:mm:ss"),
                minDate: info.start.format("YYYY-MM-DD HH:mm:ss")
            });

            $('#edit-event').off('click').on('click', function(event) {
                event.preventDefault();
                /* Act on the event */
                var radioValue = $("input[name='marker']:checked").val();

                var taskStartTimeValue = document.getElementById("start-date").value;
                var taskEndTimeValue = document.getElementById("end-date").value;

                info.title = taskTitle.val();
                info.description = taskDescription.val();
                info.start = taskStartTimeValue;
                info.end = taskEndTimeValue;
                info.className = radioValue;

                $('#calendar').fullCalendar('updateEvent', info);
                modal.style.display = "none";
                modalResetData();
                document.getElementsByTagName('body')[0].removeAttribute('style');
            });
        }
    }

    var calendar = $('#calendar').fullCalendar(calendarOptions);
    cal = calendar.fullCalendar;
    console.log(cal);
    

    function enableDatePicker() {
        var startDate = flatpickr(document.getElementById('start-date'), {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: new Date()
        });

        var abv = startDate.config.onChange.push(function(selectedDates, dateStr, instance) {

            var endtDate = flatpickr(document.getElementById('end-date'), {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: dateStr
            });
        })

        var endtDate = flatpickr(document.getElementById('end-date'), {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            minDate: new Date()
        });
    }


    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    $("#add-e").off('click').on('click', function(event) {
        var radioValue = $("input[name='marker']:checked").val();
        var randomAlphaNumeric = randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
        var inputValue = $("#write-e").val();
        var inputStarttDate = document.getElementById("start-date").value;
        var inputEndDate = document.getElementById("end-date").value;

        var arrayStartDate = inputStarttDate.split(' ');

        var arrayEndDate = inputEndDate.split(' ');

        var startDate = arrayStartDate[0];
        var startTime = arrayStartDate[1];

        var endDate = arrayEndDate[0];
        var endTime = arrayEndDate[1];

        var concatenateStartDateTime = startDate+'T'+startTime+':00';
        var concatenateEndDateTime = endDate+'T'+endTime+':00';

        var inputDescription = document.getElementById("taskdescription").value;
        var myCalendar = $('#calendar');
        myCalendar.fullCalendar();
        var myEvent = {
          timeZone: 'UTC',
          allDay : false,
          id: randomAlphaNumeric,
          title:inputValue,
          start: concatenateStartDateTime,
          end: concatenateEndDateTime,
          className: radioValue,
          description: inputDescription
        };
        myCalendar.fullCalendar( 'renderEvent', myEvent, true );
        modal.style.display = "none";
        modalResetData();
        document.getElementsByTagName('body')[0].removeAttribute('style');
    });


    // Setting dynamic style ( padding ) of the highlited ( current ) date

    function setCurrentDateHighlightStyle() {
        getCurrentDate = $('.fc-content-skeleton .fc-today').attr('data-date');
        if (getCurrentDate === undefined) {
            return;
        }
        splitDate = getCurrentDate.split('-');
        if (splitDate[2] < 10) {
            $('.fc-content-skeleton .fc-today .fc-day-number').css('padding', '3px 8px');
        } else if (splitDate[2] >= 10) {
            $('.fc-content-skeleton .fc-today .fc-day-number').css('padding', '3px 4px');
        }
    }
    setCurrentDateHighlightStyle();

    const mailScroll = new PerfectScrollbar('.fc-scroller', {
        suppressScrollX : true
    });
    
    var fcButtons = document.getElementsByClassName('fc-button');
    for(var i = 0; i < fcButtons.length; i++) {
        fcButtons[i].addEventListener('click', function() {
            const mailScroll = new PerfectScrollbar('.fc-scroller', {
                suppressScrollX : true
            });        
            $('.fc-scroller').animate({ scrollTop: 0 }, 100);
            setCurrentDateHighlightStyle();
        })
    }

     ///////////////////// FONCTION POUR TROUVER DES COLLABORATEUR DISPONIBLE /////////////////////

  function findCollaboratorDispo(breaktime, start, end, prestaTime, breakTimeMinutes, prestaTime2){

    document.getElementById('selectCollaborateur').innerHTML = "";
    var collaborateurDispo = [];

    var day = new Date(start).getDay();
    console.log(day);
    if(day === 0){
      day = 7;
    }

    ///////////////////// Pour chaque collaborateur /////////////////////

    for(var i = 0; i < collaborateurs.length; i++){

      ///////////////////// Pour chaque jour de travail du collaborateur  /////////////////////
  
      for(var x = 0; x < collaborateurs[i].workDays.length; x++){

          ///////////////////// Si le jour de travail est égale au jour de la demande du rdv  /////////////////////

          if(collaborateurs[i].workDays[x].daysOfWeek[0] === parseInt(day)){

              ///////////////////// Si les dates de début et de fin de la demande de rdv se situe entre les horaires de la journée du collaborateur   /////////////////////

              if(
                parseInt(formatDateForGetHourForCompare(start).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                parseInt(formatDateForGetHourForCompare(start).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', '')) &&
                parseInt(formatDateForGetHourForCompare(end).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                parseInt(formatDateForGetHourForCompare(end).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', ''))
              ){
                
                var c =  collaborateurs[i];

                ///////////////////// Si le collaborateur a des rdv  /////////////////////

                if(c.rdv.length > 0){

                  console.log({
                    type: "CONSOLE RDV DAY",
                    data: c.rdv
                  });

                  ///////////////////// Pour chaque rdv du collaborateur  /////////////////////
                  var rdvInterfere = 0;
                  for(var y = 0; y < c.rdv.length; y++){

                    var rdvStart = new Date(c.rdv[y].start);
                    var rdvEnd = new Date(c.rdv[y].end);

                    var rdvDay = rdvStart.getDay();
                    if(rdvDay === 0){
                      rdvDay = 7;
                    }

                    console.log(rdvDay+' '+day);

                    ///////////////////// Si le jour du rdv existant est égale au jour de la demande du rdv  /////////////////////

                    if(dateWithoutHoursIsEqual(rdvStart, start)){

                      ///////////////////// Si la date de début ou la date de fin se trouve entre le rdv deja existant  /////////////////////
                  
                      if(
                        parseInt(formatDateForGetHourForCompare(rdvStart).replace(':', '')) >= parseInt(formatDateForGetHourForCompare(start).replace(':', '')) &&
                        parseInt(formatDateForGetHourForCompare(rdvStart).replace(':', '')) < parseInt(formatDateForGetHourForCompare(end).replace(':', '')) ||
                        parseInt(formatDateForGetHourForCompare(rdvEnd).replace(':', '')) > parseInt(formatDateForGetHourForCompare(start).replace(':', '')) &&
                        parseInt(formatDateForGetHourForCompare(rdvEnd).replace(':', '')) <= parseInt(formatDateForGetHourForCompare(end).replace(':', ''))
                      ){

                          rdvInterfere = 1;

                      }
                    }
                  }

                  if(breaktime === true && rdvInterfere === 0){

                    for(var y = 0; y < c.rdv.length; y++){

                      var rdvStart = new Date(c.rdv[y].start);
                      var rdvEnd = new Date(c.rdv[y].end);

                      var rdvDay = rdvStart.getDay();
                      if(rdvDay === 0){
                        rdvDay = 7;
                      }

                      console.log(rdvDay+' '+day);

                      ///////////////////// Si le jour du rdv existant est égale au jour de la demande du rdv  /////////////////////

                      if(dateWithoutHoursIsEqual(rdvStart, start)){

                        ///////////////////// Si la date de début ou la date de fin se trouve entre le rdv deja existant  /////////////////////
                    
                        if(
                          parseInt(formatDateForGetHourForCompare(rdvStart).replace(':', '')) >= parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) &&
                          parseInt(formatDateForGetHourForCompare(rdvStart).replace(':', '')) < parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) ||
                          parseInt(formatDateForGetHourForCompare(rdvEnd).replace(':', '')) > parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) &&
                          parseInt(formatDateForGetHourForCompare(rdvEnd).replace(':', '')) <= parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', ''))
                        ){

                            rdvInterfere = 1;

                        }
                        
                      }
                    }

                  }


                  if(rdvInterfere == 0){

                    if(collaborateurDispo.length > 0){

                      var checkIfCollaborateurIsInArray = 0;

                      for(var z = 0; z < collaborateurDispo.length; z++){
            
                        if(c.id !== collaborateurDispo[z].id){
                          checkIfCollaborateurIsInArray++;
                        }
            
                        if(checkIfCollaborateurIsInArray === collaborateurDispo.length){

                          if(breaktime === false){

                            collaborateurDispo.push(c);

                          }else{

                            if(
                              parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                              parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', '')) &&
                              parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                              parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', ''))
                            ){

                              collaborateurDispo.push(c);

                            }

                          }
                         
                          console.log({
                            type: "CONSOLE PUSH 1",
                            data: rdvStart
                          });
                        }
                      }
                      
            
                    }else{
            
                      if(breaktime === false){

                        collaborateurDispo.push(c);

                      }else{

                        if(
                          parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                          parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', '')) &&
                          parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                          parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', ''))
                        ){

                          collaborateurDispo.push(c);
                          
                        }

                      }
            
                    }  

                  }


                }else{

                  if(breaktime === false){

                    collaborateurDispo.push(c);

                  }else{

                    if(
                      parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                      parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', '')) &&
                      parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) >= parseInt(collaborateurs[i].workDays[x].startTime.replace(':', '')) &&
                      parseInt(formatDateForGetHourForCompare2(end, breakTimeMinutes + prestaTime2).replace(':', '')) <= parseInt(collaborateurs[i].workDays[x].endTime.replace(':', ''))
                    ){

                      collaborateurDispo.push(c);
                      
                    }

                  }
          
                }
              }       
          }
      }
    }
    
    
   console.log(collaborateurDispo);
   var selectCollaborateur = document.getElementById('selectCollaborateur');
        for(var i = 0; i < collaborateurDispo.length; i++){
          var options = document.createElement('option');
          options.value = collaborateurDispo[i].id;
          selectCollaborateur.appendChild(options);
          options.innerHTML = collaborateurDispo[i].companyName;
        }
  }


  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

  function formatDate(arg){
    var date = new Date(arg);
    return date.toISOString().substring(0, 16);
  }

  function frenchDate(date){
    var aujourdhui = new Date(date); 
    var annee = aujourdhui.getFullYear();
    var mois =aujourdhui.getMonth()+1;
    var jour = aujourdhui.getDate();
    var joursemaine = aujourdhui.getDay();
    var tab_jour = new Array("Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi");
    var tab_month = new Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre")
    return 'Le ' +  tab_jour[joursemaine] + ' ' + jour + ' ' + tab_month[mois - 1] + ' ' + annee ;
  }

  function formatDateForGetHour(dateForHour){
    var date = new Date(dateForHour);
    var hour = date.getHours() - 1;
    if(hour < 10){
      hour = '0'+hour;
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = '0'+minutes;
    }
    var fullHour = hour+':'+minutes+':00';

    return fullHour.toString();
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

  function formatDateForGetHourForCompare2(dateForHour, int){
    var date = new Date(dateForHour);
    date.setMinutes(date.getMinutes() + int);

    var hour = date.getHours() - 2;
    if(hour < 10){
      hour = '0'+hour;
    }
    var minutes = date.getMinutes();
    if(minutes < 10){
      minutes = '0'+minutes;
    }
    var fullHour = hour+':'+minutes;
    console.log(fullHour.toString());

    return fullHour.toString();
  }

  function getEventBackgroundColor(color){
    if(color === ""){
      return "#30C8CD";
    }else{
      return color;
    }
  }

  function updateAppointments(data){
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/api/appointments/'+data.id);
    xhr.onload = () => {
        const res = JSON.parse(xhr.response);
        console.log({
          type: "CONSOLE UP APPOINTMENTS",
          data: res
        });                
    }
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send(JSON.stringify(data));
  }

  function callAppointments(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/appointments/get/'+userId);
    xhr.onload = () => {
        const res = JSON.parse(xhr.response);
        console.log(res);
        for(var i = 0; i < res['hydra:member'][0].length; i++){
            var rdv = res['hydra:member'][0][i];
            agendaEvents.push({
                title: rdv.firstname+' '+rdv.lastname,
                start: new Date(rdv.start).toISOString(),
                end: new Date(rdv.end).toISOString(),
                id: rdv.id,
                groupId: rdv.groupeId,
                description: rdv.note,
                prestation: rdv.prestation.name,
                prestationId: rdv.prestation.id,
                backgroundColor: getEventBackgroundColor(rdv.userTakeAppointments.employeColor),
                borderColor: getEventBackgroundColor(rdv.userTakeAppointments.employeColor)
            })
        }
        console.log(agendaEvents)
        // document.querySelector('#calendar').innerHTML = "";
        // showCalendar();
    }
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send();
  }

  function callCollaborateurs(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/collaborateurs/get/'+userId);
    xhr.onload = () => {
        const res = JSON.parse(xhr.response);
        console.log(res);
        for(var i = 0; i < res['hydra:member'][0].length; i++){
            var collaborateur = res['hydra:member'][0][i];
            collaborateurs.push(collaborateur);
        }
        console.log({
          type: "CONSOLE COLLABORATEUR",
          data: collaborateurs
        })
    }
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send();
  }

  function callPrestations(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/prestations/get/'+userId);
    xhr.onload = () => {
        const res = JSON.parse(xhr.response);
        console.log(res);
        for(var i = 0; i < res['hydra:member'][0].length; i++){
            var presta = res['hydra:member'][0][i];
            prestations.push(presta)
        }
        console.log(prestations)

        var selectPresta = document.getElementById('selectPresta');
        for(var i = 0; i < prestations.length; i++){
          var options = document.createElement('option');
          options.value = prestations[i].id;
          selectPresta.appendChild(options);
          options.innerHTML = prestations[i].name;
        }

        var selectPrestaEdit = document.getElementById('selectPrestaEdit');
        for(var i = 0; i < prestations.length; i++){
          var options = document.createElement('option');
          options.value = prestations[i].id;
          selectPrestaEdit.appendChild(options);
          options.innerHTML = prestations[i].name;
        }
    }
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send();
  }  

  function callUserInfos(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/users/'+userId);
    xhr.onload = () => {
        const res = JSON.parse(xhr.response);
        userInfos = res;
        console.log({
          type: "CONSOLE USER",
          data: userInfos
        });
        
        for(var i = 0; i < res.workDays.length; i++){
          workSpec.push(res.workDays[i]);
        }

        workMin = workSpec.map(item => item.startTime).sort().shift()
        workMax = workSpec.map(item => item.endTime).sort().pop()
        workDays = [...new Set(workSpec.flatMap(item => item.daysOfWeek))]
        hideDays = [...Array(7).keys()].filter(day => !workDays.includes(day))

        calendarOptions = {...calendarOptions, slotMinTime: workMin, 
                                               slotMaxTime: workMax,
                                               hiddenDays: hideDays,
                                               businessHours: workSpec
                                              };

        console.log(workSpec)
        callAppointments();
    }
    xhr.setRequestHeader("Content-Type", "application/json");    
    xhr.send();
  }

  function getTitleView(){
    if (window.matchMedia("(max-width: 700px)").matches) {
      var view = cal.currentData;
      var viewName = view.viewTitle;
      var navBar = document.getElementById('navBarMobile');
      
      if(document.getElementById('agendaTitle')){
        document.getElementById('agendaTitle').innerHTML = viewName;
      }else{
        var title = document.createElement('h6');
        title.id = 'agendaTitle';
        title.innerHTML = viewName;
        navBar.appendChild(title);
      }
    }
  }


  ////////////////////////////////// LISTENER /////////////////////////////////////////////////////////:


  /////////////////// ADD APPOINTMENTS ///////////////////

  document.getElementById('saveRdv').addEventListener('click', function(){

    var note;
    if(editorAdd.getData()){
      note = editorAdd.getData();
    }else{
      note = null;
    }

    var colorCollaborateur
    for(var i = 0; i < collaborateurs.length; i++){
      if(collaborateurs[i].id === parseInt(document.getElementById('selectCollaborateur').value)){
        colorCollaborateur = collaborateurs[i].employeColor;
      }
    }

    var uniqGroupId = getRandomIntInclusive(1, 100000000);

    console.log({
      type: "CONSOLE BREAKTIME",
      data: breaktime
    })
    x++;

    if(x === 1){

      var formulaire = {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        email: document.getElementById('email').value,
        tel: document.getElementById('tel').value,
        start: document.getElementById('start').value,
        end: document.getElementById('end').value,
        note: note,
        groupeId : parseInt(uniqGroupId),
        prestation: "/api/prestations/"+document.getElementById('selectPresta').value,
        users: "/api/users/"+userId,
        userTakeAppointments: "/api/users/"+document.getElementById('selectCollaborateur').value,
      }
      console.log(formulaire)

      agendaEvents.push({
        id: -1,
        title: formulaire.firstname+' '+formulaire.lastname,
        start: formulaire.start,
        end: formulaire.end,
        groupId : uniqGroupId,
        description: note,
        prestation: document.getElementById('selectPresta').options[document.getElementById('selectPresta').selectedIndex].text,
        prestationId: document.getElementById('selectPresta').value,
        backgroundColor: getEventBackgroundColor(colorCollaborateur),
        borderColor: getEventBackgroundColor(colorCollaborateur)
      })


      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/appointments/post');
      xhr.onload = () => {
          const res = JSON.parse(xhr.response);  
          console.log({
            type: "CONSOLE ERROR",
            data: res
          })

          for(var i = 0; i < agendaEvents.length; i++){
            if(agendaEvents[i].id === -1){
              agendaEvents[i].id = res.id
            }
          }   
          console.log(agendaEvents);

          for(var i = 0; i < collaborateurs.length; i++){
            if(collaborateurs[i].id === parseInt(document.getElementById('selectCollaborateur').value)){
              collaborateurs[i].rdv.push(res['hydra:member'][0]);
              console.log(collaborateurs[i])
            }
          }

          if(breaktime === false){
            calendarOptions = {...calendarOptions, events: agendaEvents};
            console.log(calendarOptions)
            document.querySelector('#calendar').innerHTML = "";
            showCalendar();
            myModal.hide();

            setTimeout(() => {
              x = 0;
            }, 1000)
          }      
      }
      xhr.setRequestHeader("Content-Type", "application/json");    
      xhr.send(JSON.stringify(formulaire));

      console.log(breaktime)
      if(breaktime === true){

        setTimeout(() => {
      
          var newStart = new Date(document.getElementById('end').value);
          newStart.setMinutes(newStart.getMinutes() + breakTimeMinutes);
          newStart.setHours(newStart.getHours() + 2);

          var newEnd = new Date(newStart);
          newEnd.setMinutes(newEnd.getMinutes() + prestaTime2);
          console.log(prestaTime2)               

          var formulaire2 = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            tel: document.getElementById('tel').value,
            start: formatDate(newStart),
            end: formatDate(newEnd),
            note: note,
            groupeId : parseInt(uniqGroupId),
            prestation: "/api/prestations/"+document.getElementById('selectPresta').value,
            users: "/api/users/"+userId,
            userTakeAppointments: "/api/users/"+document.getElementById('selectCollaborateur').value,
          }
          console.log(formulaire2)

          agendaEvents.push({
            id: -2,
            title: formulaire2.firstname+' '+formulaire2.lastname,
            start: formulaire2.start,
            end: formulaire2.end,
            groupId : uniqGroupId,
            description: note,
            prestation: document.getElementById('selectPresta').options[document.getElementById('selectPresta').selectedIndex].text,
            prestationId: document.getElementById('selectPresta').value,
            backgroundColor: getEventBackgroundColor(colorCollaborateur),
            borderColor: getEventBackgroundColor(eventColor)
          })
  

          var xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/appointments/post');
          xhr.onload = () => {
                  const res = JSON.parse(xhr.response);  

                  for(var i = 0; i < agendaEvents.length; i++){
                    if(agendaEvents[i].id === -2){
                      agendaEvents[i].id = res.id
                    }
                  }   
                  console.log(agendaEvents);

                  for(var i = 0; i < collaborateurs.length; i++){
                    if(collaborateurs[i].id === parseInt(document.getElementById('selectCollaborateur').value)){
                      collaborateurs[i].rdv.push(res['hydra:member'][0]);
                      console.log(collaborateurs[i])
                    }
                  }

                  setTimeout(() => {
                    calendarOptions = {...calendarOptions, events: agendaEvents};
                    console.log(calendarOptions)
                    document.querySelector('#calendar').innerHTML = "";
                    showCalendar();
                    myModal.hide();
                  }, 1000)     
          }

          xhr.setRequestHeader("Content-Type", "application/json");    
          xhr.send(JSON.stringify(formulaire2));

          x = 0;

        }, 100)

      }
     
      setTimeout(() => {

        document.getElementById('firstname').value = "";
        document.getElementById('lastname').value = "";
        document.getElementById('email').value = "";
        document.getElementById('tel').value = "";
        document.getElementById('start').value = "";
        document.getElementById('end').value = "";
        editorAdd.setData("");
        
      }, 100) 

    }
    
  })  


  /////////////////// DELETE APPOINTMENTS ///////////////////

  document.getElementById('deleteRdv').addEventListener('click', function(){

    x++;
    var deleteEvent = 0;
    
    if(x === 1){

      var xhr = new XMLHttpRequest();
      xhr.open('DELETE', '/api/appointments/delete/'+document.getElementById('rdvId').value);
      xhr.onload = () => {

          for(var i = 0; i < agendaEvents.length; i++){
            if(parseInt(document.getElementById('rdvId').value) === parseInt(agendaEvents[i].id)){

              deleteEvent++;
              var groupId = parseInt(agendaEvents[i].groupId);
              agendaEvents.splice(i, 1);

              for(var y = 0; y < agendaEvents.length; y++){
                
                if(parseInt(document.getElementById('rdvId').value) !== parseInt(agendaEvents[y].id) && parseInt(groupId) === parseInt(agendaEvents[y].groupId)){
                  deleteEvent++;
                  console.log('okokok')
                  var xhr = new XMLHttpRequest();
                  xhr.open('DELETE', '/api/appointments/delete/'+agendaEvents[y].id);
                  agendaEvents.splice(y, 1)
                  xhr.onload = () => {

                    console.log({
                      type: "CONSOLE DELETE RDV",
                      data: JSON.parse(xhr.response)
                    })

                    if(deleteEvent === 2){
                      setTimeout(() => {

                        document.querySelector('#calendar').innerHTML = "";
                        showCalendar();                
                        myModalEdit.hide();
                        deleteEvent = 0;

                      }, 1000)    
                    }            

                  }
                  xhr.setRequestHeader("Content-Type", "application/json");    
                  xhr.send();
                }
                

              }          
            }
          }
          
          
          if(deleteEvent === 1){
            setTimeout(() => {

              document.querySelector('#calendar').innerHTML = "";
              showCalendar();                
              myModalEdit.hide();
              deleteEvent =  0;

            }, 1000)  
          }
      }
      xhr.setRequestHeader("Content-Type", "application/json");    
      xhr.send();

      x = 0;

    } 

  })


  /////////////////// UPDATE APPOINTMENTS ///////////////////

  document.getElementById('updateRdv').addEventListener('click', function(){

    x++;
    
    if(x === 1){

      var note;
      if(editorEdit.getData()){
        note = editorEdit.getData();
      }else{
        note = null;
      }

      var newStart = new Date(start.value);
      newStart.setHours(newStart.getHours() + 2);
      var newEnd = new Date(end.value);
      newEnd.setHours(newEnd.getHours() + 2);

      var formulaire = {
        start: newStart,
        end: newEnd,
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        tel: tel.value,
        note: note,
        prestation: "/api/prestations/"+document.getElementById('selectPrestaEdit').value,
        users: "/api/users/"+userId
      };
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', '/api/appointments/'+document.getElementById('rdvId').value);
      xhr.onload = () => {
          const res = JSON.parse(xhr.response);
          console.log(res);

          for(var i = 0; i < agendaEvents.length; i++){
            if(res.id === parseInt(agendaEvents[i].id)){
              agendaEvents[i].title = firstname.value+' '+lastname.value;
              agendaEvents[i].start = newStart.toISOString();
              agendaEvents[i].end = newEnd.toISOString();
              // agendaEvents[i].groupId = document.getElementById('selectPrestaEdit').value;
              agendaEvents[i].backgroundColor = getEventBackgroundColor(eventColorUp);
              agendaEvents[i].borderColor = getEventBackgroundColor(eventColorUp);
            }
          }

          setTimeout(() => {
            x = 0;
          }, 1000)

          document.querySelector('#calendar').innerHTML = "";
          showCalendar();
          
          myModalEdit.hide();
      }
      xhr.setRequestHeader("Content-Type", "application/json");    
      xhr.send(JSON.stringify(formulaire));

      x = 0;
    }
  })


    callPrestations();   
    callUserInfos();  
    callCollaborateurs();
    ClassicEditor
          .create( document.querySelector( '#editor' ), {
            language: 'fr'
          } )
          .then( editor => {
                  editorAdd = editor;
                  console.log( editor );
          } )
          .catch( error => {
                  console.error( error );
          } );
    ClassicEditor
          .create( document.querySelector( '#editor2' ), {
            language: 'fr'
          } )
          .then( editor => {
                  editorEdit = editor
                  console.log( editor );
          } )
          .catch( error => {
                  console.error( error );
          } );
});