window.onload = () => {
    document.querySelector('.button-left').addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('fliph');
    })
  }

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
  var collaborateurAppointmentsDeleteId = null;


  // FULLCALENDAR OPTIONS PART

  var calendarOptions = {
    initialView: 'timeGridDay',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek,listDay',
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
        noEventsText: "Aucun rendez-vous à afficher.",        
      },
    },
    locale: 'fr',
    timeZone: 'Europe/Paris',
    nowIndicator: true,
    selectable: true,
    editable: true,
    events: agendaEvents,
    slotMinTime: workMin,
    slotMaxTime: workMax,
    height: 'auto',
    allDaySlot: false,
    hiddenDays: hideDays,
    businessHours: workSpec,
    eventDidMount: function (info) {
      if(!info.isMirror){
        $(info.el).tooltip({
            title: info.event.extendedProps.description || info.event.title+' | '+  info.event.extendedProps.prestation || info.event.title,
            container: 'body',
            delay: { "show": 50, "hide": 50 },
            trigger: 'hover',
            placement: 'top',
            html: true,
        });    
      }
    },
    datesSet: () => {
      // getTitleView();
    },
    select: (arg) => {

      document.getElementById('start').value = formatDate(arg.start);
      document.getElementById('end').value = formatDate(arg.end);  
      
      document.getElementById('cardSubtitle').innerHTML = frenchDate(arg.start);

      myModal.show();
      

      for(var i = 0; i < prestations.length; i++){
        if(prestations[i].id === parseInt(document.getElementById('selectPresta').value)){

          var date = new Date(arg.start);
          date.setMinutes(date.getMinutes() + prestations[i].prestaTime)
          document.getElementById('end').value = formatDate(date); 

          eventColor = prestations[i].agendaColor

          console.log(prestations[i])

          if(!prestations[i].breakTime){
            breaktime = false;
            findCollaboratorDispo(breaktime, arg.start, date, prestations[i].prestaTime, null, null)
          }else{
            breaktime = true;
            breakTimeMinutes = prestations[i].breakTime;
            prestaTime2 = prestations[i].prestaTime2;
            findCollaboratorDispo(breaktime, arg.start, date, prestations[i].prestaTime, breakTimeMinutes, prestaTime2)
          }     
        
        }
      }      

      document.getElementById('selectPresta').onchange = (event) => {
        for(var i = 0; i < prestations.length; i++){
          if(prestations[i].id === parseInt(event.target.value)){

            var date = new Date(arg.start);
            date.setMinutes(date.getMinutes() + prestations[i].prestaTime)
            document.getElementById('end').value = formatDate(date); 


            eventColor = prestations[i].agendaColor

            console.log(prestations[i])

            if(prestations[i].breakTime === null){
              breaktime = false;
              findCollaboratorDispo(breaktime, arg.start, date, prestations[i].prestaTime, null, null)
            }else{
              breaktime = true;
              breakTimeMinutes = prestations[i].breakTime;
              prestaTime2 = prestations[i].prestaTime2;
              findCollaboratorDispo(breaktime, arg.start, date, prestations[i].prestaTime, breakTimeMinutes, prestaTime2)
              console.log(breaktime)
            }

          }
        }      
      }
    },
    eventClick: (arg) => {

      var rdvId = arg.event.id;
      

      document.getElementById('selectPrestaEdit').onchange = (event) => {
        for(var i = 0; i < prestations.length; i++){
          if(prestations[i].id === parseInt(event.target.value)){
            var date = new Date(start.value);
            date.setMinutes(date.getMinutes() + prestations[i].prestaTime)
            date.setHours(date.getHours() + 2)
            end.value = formatDate(date); 

            eventColorUp = prestations[i].agendaColor;
          }
        }      
      }


      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/appointments/'+rdvId);
      xhr.onload = () => {
          const res = JSON.parse(xhr.response);
          console.log(res);
          firstname.value = res.firstname;
          lastname.value = res.lastname;
          email.value = res.email;
          tel.value = res.tel;
          start.value = formatDate(res.start);
          end.value = formatDate(res.end);
          document.getElementById('selectPrestaEdit').value = res.prestation.id.toString();
          document.getElementById('cardSubtitleEdit').innerHTML = frenchDate(start.value);
          document.getElementById('rdvId').value = res.id;
          collaborateurAppointmentsDeleteId = res.userTakeAppointments.id;

          if(res.note){
            editorEdit.setData(res.note);
          }
          myModalEdit.show();
      }
      xhr.setRequestHeader("Content-Type", "application/json");    
      xhr.send();

    },
    eventDrop: (arg) => {
      
      var rdvId = arg.event.id;
      var start = formatDate(arg.event.start);
      var end = formatDate(arg.event.end);
      var xhr = new XMLHttpRequest();
          xhr.open('GET', '/api/appointments/'+rdvId);
          xhr.onload = () => {
              const res = JSON.parse(xhr.response);
              console.log(res)
              var prestation = res.prestation;
              res.prestation = '/api/prestations/'+prestation.id;
              console.log(res)
              res.start = start;
              res.end = end;
              updateAppointments(res);                 
          }
          xhr.setRequestHeader("Content-Type", "application/json");    
          xhr.send();

    },
    eventResize: (arg) => {
      
      var rdvId = arg.event.id;
      var start = formatDate(arg.event.start);
      var end = formatDate(arg.event.end);
      var xhr = new XMLHttpRequest();
          xhr.open('GET', '/api/appointments/'+rdvId);
          xhr.onload = () => {
              const res = JSON.parse(xhr.response);
              console.log(res)
              var prestation = res.prestation;
              res.prestation = '/api/prestations/'+prestation.id;
              console.log(res)
              res.start = start;
              res.end = end;
              updateAppointments(res);                 
          }
          xhr.setRequestHeader("Content-Type", "application/json");    
          xhr.send();

    }
  }; 


  // ON INIT

  window.onload = () => {
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
  }




  // METHODES PART

  function showCalendar(){
        var calendarEl = document.querySelector('#calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, calendarOptions);
        calendar.on('eventChange', (e) => {
          console.log(e)
          calendar.render();
        })   
        console.log(calendar)  
        cal = calendar;     
        calendar.render();
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
        document.querySelector('#calendar').innerHTML = "";
        showCalendar();
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
        var labeldiv = document.getElementById('labelCollaborateur');
            labeldiv.style.display = "flex";
            labeldiv.style.justifyContent = "flex-start";
            labeldiv.style.alignItems = "center";
            labeldiv.style.flexWrap = "wrap";

        for(var i = 0; i < res['hydra:member'][0].length; i++){
            var collaborateur = res['hydra:member'][0][i];
            collaborateurs.push(collaborateur);

            var label = document.createElement('p');
                label.style.marginRight = "10px";
                label.style.display = "flex";
                label.style.justifyContent = "space-between";
                label.style.alignItems = "center";
                label.style.flexDirection = "row-reverse";

            var carre = document.createElement('div');
                carre.style.height = "10px";
                carre.style.width = "10px";
                carre.style.backgroundColor = collaborateur.employeColor;
                carre.style.borderRadius = "2px";
                carre.style.content = "";
                carre.style.padding = "0";
                carre.style.marginRight = "5px";

                label.innerHTML = collaborateur.companyName;
                label.appendChild(carre);
                labeldiv.appendChild(label);
                

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

  // function getTitleView(){
  //   if (window.matchMedia("(max-width: 700px)").matches) {
  //     var view = cal.currentData;
  //     var viewName = view.viewTitle;
  //     var navBar = document.getElementById('navBarMobile');
      
  //     if(document.getElementById('agendaTitle')){
  //       document.getElementById('agendaTitle').innerHTML = viewName;
  //     }else{
  //       var title = document.createElement('h6');
  //       title.id = 'agendaTitle';
  //       title.innerHTML = viewName;
  //       navBar.appendChild(title);
  //     }
  //   }
  // }


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
          const res = JSON.parse(xhr.response)['hydra:member'][0];  
          console.log({
            type: "CONSOLE ERROR",
            data: res
          })

          for(var i = 0; i < agendaEvents.length; i++){
            if(agendaEvents[i].id === -1){
              agendaEvents[i].id = res.id
              console.log(agendaEvents[i])
            }
          }   
          console.log(agendaEvents);

          for(var i = 0; i < collaborateurs.length; i++){
            if(collaborateurs[i].id === parseInt(document.getElementById('selectCollaborateur').value)){
              collaborateurs[i].rdv.push(res);
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
                  const res = JSON.parse(xhr.response)['hydra:member'][0];  

                  for(var i = 0; i < agendaEvents.length; i++){
                    if(agendaEvents[i].id === -2){
                      agendaEvents[i].id = res.id
                    }
                  }   
                  console.log(agendaEvents);

                  for(var i = 0; i < collaborateurs.length; i++){
                    if(collaborateurs[i].id === parseInt(document.getElementById('selectCollaborateur').value)){
                      collaborateurs[i].rdv.push(res);
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

              collaborateurs.forEach(collaborateur => {

                if (collaborateur.id === collaborateurAppointmentsDeleteId) {
     
                  collaborateur.rdv.forEach((rdv, index)=> {

                    if (rdv.id === parseInt(document.getElementById('rdvId').value)) {
                      collaborateur.rdv.splice(index, 1);
                    }

                  });

                }

              });
              
              deleteEvent++;
              var groupId = parseInt(agendaEvents[i].groupId);
              agendaEvents.splice(i, 1);

              for(var y = 0; y < agendaEvents.length; y++){
                
                if(parseInt(document.getElementById('rdvId').value) !== parseInt(agendaEvents[y].id) && parseInt(groupId) === parseInt(agendaEvents[y].groupId)){
                  deleteEvent++;
      
                  var xhr = new XMLHttpRequest();
                  xhr.open('DELETE', '/api/appointments/delete/'+agendaEvents[y].id);

                  collaborateurs.forEach(collaborateur => {

                    if (collaborateur.id === collaborateurAppointmentsDeleteId) {
         
                      collaborateur.rdv.forEach((rdv, index)=> {
    
                        if (rdv.id === parseInt(agendaEvents[y].id)) {
                          collaborateur.rdv.splice(index, 1);
                        }
    
                      });
    
                    }
    
                  });
                  agendaEvents.splice(y, 1)
                  xhr.onload = () => {

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

  document.addEventListener('mouseover', (event) => {

    var element = event.target;
    if(element.tagName = 'TD' && element.classList.contains('fc-list-event-title') || element.classList.contains('fc-list-event-graphic') || element.classList.contains('fc-list-event-time')){
      var child = element.closest('tr').children;
      for(var i = 0; i < child.length; i++){
        child[i].style.backgroundColor = "rgba(0, 0, 0, 0.166)";
      }
    }

  })