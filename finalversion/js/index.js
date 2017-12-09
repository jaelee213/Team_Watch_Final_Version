/* ********************************** SCRIPT VARIABLES ********************************************** */

  var addgamediv = document.getElementById('addgamehtml');
  var addplayerdiv = document.getElementById('addplayerhtml');
  var addpracticediv = document.getElementById('addpracticehtml');
  var editgamediv = document.getElementById('editgamehtml');
  var editgamestatsdiv = document.getElementById('editgamestatshtml');
  var editplayerdiv = document.getElementById('editplayerhtml');
  var editrosterdiv = document.getElementById('editrosterhtml');
  var editpracticediv = document.getElementById('editpracticehtml');
  var schedulediv = document.getElementById('schedulehtml');
  var homediv = document.getElementById('homehtml');
  var logindiv = document.getElementById('loginhtml');
  var rosterdiv = document.getElementById('rosterhtml');
  var signupdiv = document.getElementById('signuphtml');
  var viewgamestatsdiv = document.getElementById('viewgamestatshtml');
  var viewplayerdiv = document.getElementById('viewplayerhtml');
  var navdiv = document.getElementById('mainnavbar');

  var currentpage;
  var previouspage; 
/* ********************************** END OF SCRIPT VARIABLES ********************************************** */

/********************************** SCRIPT FOR ADDGAME  **********************************************/

  function clickAddGame(){
    show(addgamediv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "addgamehtml"
    });
    currentpage = "addgamehtml";
  }

  var sButton = document.getElementById('agsavebtn');
  sButton.addEventListener('click', function() {
    var xdate = document.getElementById('aggamedate').value;
    var xtime = document.getElementById('aggametime').value;

    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }

    if(!xdate) {
      alert('Please specify the date.');
      return false;
    }
    if(!xtime) {
      alert('Please specify the time.');
      return false;
    }
    var timeChecker = xtime.indexOf(":");
    var timeChecker2 = xtime.lastIndexOf(":");
    if(!timeChecker || timeChecker != timeChecker2) {
      alert('Invalid time format. Please make sure to put time in HH:MM format.');
      return false;
    }
    var tHour = xtime.slice(0, timeChecker);
    var tMinute = xtime.slice(timeChecker + 1, xtime.length);
    if(!tHour || !tMinute || tHour.length > 2 || tHour.length < 2 || tMinute.length > 2 || tMinute.length < 2) {
      alert('Invalid time format. Please make sure the hours and minutes have been input correctly.');
      return false;
    }
    if( tHour > 12 || tMinute > 60 || tHour < 1 || tMinute < 0 ) {
      alert('Invalid time input. Please make sure hours and minutes are all appropriate values.');
      return false;
    }
    var dateChecker1 = xdate.indexOf("/");
    var dateChecker2 = xdate.lastIndexOf("/");
    if( !dateChecker1 || !dateChecker2 || dateChecker1 == dateChecker2 ) {
      alert('Invalid date format. Please check and write date according to format specified above input field.');
      return false;
    }
    var dMonth = xdate.slice(0, dateChecker1);
    var dDate = xdate.slice(dateChecker1 + 1, dateChecker2);
    var dYear = xdate.slice(dateChecker2 + 1, xdate.length);
    var today = new Date();
    var curMonth = today.getMonth() + 1;
    curMonth = curMonth.toString();
    var curDay = today.getDate().toString();
    if( curDay.length == 1) {
      curDay = "0" + curDay;
    }
    var curYear = today.getFullYear().toString().substr(2,2);
    if(!dMonth || !dDate || !dYear || dYear.length != 2 ||
        dMonth.length != 2 || dDate.length != 2 ||
        dMonth > 12 || dDate > 31) {
      alert('Invalid date format or not valid date. Please fix to continue');
      return false;
    }
    if(isNaN(tHour) || isNaN(tMinute)) {
      alert('Time has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    if(isNaN(dMonth) || isNaN(dDate) || isNaN(dYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    if(curMonth > dMonth || curDay > dDate || curYear > dYear) {
      alert('Cannot make games scheduled for dates before today. Please set another date.');
      return false;
    }
    var tofd = document.querySelector('input[name=agtofday]:checked');
    if(!tofd) {
      alert('Please specify time of day.');
      return false;
    }
    var stts = document.querySelector('input[name=agstatus]:checked');
    if(!stts) {
      alert('Please specify game status.');
      return false;
    }
    var lctn = document.getElementById('aggamelocation').value;
    if(!lctn) {
      alert('Please specify location of game.');
      return false;
    }
    var optm = document.getElementById('agopponentteamname').value;
    if(!optm) {
      alert('Please specify opponent team name.');
      return false;
    }
    var rootref = firebase.database().ref();
    var currus = rootref.child("currentuser/");
    currus.once("value", function(snapshot){
      var snpsht = snapshot.val();
      var myteamname = snpsht.team;
      var str = "games/";
      myteamname = str.concat(myteamname);
      myteamname = myteamname.concat("/");
      var gameslist = rootref.child(myteamname);
      var tod = document.querySelector('input[name=agtofday]:checked').value;
      var gTime = document.getElementById('aggametime').value;
      var opponentname = document.getElementById('agopponentteamname').value;
      var date = document.getElementById('aggamedate').value;
      if(tod == "day") {
        gTime = gTime.concat(" am");
      }
      if(tod == "night") {
        gTime = gTime.concat(" pm");
        tHour = Number(tHour) + 12;
      }
      var timeid = dYear.concat(dMonth);
      timeid = timeid.concat(dDate);
      timeid = timeid.concat(tHour);
      timeid = timeid.concat(tMinute);
      var time = gTime;
      var location = document.getElementById('aggamelocation').value;
      var status = document.querySelector('input[name=agstatus]:checked').value;
      var gameid = opponentname.concat(timeid);
      gameslist.orderByChild("gameid").equalTo(gameid).once('value', snapshot => {
        const gameidobj = snapshot.val();
        if(gameidobj) {
          alert('Game already exists! Please create another game.');
          return;
        }
        else {
          gameslist.orderByChild("timeid").equalTo(timeid).once('value', snapshot => {
            const timeidobj = snapshot.val();
            if(timeidobj) {
              alert('A game already exists at that specified time and date. Please create game at another date and/or time.');
              return;
            }
            else {
              var newgame = gameslist.push();
              newgame.set({
                myteamname: snpsht.team,
                gameid: gameid,
                timeid: timeid,
                opponentname: opponentname,
                date: date,
                time: time,
                tod: tod,
                location: location,
                status: status,
                myfouls: "0",
                opponentfouls: "0",
                myredcards: "0",
                opponentredcards: "0",
                myyellowcards: "0",
                opponentyellowcards: "0",
                myshotsongoal: "0",
                opponentshotsongoal: "0",
                mygoals: "0",
                opponentgoals: "0",
                mycornerkicks: "0",
                opponentcornerkicks: "0",
                mygoalkicks: "0",
                opponentgoalkicks: "0"
              });
              alert('Game created!');
              previouspage = "addgamehtml";              
              populateGames(globalTeam);
              clickHome();
            }
          });
        }
      });
    });
  });

/********************************** SCRIPT FOR ADDPLAYER **********************************************/

  function clickAddPlayer(){
    show(addplayerdiv);
    where = addplayerdiv;
    document.getElementById('profile').src = "../img/defaultpic.jpg";
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "addplayerhtml"
    });
    currentpage = "addplayerhtml";
  }
  var savebtn = document.getElementById('apsavebtn');
  var goBack = document.getElementById('apbackbtn');

  savebtn.addEventListener('click', function() {
    var rootref = firebase.database().ref();
    var firstname = document.getElementById('apfirstname').value;
    var lastname = document.getElementById('aplastname').value;
    var email = document.getElementById('apemail').value;
    var birthdate = document.getElementById('apbirthdate').value;
    var jerseynumber = document.getElementById('apjerseynumber').value;
    var position = document.getElementById('apposition');
    var role = document.getElementById('aprole');
    if(!navigator.onLine){
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return;
    }

    if(!firstname || !lastname || !jerseynumber || !birthdate || !email) {
      alert('Incomplete form. Please fill out the entire form.');
      return;
    }
    if(email.indexOf("@") == 0 || email.indexOf("@") + 1 == email.lastIndexOf(".")) {
      alert('Invalid email. Please use a valid email.');
      return;
    }
    if(email.lastIndexOf(".") == (-1) || email.indexOf("@") == (-1)){
      alert('Invalid email format. Please write down a valid email (i.e. johndoe@yahoo.com).');
      return;
    }
    var firstdash = birthdate.indexOf("/");
    var seconddash = birthdate.lastIndexOf("/");
    if(!firstdash || !seconddash || firstdash == seconddash ) {
      alert('Invalid birthdate format. Please fill out birthdate in mm/dd/yy format.')
      return;
    }
    var bMonth = birthdate.slice(0, firstdash);
    var bDay = birthdate.slice(firstdash + 1, seconddash);
    var bYear = birthdate.slice(seconddash + 1, birthdate.length);
    if(!bMonth || !bDay || !bYear || bYear.length != 2 ||
        bMonth.length != 2 || bDay.length != 2 ||
        bMonth > 12 || bDay > 31) {
      alert('Invalid birthdate format, must be in mm/dd/yy format. Please fix to continue.');
      return;
    }
    if(isNaN(bMonth) || isNaN(bDay) || isNaN(bYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return;
    }
    if(position.options[position.selectedIndex].value == "default") {
      alert('Please choose a position.');
      return;
    }
    if(role.options[role.selectedIndex].value == "default") {
      alert('Please choose a role.');
      return;
    }
    if(jerseynumber.length > 2) {
      alert('Jersey number can be at most two characters (i.e. 00, 11 22).');
      return;
    }
    var fullname;
    var position = position.value;
    var role = role.value;
    fullname = firstname.concat(" ");
    fullname = fullname.concat(lastname);
    var rawBirthdate = bMonth + bDay + bYear;
    var currus = rootref.child("currentuser/");
    currus.once("value", function(snapshot){
      var x = snapshot.val();
      var userteam = x.team;
      var str = "players/";
      userteam = str.concat(userteam);
      var playerid = firstname.concat(lastname);
      playerid = playerid.concat(rawBirthdate);
      playerid = playerid.concat(jerseynumber);
      var playerslist = rootref.child(userteam);
      playerslist.orderByChild("playerid").equalTo(playerid).once("value", snapshot => {
        const playerobj = snapshot.val();
        if(playerobj) {
          alert('The player already exists. Please create another player or press "Go Back" to navigate to previous page.');
          return;
        }
        playerslist.orderByChild("jerseynumber").equalTo(jerseynumber).once("value", snapshot => {
          const po = snapshot.val();
          if(po){
            alert('The jersey number is already taken. Please use another jersey number.');
            return;
          }
          else {
            var newplayer = playerslist.push();
            newplayer.set({
              myteamname: x.team,
              playerid: playerid,
              jerseynumber: jerseynumber,
              birthdate: birthdate,
              firstname: firstname,
              lastname: lastname,
              email: email,
              position: position,
              role: role,
              name: fullname,
              goals: "0",
              assists: "0",
              fouls: "0",
              redcards: "0",
              yellowcards: "0",
              gamesplayed: "0"
            });
            alert('Player Created!');
            previouspage = "addplayerhtml";            
            populatePlayers(globalTeam);
            clickRoster();
          }
        });
      });
    });
  });

  goBack.addEventListener('click', function() {
    clickRoster();
  });

/********************************** SCRIPT FOR ADDPRACTICE **********************************************/

  function clickAddPractice(){
    show(addpracticediv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "addpracticehtml"
    });
    currentpage = "addpracticehtml";
  }
  var saveBtn = document.getElementById('aprsavebtn');
  saveBtn.addEventListener('click', function() {
    var dateInput = document.getElementById('aprgamedate').value;
    var timeInput = document.getElementById('aprgametime').value;
    var locationInput = document.getElementById('aprgamelocation').value;
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }

    if(!dateInput) {
      alert('Please enter the practice date.');
      return false;
    }
    if(!timeInput) {
      alert('Please enter the practice time.');
      return false;
    }
    if(!locationInput) {
      alert('Please specify location of game.');
      return false;
    }
    var timeChecker = timeInput.indexOf(":");
    var timeChecker2 = timeInput.lastIndexOf(":");
    if(!timeChecker || timeChecker != timeChecker2) {
      alert('Invalid time format. Please make sure to put time in HH:MM format.');
      return false;
    }
    var tHour = timeInput.slice(0, timeChecker);
    var tMinute = timeInput.slice(timeChecker + 1, timeInput.length);
    if(!tHour || !tMinute || tHour.length > 2 || tHour.length < 2 || tMinute.length > 2 || tMinute.length < 2) {
      alert('Invalid time format. Please make sure the hours and minutes have been input correctly.');
      return false;
    }
    if( tHour > 12 || tMinute > 60 || tHour < 1 || tMinute < 0 ) {
      alert('Invalid time input. Please make sure hours and minutes are all appropriate values.');
      return false;
    }
    var dateChecker1 = dateInput.indexOf("/");
    var dateChecker2 = dateInput.lastIndexOf("/");
    if( !dateChecker1 || !dateChecker2 || dateChecker1 == dateChecker2 ) {
      alert('Invalid date format. Please check and write date according to format specified above input field.');
      return false;
    }
    var dMonth = dateInput.slice(0, dateChecker1);
    var dDate = dateInput.slice(dateChecker1 + 1, dateChecker2);
    var dYear = dateInput.slice(dateChecker2 + 1, dateInput.length);
    if(!dMonth || !dDate || !dYear || dYear.length < 2 || dYear.length > 2 ||
        dMonth.length > 2 || dMonth.length < 1 || dDate.length > 2 || dDate.length < 2 ||
        dMonth > 12 || dDate > 31 || dYear < 17) {
      alert('Invalid date format. Please fix to continue');
      return false;
    }
    if(isNaN(tHour) || isNaN(tMinute)) {
      alert('Time has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    if(isNaN(dMonth) || isNaN(dDate) || isNaN(dYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    var tofd = document.querySelector('input[name=aprtofday]:checked');
    if(!tofd) {
      alert('Please specify time of day.');
      return false;
    }
    var dbref = firebase.database().ref().child("currentuser/");
    dbref.once("value", function(snap) {
      var sshot = snap.val();
      var myteamname = sshot.team;
      var obj = "practice/";
      myteamname = obj.concat(myteamname);
      myteamname = myteamname.concat("/");
      var practList = firebase.database().ref().child(myteamname);
      var tod = document.querySelector('input[name=aprtofday]:checked').value;
      var gTime = document.getElementById('aprgametime').value;
      var date = document.getElementById('aprgamedate').value;
      var location = document.getElementById('aprgamelocation').value;
      if(tod == "day") {
        gTime = gTime.concat(" am");
      }
      if(tod == "night") {
        gTime = gTime.concat(" pm");
        tHour = Number(tHour) + 12;
      }
      var timeid = dYear.concat(dMonth);
      timeid = timeid.concat(dDate);
      timeid = timeid.concat(tHour);
      timeid = timeid.concat(tMinute);
      var time = gTime;
      practList.orderByChild("timeid").equalTo(timeid).once('value', snap => {
        const timeidobj = snap.val();
        if(timeidobj) {
          alert('Practice already exists at that specified time and date. Enter a different time and/or date.');
          return;
        }
        else {
          var newPract = practList.push();
          newPract.set({
            timeid: timeid,
            date: date,
            time: timeInput,
            tod: tod,
            location: location
          })
          alert('Practice Created!');
          populatePractice(globalTeam);
          previouspage = "addpracticehtml";
          clickSchedule();
        }
      });
    });
  });

/********************************** SCRIPT FOR EDITGAME  **********************************************/

  var rootref = firebase.database().ref();
  var editgame = rootref.child("inspectgame/");
  var savebutton = document.getElementById('egsavebtn');
  var deletebutton = document.getElementById('egdeletebtn');
  var out = document.getElementById('outputOption');
  var put = document.getElementById('outOpt');
  var ot = document.getElementById('egOppTeam');
  var d = document.getElementById('eggameDate');
  var t = document.getElementById('eggametime');
  var l = document.getElementById('eglocation');
  var editgameid;
  var mfouls;
  var ofouls;
  var mredcards;
  var oredcards;
  var myellowcards;
  var oyellowcards;
  var mshotsongoal;
  var oshotsongoal;
  var mgoals;
  var ogoals;
  var mcornerkicks;
  var ocornerkicks;
  var mgoalkicks;
  var ogoalkicks;

  function clickEditGame(){
    show(editgamediv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "editgamehtml"
    });
    currentpage = "editgamehtml";    

    put.innerHTML = ""; 
    out.innerHTML = "";

    editgame.once("value", function(snapshot) {
      var gametoedit = snapshot.val();
      var gid = gametoedit.gameid;
      var tmm = gametoedit.team;
      var sring = "games/";
      tmm = sring.concat(tmm);
      tmm = tmm.concat("/");
      var galist = rootref.child(tmm);
      galist.orderByChild("gameid").once("value",function(snap){
        snap.forEach(function(snapshot){
          var game = snapshot.val();
          if(game.gameid == gid) {
            var gtime;
            if(game.tod == "day") {
              gtime = game.time.replace(" am", "");
              put.innerHTML += "<p><input type='radio' name='egtofday' value='day' id='egamradio' checked>A.M.</p>"
              + "<p><input type='radio' name='egtofday' value='night' id='egpmradio'>P.M.</p>";
            }
            else if(game.tod == "night") {
              gtime = game.time.replace(" pm", "");
              put.innerHTML += "<p><input type='radio' name='egtofday' value='day' id='egamradio'>A.M.</p>"
              + "<p><input type='radio' name='egtofday' value='night' id='egpmradio' checked>P.M.</p>";
            }
            if(game.status == "Home") {
              out.innerHTML += "<p><input type='radio' name='egstatus' value='Home' id='eghomestatus' checked>Home</p>"
              + "<p><input type='radio' name='egstatus' value='Away' id='egawaystatus'>Away</p>";
            }
            else if(game.status == "Away") {
              out.innerHTML += "<p><input type='radio' name='egstatus' value='Home' id='eghomestatus'>Home</p>"
              + "<p><input type='radio' name='egstatus' value='Away' id='egawaystatus' checked>Away</p>";
            }
            ot.value = game.opponentname;
            d.value = game.date;
            t.value = gtime;
            l.value = game.location;
            editgameid = game.gameid;
            mfouls = game.myfouls;
            ofouls = game.opponentfouls;
            mredcards = game.myredcards;
            oredcards = game.opponentredcards;
            myellowcards = game.myyellowcards;
            oyellowcards = game.opponentyellowcards;
            mshotsongoal = game.myshotsongoal;
            oshotsongoal = game.opponentshotsongoal;
            mgoals = game.mygoals;
            ogoals = game.opponentgoals;
            mcornerkicks = game.mycornerkicks;
            ocornerkicks = game.opponentcornerkicks;
            mgoalkicks = game.mygoalkicks;
            ogoalkicks = game.opponentgoalkicks;
          }
        });
      });
    });
  };

  savebutton.addEventListener('click', function() {
    var xdate = document.getElementById('eggameDate').value;
    var xtime = document.getElementById('eggametime').value;
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }

    if(!xdate) {
      alert('Please specify the date.');
      return false;
    }
    if(!xtime) {
      alert('Please specify the time.');
      return false;
    }
    var timeChecker = xtime.indexOf(":");
    var timeChecker2 = xtime.lastIndexOf(":");
    if(!timeChecker || timeChecker != timeChecker2) {
      alert('Invalid time format. Please make sure to put time in HH:MM format.');
      return false;
    }
    var tHour = xtime.slice(0, timeChecker);
    var tMinute = xtime.slice(timeChecker + 1, xtime.length);
    if(!tHour || !tMinute || tHour.length > 2 || tHour.length < 2 || tMinute.length > 2 || tMinute.length < 2) {
      alert('Invalid time format. Please make sure the hours and minutes have been input in HH:MM format.');
      return false;
    }
    if( tHour > 12 || tMinute > 60 || tHour < 1 || tMinute < 0 ) {
      alert('Invalid time input. Please make sure hours and minutes are all appropriate values.');
      return false;
    }
    var dateChecker1 = xdate.indexOf("/");
    var dateChecker2 = xdate.lastIndexOf("/");
    if( !dateChecker1 || !dateChecker2 || dateChecker1 == dateChecker2 ) {
      alert('Invalid date format. Please check and write date according to format specified above input field.');
      return false;
    }
    var dMonth = xdate.slice(0, dateChecker1);
    var dDate = xdate.slice(dateChecker1 + 1, dateChecker2);
    var dYear = xdate.slice(dateChecker2 + 1, xdate.length);
    if(!dMonth || !dDate || !dYear || dYear.length < 2 || dYear.length > 2 ||
        dMonth.length > 2 || dMonth.length < 1 || dDate.length > 2 || dDate.length < 2 ||
        dMonth > 12 || dDate > 31 || dYear < 17) {
      alert('Invalid date format. Please fix to continue');
      return false;
    }
    if(isNaN(tHour) || isNaN(tMinute)) {
      alert('Time has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    if(isNaN(dMonth) || isNaN(dDate) || isNaN(dYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    var today = new Date();
    var curMonth = today.getMonth() + 1;
    curMonth = curMonth.toString();
    var curDay = today.getDate().toString();
    if( curDay.length == 1) {
      curDay = "0" + curDay;
    }
    var curYear = today.getFullYear().toString().substr(2,2);
    if(curMonth > dMonth || curDay > dDate || curYear > dYear) {
      alert('Cannot make games scheduled for dates before today. Please set another date.');
      return false;
    }
    var tofd = document.querySelector('input[name=egtofday]:checked');
    if(!tofd) {
      alert('Please specify time of day.');
      return false;
    }
    var stts = document.querySelector('input[name=egstatus]:checked');
    if(!stts) {
      alert('Please specify game status.');
      return false;
    }
    var lctn = document.getElementById('eglocation').value;
    if(!lctn) {
      alert('Please specify location of game.');
      return false;
    }
    var optm = document.getElementById('egOppTeam').value;
    if(!optm) {
      alert('Please specify opponent team name.');
      return false;
    }
    var currus = rootref.child("inspectgame/");
    currus.once("value", function(snapshot){
      var userNow = snapshot.val();
      var not = userNow.team;
      var str = "games/";
      not = str.concat(not);
      not = not.concat("/");
      var gameslist = rootref.child(not);
      var tod = document.querySelector('input[name=egtofday]:checked').value;
      gTime = document.getElementById('eggametime').value;
      var opponentname = document.getElementById('egOppTeam').value;
      var date = document.getElementById('eggameDate').value;
      if(tod == "day") {
        gTime = gTime.concat(" am");
      }
      if(tod == "night") {
        gTime = gTime.concat(" pm");
        tHour = Number(tHour) + 12;
      }
      var timeid = dYear.concat(dMonth);
      timeid = timeid.concat(dDate);
      timeid = timeid.concat(tHour);
      timeid = timeid.concat(tMinute);
      var time = gTime;
      var location = document.getElementById('eglocation').value;
      var status = document.querySelector('input[name=egstatus]:checked').value;
      var gameid = opponentname.concat(timeid);
      gameslist.orderByChild("timeid").once("value", function(snapshot){
        snapshot.forEach(function(snap){
          var currGame = snap.val();
          var updateGame = snap.ref;
          if(currGame.gameid == editgameid) {
            updateGame.update({
              gameid: gameid,
              timeid: timeid,
              opponentname: opponentname,
              date: date,
              time: time,
              tod: tod,
              location: location,
              status: status,
              myfouls: mfouls,
              opponentfouls: ofouls,
              myredcards: mredcards,
              opponentredcards: oredcards,
              myyellowcards: myellowcards,
              opponentyellowcards: oyellowcards,
              myshotsongoal: mshotsongoal,
              opponentshotsongoal: oshotsongoal,
              mygoals: mgoals,
              opponentgoals: ogoals,
              mycornerkicks: mcornerkicks,
              opponentcornerkicks: ocornerkicks,
              mygoalkicks: mgoalkicks,
              opponentgoalkicks: ogoalkicks
            });
            alert("Game Updated!");
            populateGames(globalTeam);
            previouspage = "editgamehtml";            
            clickSchedule();
          }
        });
      });
    });
  });

  deletebutton.addEventListener('click', function(){
    if(!navigator.onLine){
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var currus = rootref.child("inspectgame/");
    currus.once("value", function(snapshot){
      var uNow = snapshot.val();
      var noot = uNow.team;
      var strin = "games/";
      noot = strin.concat(noot);
      noot = noot.concat("/");
      var gameslist = rootref.child(noot);
      gameslist.orderByChild("timeid").once("value", function(snapshot){
        snapshot.forEach(function(snap){
          var nowGame = snap.val();
          var deleteGame = snap.ref;
          if(nowGame.gameid == uNow.gameid) {
            deleteGame.remove();
            alert("Game Deleted.");
            populateGames(globalTeam);
            previouspage = "editgamehtml";            
            clickSchedule();
          }
        });
      });
    });
  });

/********************************** SCRIPT FOR EDITGAMESTATS **********************************************/

  var myte = document.getElementById('myte');
  var oppt = document.getElementById('oppt');
  var my = document.getElementById('egsmyteam');
  var their = document.getElementById('egstheirteam');
  var ms = document.getElementById('myteamscorevgs');
  var ts = document.getElementById('oppteamscoresvgs');
  var mg = document.getElementById('myteamgoalsvgs');
  var tg = document.getElementById('oppteamgoalsvgs');
  var mf = document.getElementById('myteamfoulvgs');
  var tf = document.getElementById('oppteamfoulvgs');
  var mrc = document.getElementById('myteamredcardvgs');
  var trc = document.getElementById('oppteamredcardvgs');
  var myc = document.getElementById('myteamyellowcardvgs');
  var tyc = document.getElementById('oppteamyellowcardvgs');
  var msog = document.getElementById('myteamshotsongoalvgs');
  var tsog = document.getElementById('oppteamshotsongoalvgs');
  var mck = document.getElementById('myteamcornerkicksvgs');
  var tck = document.getElementById('oppteamcornerkicksvgs');
  var mgk = document.getElementById('myteamgoalkicksvgs');
  var tgk = document.getElementById('oppteamgoalkicksvgs');
  var egssaveBtn = document.getElementById('egssavebtn');

  function clickEditGameStats(){
    show(editgamestatsdiv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "editgamestatshtml"
    });
    currentpage = "editgamestatshtml";
    
    var rootref = firebase.database().ref();
    var viewgame = rootref.child("inspectgame/");
    viewgame.once("value", function(snapshot) {
      var gametoview = snapshot.val();
      var gid = gametoview.gameid;
      var tmm = gametoview.team;
      var sring = "games/";
      tmm = sring.concat(tmm);
      tmm = tmm.concat("/");
      var gameslist = rootref.child(tmm);
      gameslist.orderByChild("gameid").once("value",function(snap){
        snap.forEach(function(snapshot){
          var stats = snapshot.val();
          if(stats.gameid == gid) {
            myte.innerHTML = gametoview.team,
            oppt.innerHTML = stats.opponentname,
            my.innerHTML = gametoview.team,
            their.innerHTML = stats.opponentname,
            ms.innerHTML = stats.mygoals;
            ts.innerHTML = stats.opponentgoals;
            mg.innerHTML = stats.mygoals;
            tg.innerHTML = stats.opponentgoals;
            mf.innerHTML = stats.myfouls;
            tf.innerHTML = stats.opponentfouls;
            mrc.innerHTML = stats.myredcards;
            trc.innerHTML = stats.opponentredcards;
            myc.innerHTML = stats.myyellowcards;
            tyc.innerHTML = stats.opponentyellowcards;
            msog.innerHTML = stats.myshotsongoal;
            tsog.innerHTML = stats.opponentshotsongoal;
            mck.innerHTML = stats.mycornerkicks;
            tck.innerHTML = stats.opponentcornerkicks;
            mgk.innerHTML = stats.mygoalkicks;
            tgk.innerHTML = stats.opponentgoalkicks;
          }
        });
      });
    });
  }

  function incr(spanId) {
    var currStat = document.getElementById(spanId);
    var newNum = Number(currStat.innerHTML) + 1;
    currStat.innerHTML = newNum;
  }

  function decr(spanId) {
    var currStat = document.getElementById(spanId);
    var newNum = Number(currStat.innerHTML) - 1;
    if (newNum < 0) {
      newNum = 0;
    }
    currStat.innerHTML = newNum;
  }

  egssaveBtn.addEventListener('click', function () {
    if(!navigator.onLine){
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var viewgame = rootref.child("inspectgame/");

    viewgame.once("value", function(snapshot){
      var gametoedit = snapshot.val();
      var gid = gametoedit.gameid;
      var tmm = gametoedit.team;
      var sring = "games/";
      tmm = sring.concat(tmm);
      tmm = tmm.concat("/");

      var gameslist = rootref.child(tmm);
      gameslist.orderByChild("gameid").once("value", function(snap){
        snap.forEach(function(snapshot){
          var game = snapshot.val();
          var updategame = snapshot.ref;
          if(game.gameid == gid) {
            updategame.update({
              mygoals: mg.innerHTML,
              opponentgoals: tg.innerHTML,
              myfouls: mf.innerHTML,
              opponentfouls: tf.innerHTML,
              myredcards: mrc.innerHTML,
              opponentredcards: trc.innerHTML,
              myyellowcards: myc.innerHTML,
              opponentyellowcards: tyc.innerHTML,
              myshotsongoal: msog.innerHTML,
              opponentshotsongoal: tsog.innerHTML,
              mycornerkicks: mck.innerHTML,
              opponentcornerkicks: tck.innerHTML,
              mygoalkicks: mgk.innerHTML,
              opponentgoalkicks: tgk.innerHTML
            });
          }
        });
        populateGames(globalTeam);
        previouspage = "editgamestatshtml";        
        clickViewGameStats();
      })
    });
  });

/********************************** SCRIPT FOR EDITPLAYER **********************************************/

  var sv = document.getElementById('epsavebtn');
  var dl = document.getElementById('epdeletebtn');
  var fnm = document.getElementById('dfn');
  var lnm = document.getElementById('dln');
  var nme = document.getElementById('dpn');
  var pos = document.getElementById('dp');
  var jer = document.getElementById('dj');
  var dob = document.getElementById('dd');
  var goa = document.getElementById('dg');
  var ast = document.getElementById('da');
  var gpd = document.getElementById('dgp');
  var fl = document.getElementById('df');
  var rcd = document.getElementById('dr');
  var ycd = document.getElementById('dy');
  var email = document.getElementById('dem');

  function clickEditPlayer(){
    show(editplayerdiv);
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "editplayerhtml"
    });
    currentpage = "editplayerhtml";
    
    var viewplayer = rootref.child("inspectplayer/");
    viewplayer.once("value", function(snapshot){
      var player = snapshot.val();
      var txt = "players/";
      var pteam = player.team; 
      txt = txt.concat(pteam);
      txt = txt.concat("/");
      var playerslist = rootref.child(txt);
      playerslist.orderByChild("playerid").once("value", function(snapshot){
        snapshot.forEach(function(snap){
          var pla = snap.val();
          if(pla.playerid == player.playerid) {
            var sv = document.getElementById('epsavebtn');
            var dl = document.getElementById('epdeletebtn');
            var fnm = document.getElementById('dfn');
            var lnm = document.getElementById('dln');
            var nme = document.getElementById('dpn');
            var pos = document.getElementById('dp');
            var jer = document.getElementById('dj');
            var dob = document.getElementById('dd');
            var goa = document.getElementById('dg');
            var ast = document.getElementById('da');
            var gpd = document.getElementById('dgp');
            var fl = document.getElementById('df');
            var rcd = document.getElementById('dr');
            var ycd = document.getElementById('dy');
            var email = document.getElementById('dem');
          
            fnm.innerHTML = pla.firstname.toString();
            lnm.innerHTML = pla.lastname.toString();
            email.innerHTML = pla.email.toString();
            nme.innerHTML = pla.name.toString();
            pos.innerHTML = pla.position.toString();
            jer.innerHTML = pla.jerseynumber.toString();
            dob.innerHTML = pla.birthdate.toString();
            goa.innerHTML = pla.goals.toString();
            ast.innerHTML = pla.assists.toString();
            gpd.innerHTML = pla.gamesplayed.toString();
            fl.innerHTML = pla.fouls.toString();
            rcd.innerHTML = pla.redcards.toString();
            ycd.innerHTML = pla.yellowcards.toString();
          }
        });
      });
    });
  }

  sv.addEventListener('click', function() {
    var rootref = firebase.database().ref();
    var viewplayer = rootref.child("inspectplayer/");
    var firstname = fnm.innerHTML;
    var lastname = lnm.innerHTML;
    var emaill = email.innerHTML;
    var birthdate = dob.innerHTML;
    var jerseynumber = jer.innerHTML;
    var position = pos.innerHTML;

    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return;
    }

    if(!firstname || !lastname || !jerseynumber || !birthdate || !emaill || !position) {
      alert('Incomplete form. Please fill out the entire form.');
      return;
    }
    if(emaill.indexOf("@") == 0 || emaill.indexOf("@") + 1 == emaill.lastIndexOf(".")) {
      alert('Invalid email. Please use a valid email.');
      return;
    }
    if(emaill.lastIndexOf(".") == (-1) || emaill.indexOf("@") == (-1)){
      alert('Invalid email format. Please write down a valid email (i.e. johndoe@yahoo.com).');
      return;
    }
    var firstdash = birthdate.indexOf("/");
    var seconddash = birthdate.lastIndexOf("/");
    if(!firstdash || !seconddash || firstdash == seconddash ) {
      alert('Invalid birthdate format. Please fill out birthdate in mm/dd/yy format.')
      return;
    }
    if(birthdate.length > 8) {
      alert('Invalid birthdate format. Please adhere to the mm/dd/yy format.');
      return;
    }
    if(jerseynumber.length > 2) {
      alert('Jersey number can be at most two characters (i.e. 00, 11 22).');
      return;
    }
    var bMonth = birthdate.slice(0, firstdash);
    var bDay = birthdate.slice(firstdash + 1, seconddash);
    var bYear = birthdate.slice(seconddash + 1, birthdate.length);
    if(!bMonth || !bDay || !bYear || bYear.length != 2 ||
        bMonth.length != 2 || bDay.length != 2 ||
        bMonth > 12 || bDay > 31) {
      alert('Invalid birthdate format, must be in mm/dd/yy format. Please fix to continue.');
      return;
    }
    if(isNaN(bMonth) || isNaN(bDay) || isNaN(bYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return;
    }
    if(!isNaN(position) || !(position.toUpperCase().replace(/\s/g, "") == "GOALKEEPER"
    || position.toUpperCase().replace(/\s/g, "") == "MIDFIELDER"
    || position.toUpperCase().replace(/\s/g, "") == "FORWARD"
    || position.toUpperCase().replace(/\s/g, "") == "DEFENDER")) {
      alert('Please choose a valid position (Goalkeeper, Midfielder, Forward, Defender). Be careful with extra spaces!');
      return;
    }
    position = position.toUpperCase().replace(/\s/g, "");
    if(isNaN(goa.innerHTML) || isNaN(ast.innerHTML) || isNaN(gpd.innerHTML) || isNaN(fl.innerHTML)
    || isNaN(rcd.innerHTML) || isNaN(ycd.innerHTML)) {
      alert('Counting stats must be in numerical format.');
      return;
    }

    viewplayer.once("value", function(snapshot){
      var player = snapshot.val();
      var stg = "players/";
      stg = stg.concat(player.team);
      stg = stg.concat("/");
      var fullname;
      fullname = firstname.concat(" ");
      fullname = fullname.concat(lastname);
      var rawBirthdate = bMonth + bDay + bYear;
      var playerid = firstname.concat(lastname);
      playerid = playerid.concat(rawBirthdate);
      playerid = playerid.concat(jerseynumber);
      var playerslist = rootref.child(stg);
      playerslist.orderByChild("playerid").once("value", function(snapshot){
        snapshot.forEach(function(snap){
          var pla = snap.val();
          if(pla.playerid == player.playerid) {
            var sv = document.getElementById('epsavebtn');
            var dl = document.getElementById('epdeletebtn');
            var fnm = document.getElementById('dfn');
            var lnm = document.getElementById('dln');
            var nme = document.getElementById('dpn');
            var pos = document.getElementById('dp');
            var jer = document.getElementById('dj');
            var dob = document.getElementById('dd');
            var goa = document.getElementById('dg');
            var ast = document.getElementById('da');
            var gpd = document.getElementById('dgp');
            var fl = document.getElementById('df');
            var rcd = document.getElementById('dr');
            var ycd = document.getElementById('dy');
            var email = document.getElementById('dem');
            var ug = Number(goa.innerHTML).toString();
            var ua = Number(ast.innerHTML).toString();
            var ugp = Number(gpd.innerHTML).toString();
            var uf = Number(fl.innerHTML).toString();
            var ur = Number(rcd.innerHTML).toString();
            var uy = Number(ycd.innerHTML).toString();

            var currentPlyr = snap.ref;
            currentPlyr.update({
              myteamname: player.team,
              firstname: fnm.innerHTML.toString(),
              playerid: playerid,
              lastname: lnm.innerHTML.toString(),
              email: emaill,
              name: fullname,
              position: position,
              jerseynumber: jer.innerHTML.toString(),
              birthdate: dob.innerHTML.toString(),
              goals: ug,
              assists: ua,
              gamesplayed: ugp,
              fouls: uf,
              redcards: ur,
              yellowcards: uy
            });
          }
        });
        var rootref = firebase.database().ref();
        var moveplr = rootref.child("inspectplayer/");
        moveplr.set({
          team: player.team,
          playerid: playerid
        })
        populatePlayers(globalTeam);
        previouspage = "editplayerhtml";        
        clickViewPlayer();
      });
    });
  });

  dl.addEventListener('click', function() {
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var currus = rootref.child("inspectplayer/");
    currus.once("value", function(snapshot){
      var uNow = snapshot.val();
      var noot = uNow.team;
      var strin = "players/";
      noot = strin.concat(noot);
      noot = noot.concat("/");
      var playerslist = rootref.child(noot);
      playerslist.orderByChild("playerid").once("value", function(snapshot){
        snapshot.forEach(function(snap){
          var nowPlayer = snap.val();
          var deletePlayer = snap.ref;
          if(nowPlayer.playerid == uNow.playerid) {
            deletePlayer.remove();
            alert("Player Deleted.");
            populatePlayers(globalTeam);
            previouspage = "editplayerhtml";            
            clickRoster();
          }
        });
      });
    });
  });

/********************************** SCRIPT FOR EDITPRACTICE **********************************************/

  var saveBtn = document.getElementById('eprsavebtn');
  var delBtn = document.getElementById('eprdeletebtn');
  var oldTimeid;
  var currTeam;
  var practiceEdit = firebase.database().ref().child("practedit/");
  var userRef = firebase.database().ref().child("currentuser/");

  function clickEditPractice(){
    show(editpracticediv);
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "editpracticehtml"
    });
    currentpage = "editpracticehtml";
    
    userRef.once("value", function(snap){
      var snap1 = snap.val();
      currTeam = snap1.team;
      var team = currTeam;
      var str = "practice/";
      team = str.concat(team);
      team = team.concat("/");
      practiceEdit.once("value", function(snap2) {
        var pract = snap2.val();
        oldTimeid = pract.timeid;
        var practice = firebase.database().ref().child(team);
        practice.orderByChild("timeid").once("value", function(snap3){
          snap3.forEach(function(snap4){
            var snapshot = snap4.val();
            if(oldTimeid == snapshot.timeid) {
              document.getElementById("eprgamedate").value = snapshot.date;
              document.getElementById("eprgametime").value = snapshot.time;
              if(snapshot.tod == 'night') {
                document.getElementById('eprpmradio').checked = true;
              }
              else {
                document.getElementById('epramradio').checked = true;
              }
              document.getElementById("eprgamelocation").value = snapshot.location;
            }
          });
        });
      });
    });
  }

  saveBtn.addEventListener('click', function() {
    var dateInput = document.getElementById("eprgamedate").value;
    var timeInput = document.getElementById("eprgametime").value;
    var locationInput = document.getElementById("eprgamelocation").value;
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    if(!dateInput) {
      alert('Please specify date');
      return false;
    }
    if(!timeInput) {
      alert('Please specify time');
      return false;
    }
    if(!locationInput) {
      alert('Please specify location');
      return false;
    }
    var timeChecker = timeInput.indexOf(":");
    var timeChecker2 = timeInput.lastIndexOf(":");
    if(!timeChecker || timeChecker != timeChecker2) {
      alert('Invalid time format. Please make sure to put time in HH:MM format.');
      return false;
    }
    var tHour = timeInput.slice(0, timeChecker);
    var tMinute = timeInput.slice(timeChecker + 1, timeInput.length);
    if(!tHour || !tMinute || tHour.length > 2 || tHour.length < 2 || tMinute.length > 2 || tMinute.length < 2) {
      alert('Invalid time format. Please make sure the hours and minutes have been input in HH:MM format.');
      return false;
    }
    if( tHour > 12 || tMinute > 60 || tHour < 1 || tMinute < 0 ) {
      alert('Invalid time input. Please make sure hours and minutes are all appropriate values.');
      return false;
    }
    var dateChecker1 = dateInput.indexOf("/");
    var dateChecker2 = dateInput.lastIndexOf("/");
    if( !dateChecker1 || !dateChecker2 || dateChecker1 == dateChecker2 ) {
      alert('Invalid date format. Please check and write date according to format specified above input field.');
      return false;
    }
    var dMonth = dateInput.slice(0, dateChecker1);
    var dDate = dateInput.slice(dateChecker1 + 1, dateChecker2);
    var dYear = dateInput.slice(dateChecker2 + 1, dateInput.length);
    if(!dMonth || !dDate || !dYear || dYear.length < 2 || dYear.length > 2 ||
        dMonth.length > 2 || dMonth.length < 1 || dDate.length > 2 || dDate.length < 2 ||
        dMonth > 12 || dDate > 31 || dYear < 17) {
      alert('Invalid date format. Please fix to continue');
      return false;
    }
    if(isNaN(tHour) || isNaN(tMinute)) {
      alert('Time has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    if(isNaN(dMonth) || isNaN(dDate) || isNaN(dYear)) {
      alert('Date has to be in numerical format. Please refer to specified format above input field.');
      return false;
    }
    var tofd = document.querySelector('input[name=eprtofday]:checked');
    if(!tofd) {
      alert('Please specify time of day.');
      return false;
    }
    userRef.once("value", function(snap) {
      var snapshot = snap.val();
      var team = snapshot.team;
      var str = "practice/";
      team = str.concat(team);
      team = team.concat("/");
      var tod = document.querySelector('input[name=eprtofday]:checked').value;
      var gTime = document.getElementById('eprgametime').value;
      var date = document.getElementById('eprgamedate').value;
      if(tod == "day") {
        gTime = gTime.concat(" am");
      }
      if(tod == "night") {
        gTime = gTime.concat(" pm");
        tHour = Number(tHour) + 12;
      }
      var timeid = dYear.concat(dMonth);
      timeid = timeid.concat(dDate);
      timeid = timeid.concat(tHour);
      timeid = timeid.concat(tMinute);
      var practList = firebase.database().ref().child(team);
      practList.orderByChild("timeid").once("value", function(snapshot1){
        snapshot1.forEach(function(snap1){
          var currPrac = snap1.val();
          if(currPrac.timeid == oldTimeid){
            snap1.ref.update({
              date: dateInput,
              location: locationInput,
              time: timeInput,
              timeid: timeid,
              tod: tod
            });
          }
        });
        alert('Practice Updated!');
        populatePractice(globalTeam);
        previouspage = "editpracticehtml";        
        clickHome();
      });
    });
  });

  delBtn.addEventListener('click', function() {
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var team = currTeam;
    var str = "practice/";
    team = str.concat(team);
    team = team.concat("/");
    var pracList = firebase.database().ref().child(team);
    pracList.orderByChild("timeid").once("value", function(snap1) {
      snap1.forEach(function(snap2){
        var currPrac = snap2.val();
        if(currPrac.timeid == oldTimeid){
          snap2.ref.remove();
          alert('Practice Removed');
          populatePractice(globalTeam);
          previouspage = "editpracticehtml";          
          clickHome();
        }
      });
    });
  });

/********************************** SCRIPT FOR EDITROSTER **********************************************/

  var ustm;

  function clickEditRoster(){
    show(editrosterdiv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "editrosterhtml"
    });
    currentpage = "editrosterhtml";
    
    var tbl = document.getElementById('outputTable');
    var rootref = firebase.database().ref();
    var currus = rootref.child("currentuser/");
    currus.once("value", function(snapshot){
      var snpsht = snapshot.val();
      var myteamname = snpsht.team;
      ustm = myteamname;
      var str = "players/";
      myteamname = str.concat(myteamname);
      myteamname = myteamname.concat("/");
      var playerslist = rootref.child(myteamname);
      playerslist.orderByChild("jerseynumber").once("value").then(function(snapshot){
        tbl.innerHTML = "";        
        snapshot.forEach(function(snap){
          var p = snap.val();
          var rawBirthdate;
          var temp = p.birthdate.indexOf("/");
          var tempt = p.birthdate.lastIndexOf("/");
          var strr = p.birthdate.slice(0, temp);
          var strrr = p.birthdate.slice(temp + 1, tempt);
          var strrrr = p.birthdate.slice(tempt + 1, p.birthdate.length);
          rawBirthdate = strr + strrr + strrrr;
          var playerid = p.firstname.concat(p.lastname);
          playerid = playerid.concat(rawBirthdate);
          playerid = playerid.concat(p.jerseynumber);
          tbl.innerHTML += "<tr><td>"
          + p.jerseynumber
          + "</td><td>" + p.position
          + "</td><td><a href='#' class='es' id='e" + playerid + "' onclick='clickedPlayer(this.id)'>" + p.name
          + "</a></td><td class='gd' contenteditable='true' id='goal" + playerid + "'>" + p.goals
          + "</td><td class='ad' contenteditable='true' id='assi" + playerid + "'>" + p.assists
          + "</td><td class='fd' contenteditable='true' id='foul" + playerid + "'>" + p.fouls
          + "</td><td class='rd' contenteditable='true' id='redc" + playerid + "'>" + p.redcards
          + "</td><td class='yd' contenteditable='true' id='yell" + playerid + "'>" + p.yellowcards
          + "</td><td class='gpd' contenteditable='true' id='gapl" + playerid + "'>" + p.gamesplayed + "</td></tr>";
        });
      });
    });
  }

  function clickedPlayer(id) {
    globalViewPlayer = id.substr(1,id.length - 1);    
    var rootref = firebase.database().ref();
    var moveplr = rootref.child("inspectplayer/");
    var rootref = firebase.database().ref();
    var currus = rootref.child("currentuser/");
    currus.once("value", function(snapshot){
      var snpsht = snapshot.val();
      moveplr.set({
        team: snpsht.team,
        playerid: id.substr(1, id.length - 1)
      })
    });
    previouspage = "editrosterhtml";    
    clickViewPlayer();    
  }

  var saveEditBtn = document.getElementById('ersavebtn');
  var goBackBtn = document.getElementById('erbackbtn');

  saveEditBtn.addEventListener('click', function() {
    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      return false;
    }
    var rootref = firebase.database().ref();
    var currus = rootref.child("inspectplayer/");
    currus.once("value", function(snapshot){
      var snpsht = snapshot.val();
      var myteamname = snpsht.team;
      ustm = myteamname;
      var str = "players/";
      myteamname = str.concat(myteamname);
      myteamname = myteamname.concat("/");
      var playerslist = rootref.child(myteamname);
      var checker = 0;
      playerslist.orderByChild("jerseynumber").once("value").then(function(snapshot){
        snapshot.forEach(function(snap){
          var cuPl = snap.val();
          var compareid = cuPl.playerid;
          var ugoals = "goal" + compareid;
          var uassists = "assi" + compareid;
          var ufouls = "foul" + compareid;
          var uredcards = "redc" + compareid;
          var uyellowcards = "yell" + compareid;
          var ugamesplayed = "gapl" + compareid;
          ugoals = document.getElementById(ugoals).innerHTML;
          uassists = document.getElementById(uassists).innerHTML;
          ufouls = document.getElementById(ufouls).innerHTML;
          uredcards = document.getElementById(uredcards).innerHTML;
          uyellowcards = document.getElementById(uyellowcards).innerHTML;
          ugamesplayed = document.getElementById(ugamesplayed).innerHTML;
          if(isNaN(ugoals) || isNaN(uassists) || isNaN(ufouls) || isNaN(uredcards) || isNaN(uyellowcards) || isNaN(ugamesplayed)) {
            alert('Invalid stat input. Please ONLY numerical values and do not leave any cells blank.');
            checker = 1;
            return;
          }
          else {
            cuPl = snap.ref;
            cuPl.update({
            goals: Number(ugoals).toString(),
            assists: Number(uassists).toString(),
            fouls: Number(ufouls).toString(),
            redcards: Number(uredcards).toString(),
            yellowcards: Number(uyellowcards).toString(),
            gamesplayed: Number(ugamesplayed).toString()
          });
          }
        });
        if(checker == 0) {
          populatePlayers(globalTeam);
          previouspage = "editrosterhtml";          
          clickRoster();
        }
      });
    });
  });

  goBackBtn.addEventListener('click', function() {
    previouspage = "editrosterhtml";              
    clickRoster();
  });

/********************************** SCRIPT FOR HOME **********************************************/

  var userteam;
  var currTeam;
  var currUser;
  var homemytname = document.getElementById('mytname');

  function clickHome() {
    show(homediv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "homehtml"
    });
    currentpage = "homehtml";
    
    populateOfflineAll();
    var today = new Date();
    var dd = today.getDate().toString();
    var mm = today.getMonth()+1;
    var yy = today.getFullYear().toString();
    yy = yy.slice(2,4);
    if(dd<10) {
      dd = '0' + dd;
    }
    if(mm<10) {
      mm = '0' + mm;
    }
    var todayid = today.getFullYear().toString().substr(2,2) + mm.toString() + dd + today.getHours().toString() + today.getMinutes().toString();
    today = mm.toString() + '/' + dd + '/' + yy;
    var dis = document.getElementById("outPut");
    dis.innerHTML = "";

    if(!navigator.onLine) {
      //offline home for fans
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      if(currUser == 'fan') {
        if(gameForHome != "") {
          dis.innerHTML += "<div class='box0'><h2>Today's Game: " + gameForHome.date
            + "</h2><h3>" + currTeam + " vs " + gameForHome.opponentname + "</h3>"
            + "<h4><mark>" + gameForHome.mygoals + " : " + gameForHome.opponentgoals + "</mark></h4>"
            + "<p>" + gameForHome.date + " " + gameForHome.time
            + "</p><p>" + gameForHome.location
            + "</p><p>" + gameForHome.status
            + "</p><input type='button' value='View Stats' class='viewStatsBtn'id='view" + gameForHome.gameid
            + "'onclick='clickedd(this.id)'></div>";
        }
        if (dis.innerHTML == "") {
          dis.innerHTML = "<div class='box0'><h2>No Games Today</h2></div>";
        }
      }
      else {
        //offline for fans and coaches
        for(var i = 0; i < practiceArr.length; i++) {
          var todayPract = practiceArr[i];
          var tod;
          var editb;
          if(todayPract.tod == "night"){
            tod = " P.M.";
          }
          else {
            tod = " A.M.";
          }
          if(currUser == 'player') {
            editb = "";
          }
          else {
            editb = "<input type='button' value='Edit Practice' id='edit" + todayPract.timeid + "' class='editGameBtn'"
                  + " onclick='clickedd(this.id) disabled'>";
          }
          if(today ==  todayPract.date) {
            dis.innerHTML += "<div class='box0'><h2>Today's Practice: " + today
                          + "</h2><p>" + todayPract.date + " " + todayPract.time + tod
                          + "</p><p>" + todayPract.location + editb + "</div>";
          }
          else if (todayid < todayPract.timeid) {
            dis.innerHTML += "<div class='box0'><h2>Upcoming Practice: " + todayPract.date
                          + "</h2><p>" + todayPract.date + " " + todayPract.time + tod
                          + "</p><p>" + todayPract.location + editb + "</div>";
          }
        }
      }
    }


    document.getElementById('mainnavbar').style.display = "inline";
    var wins = 0;
    var losses = 0;
    var ties = 0;
    var tgs = 0;
    var tgg = 0;

    if(navigator.onLine) {

      var dbref = firebase.database().ref().child("currentuser/");
      dbref.once("value", function(snap){
        var snapval = snap.val();
        currUser = snapval.type;
        currTeam = snapval.team;
        homemytname.innerHTML = currTeam;
        userteam = currTeam;
        var str = "games/";
        var myTeam1 = currTeam;
        myTeam1 = str.concat(myTeam1);
        myTeam1 = myTeam1.concat("/");

        var gamelist = firebase.database().ref().child(myTeam1);
        gamelist.orderByChild("timeid").once("value", function(snapshot) {
          snapshot.forEach(function(snapshot1) {
            var todayGame = snapshot1.val();
            if(todayid > todayGame.timeid ) {
              if(todayGame.mygoals > todayGame.opponentgoals) {
                wins = wins + 1;
              }
              else if (todayGame.mygoals < todayGame.opponentgoals) {
                losses = losses + 1;
              }
              else {
                ties = ties + 1;
              }
              tgs = tgs + Number(todayGame.mygoals);
              tgg = tgg + Number(todayGame.opponentgoals);
            }

            document.getElementById('wins').innerHTML = wins;
            document.getElementById('losses').innerHTML = losses;
            document.getElementById('ties').innerHTML = ties;
            document.getElementById('totalgoalsscored').innerHTML = tgs;
            document.getElementById('totalgoalsgivenup').innerHTML = tgg;

            if(currUser == "fan") {
              if(today == todayGame.date) {
                dis.innerHTML += "<div class='box0'><h2>Today's Game: " + today
                  + "</h2><h3>" + currTeam + " vs " + todayGame.opponentname + "</h3>"
                  + "<h4><mark>" + todayGame.mygoals + " : " + todayGame.opponentgoals + "</mark></h4>"
                  + "<p>" + todayGame.date + " " + todayGame.time
                  + "</p><p>" + todayGame.location
                  + "</p><p>" + todayGame.status
                  + "</p><input type='button' value='View Stats' class='viewStatsBtn'id='view" + todayGame.gameid
                  + "'onclick='clickedd(this.id)'></div>";
              }
            }
          });
          if (dis.innerHTML == "" && currUser == 'fan') {
            dis.innerHTML = "<div class='box0'><h2>No Games Today</h2></div>";
          }
        });

        if(currUser != 'fan') {
          var str = "practice/";
          var myTeam = currTeam;
          myTeam = str.concat(myTeam);
          myTeam = myTeam.concat("/");
          var practList = firebase.database().ref().child(myTeam);
          var editb;

          practList.orderByChild("timeid").once("value", function(snapshot) {
            snapshot.forEach(function(snapshot1) {
              var todayPract = snapshot1.val();
              var tod;
              if(todayPract.tod == "night"){
                tod = " P.M.";
              }
              else {
                tod = " A.M.";
              }
              if(currUser == 'player') {
                editb = "";
              }
              else {
                editb = "<input type='button' value='Edit Practice' id='edit" + todayPract.timeid + "' class='editGameBtn'"
                      + " onclick='clickedd(this.id)'>";
              }
              if(today ==  todayPract.date) {
                dis.innerHTML += "<div class='box0'><h2>Today's Practice: " + today
                              + "</h2><p>" + todayPract.date + " " + todayPract.time + tod
                              + "</p><p>" + todayPract.location + editb + "</div>";
              }
              else if (todayid < todayPract.timeid) {
                dis.innerHTML += "<div class='box0'><h2>Upcoming Practice: " + todayPract.date
                              + "</h2><p>" + todayPract.date + " " + todayPract.time + tod
                              + "</p><p>" + todayPract.location + editb + "</div>";
              }
            });
          });
        }
      });
    }

  }

  function clickedd(id) {
    var rootref = firebase.database().ref();
    var checkid = id.substr(4, id.length);
    var stri = id.substr(0, 4);
    if(stri == "edit") {
      var movegame = rootref.child("practedit");
      movegame.set({
        timeid: checkid
      })
      previouspage = "homehtml";                
      clickEditPractice();
    }
    if(stri == "view") {
      var movegame = rootref.child("inspectgame/");
      movegame.set({
        team: userteam,
        gameid: checkid
      })
      previouspage = "homehtml";                      
      clickViewGameStats();
    }
  }

/********************************** SCRIPT FOR LOGIN **********************************************/

  function clickLogin(){
    document.getElementById('loginemail').value = "";
    document.getElementById('loginpassword').value = "";
    show(logindiv);
    if(!navigator.logindiv){
      return;
    }
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "loginhtml"
    });
    currentpage = "loginhtml";    
  }

  var user = document.getElementById('loginemail');
  var pwd = document.getElementById('loginpassword');
  var liBtn = document.getElementById('loginsubmit');

  liBtn.addEventListener('click', function() {

    if(!navigator.onLine){
      alert('No connection, cannot login. Please check your network connection to proceed.');
      return false;
    }

    var rootref = firebase.database().ref();
    var userslist = rootref.child("users/");

    if(!user.value || !pwd.value) {
      alert('Cannot leave email or password field empty. Please try again.');
      return false;
    }
    else {
      var searchlist = userslist.orderByChild("username").equalTo(user.value);
      searchlist.once("value", function(snapshot){

        snapshot.forEach(function(snap) {
          var cur = snap.val();
          if(cur.username == user.value) {
            if(cur.password == pwd.value) {
              var curuser = rootref.child("currentuser/");
              curuser.set({
                username: cur.username,
                team: cur.team,
                type: cur.type
              });
              previouspage = "loginhtml";                              
              clickHome();
            }
            else {
              alert('Incorrect password. Please try again.');
              return;
            }
          }
          else {
            alert('Incorrect username/email or password. Please try again.');
            return;
          }
        });
        if(!snapshot.val()) {
          alert('Account does not exist! Please sign up to create a new account.');
          return;
        }
      });
    }
  });

  function enterKey(e){
    e = e || window.event;
    if(e.keyCode == 13){
      document.getElementById('loginsubmit').click();
      return false;
    }
    return true;
  }

  // Global Vars stuff
  var globalUser;
  var globalTeam;
  var practiceArr = [];
  var gameForHome = "";
  var gamesArr = [];
  var playersArr = [];
  var firstTime = true;
  var globalViewGame;
  var globalViewPlayer;
  var today = new Date();

  function populateOfflineAll() {
    if(firstTime == true){
      firstTime = false;
    }
    else {
      return;
    }

    var dd = today.getDate().toString();
    var mm = today.getMonth()+1;
    var yy = today.getFullYear().toString();
    yy = yy.slice(2,4);
    if(dd<10) {
      dd = '0' + dd;
    }
    if(mm<10) {
      mm = '0' + mm;
    }
    today = mm.toString() + '/' + dd + '/' + yy;

    var dbref = firebase.database().ref().child('currentuser/');
    dbref.once("value", function(snapshot){
      var team = snapshot.val().team;
      globalTeam = team;
      globalUser = snapshot.val().type;

      populatePractice(team);
      populateGames(team);
      populatePlayers(team);

    });
  }

    function populatePractice(team) {
      //Populate Practices
      practiceArr = [];
      var str = "practice/";
      var pracRef = str.concat(team);
      pracRef = pracRef.concat("/");
      var pracDBRef = firebase.database().ref().child(pracRef);
      pracDBRef.orderByChild("timeid").once("value", function(snap1){
        snap1.forEach(function(snap2) {
          var prac = snap2.val();
          practiceArr.push(prac);
        });
      });
    }

    function populateGames(team) {
      // Populate Today Game and Games
      gamesArr = [];
      var str = "games/";
      var gameRef = str.concat(team);
      gameRef = gameRef.concat("/");
      var gameDBRef = firebase.database().ref().child(gameRef);
      gameDBRef.orderByChild("timeid").once("value", function(snap1){
        snap1.forEach(function(snap2){
          var game = snap2.val();
          gamesArr.push(game);
          if(today == game.date) {
            gameForHome = game;
          }
        });
      });
    }

    function populatePlayers(team) {
      //Populate players
      playersArr = [];
      var str = "players/";
      var playRef = str.concat(team);
      playRef = playRef.concat("/");
      var playDBRef = firebase.database().ref().child(playRef);
      playDBRef.orderByChild("playerid").once("value", function(snap1){
        snap1.forEach(function(snap2){
          var player = snap2.val();
          playersArr.push(player);
        });
      });
    }


/********************************** SCRIPT FOR ROSTER **********************************************/

  function clickRoster(){
    show(rosterdiv);
    var tbl = document.getElementById('outputdata');
    tbl.innerHTML = "";
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "rosterhtml"
    });
    currentpage = "rosterhtml";

    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      if(globalUser == 'coach') {
        document.getElementById('editrosterbtn').disabled = true;
        document.getElementById('addplayerbtn').disabled = true;
      }

      for(var i = 0; i < playersArr.length; i++) {
        var pla = playersArr[i];
        tbl.innerHTML += "<tr><td>" + pla.jerseynumber + "</td><td>" + pla.position + "</td><td><a href='#' class='es' id='v" + pla.playerid + "' onclick='clickedPlayer(this.id)'>"
        + pla.name + "</a></td><td>" + pla.goals + "</td><td>" + pla.assists + "</td><td>"
        + pla.fouls + "</td><td>" + pla.redcards + "</td><td>" + pla.yellowcards +
        "</td><td>" + pla.gamesplayed + "</td></tr>";
      }
    }

    if(navigator.onLine) {      

      var rootref = firebase.database().ref();
      var currus = rootref.child("currentuser/");
      currus.once("value", function(snapshot){
        var snpsht = snapshot.val();
        if(snpsht.type == 'coach') {
          document.getElementById('editrosterbtn').style.display = 'inline';
          document.getElementById('addplayerbtn').style.display = 'inline';
        }
        var myteamname = snpsht.team;
        var str = "players/";
        myteamname = str.concat(myteamname);
        myteamname = myteamname.concat("/");
        var playerslist = rootref.child(myteamname);
        var usType = snpsht.type; 

        playerslist.orderByChild("jerseynumber").once("value", function(snapshot){
          snapshot.forEach(function(snap){
            var p = snap.val();
            if(usType != "coach"){
              tbl.innerHTML += "<tr><td>" + p.jerseynumber + "</td><td>" + p.position + "</td><td><a href='#' class='es' id='v" + p.playerid + "' onclick='clickedPlayer(this.id)'>"
              + p.name + "</a></td><td>" + p.goals + "</td><td>" + p.assists + "</td><td>"
              + p.fouls + "</td><td>" + p.redcards + "</td><td>" + p.yellowcards +
              "</td><td>" + p.gamesplayed + "</td></tr>";
            }
            else if(usType == "coach"){
              tbl.innerHTML += "<tr><td>" + p.jerseynumber + "</td><td>" + p.position + "</td><td>"
              + p.name + "</td><td>" + p.goals + "</td><td>" + p.assists + "</td><td>"
              + p.fouls + "</td><td>" + p.redcards + "</td><td>" + p.yellowcards +
              "</td><td>" + p.gamesplayed + "</td></tr>";
            }
          });
        });
      });
    }
  }

/********************************** SCRIPT FOR SCHEDULE **********************************************/

  var userteam;

  function clickSchedule(){
    show(schedulediv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "schedulehtml"
    });
    currentpage = "schedulehtml";

    var styleStr;
    var today = new Date();
    var curMonth = today.getMonth() + 1;
    curMonth = curMonth.toString();
    var curDay = today.getDate().toString();
    if( curDay.length == 1) {
      curDay = "0" + curDay;
    }
    var curYear = today.getFullYear().toString().substr(2,2);
    var curHour = today.getHours().toString();
    var curMinute = today.getMinutes().toString();
    var todayDate = curYear + curMonth + curDay + curHour + curMinute;
    var disGam = document.getElementById('outputgames');
    disGam.innerHTML = "";

    if(!navigator.onLine) {
      if(globalUser == 'coach') {
        styleStr = "";
        document.getElementById('addGameBtn').style.display = 'inline';
        document.getElementById('addGameBtn').disabled = true;
        document.getElementById('addPracBtn').style.display = 'inline';
        document.getElementById('addPracBtn').disabled = true;
        alert('There is no connection. Please reconnect and try again. All edit/add buttons are now disabled until connection is restored.');
      }
      else {
        styleStr = "style='display:none'";
        alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      }

      for(var i = 0; i < gamesArr.length; i++) {
        var curgam = gamesArr[i];
        var compareDate = curgam.timeid;

        if(todayDate.substr(0,6) == compareDate.substr(0,6)) {
          disGam.innerHTML += "<div class='box0'><h2>Today's Game: " + curgam.date
          + "</h2><h3>" + globalTeam + " vs " + curgam.opponentname + "</h3>"
          + "<h4><mark>" + curgam.mygoals + " : " + curgam.opponentgoals + "</mark></h4>"
          + "<p>" + curgam.date + " " + curgam.time
          + "</p><p>" + curgam.location
          + "</p><p>" + curgam.status
          + "</p><input type='button' value='View Stats' class='viewStatsBtn' id='view" + curgam.gameid + "'onclick='clicked(this.id)'>"
          + "<input type='button' value='Edit Game' id='edit" + curgam.gameid + "' class='editGameBtn'"
          + styleStr + " onclick='clicked(this.id)' disabled></div>";
        }
        else if(todayDate > compareDate) {
          disGam.innerHTML += "<div class='box0'><h2>Previous Game: " + curgam.date
          + "</h2><h3>" + globalTeam + " vs " + curgam.opponentname + "</h3>"
          + "<h4><mark>" + curgam.mygoals + " : " + curgam.opponentgoals + "</mark></h4>"
          + "<p>" + curgam.date + " " + curgam.time
          + "</p><p>" + curgam.location
          + "</p><p>" + curgam.status
          + "</p><input type='button' value='View Stats' id='view" + curgam.gameid + "' class='viewStatsBtn' onclick='clicked(this.id)'></div>";
        }
        else if(todayDate < compareDate) {
          disGam.innerHTML += "<div class='box0'><h2>Upcoming Game: " + curgam.date
          + "</h2><h3>" + globalTeam + " vs " + curgam.opponentname
          + "</h3><p>" + curgam.date + " " + curgam.time
          + "</p><p>" + curgam.location
          + "</p><p>" + curgam.status
          + "<input type='button' value='Edit Game' id='edit" + curgam.gameid + "' class='editGameBtn'"
          + styleStr + " onclick='clicked(this.id)' disabled></div>";
        }
      }
      if (disGam.value == "") {
        disGam.innerHTML = "<div class='box0'><h2>No Games to Show</h2></div>";
      }
    }

    if(navigator.onLine) {

      var rootref = firebase.database().ref();
      var currus = rootref.child("currentuser/");
      var currga = rootref.child("inspectgame/");
      currga.once("value", function(snapshot){
        snapshot.ref.remove();
      });

      currus.once("value", function(snapshot){
        var snpsht = snapshot.val();
        var myteamname = snpsht.team;
        userteam = myteamname;
        var str = "games/";
        myteamname = str.concat(myteamname);
        myteamname = myteamname.concat("/");
        var gameslist = rootref.child(myteamname);
        var usertype = snpsht.type;
        if(usertype == 'coach') {
          styleStr = "";
          document.getElementById('addGameBtn').style.display = 'inline';
          document.getElementById('addPracBtn').style.display = 'inline';
        }
        else {
          styleStr = "style='display:none'";
        }

        gameslist.orderByChild("timeid").once("value", function(snapshot){
          snapshot.forEach(function(snap){
            var cg = snap.val();
            var compareDate = cg.timeid;
            if(todayDate.substr(0,6) == compareDate.substr(0,6)) {
              disGam.innerHTML += "<div class='box0'><h2>Today's Game: " + cg.date
              + "</h2><h3>" + snpsht.team + " vs " + cg.opponentname + "</h3>"
              + "<h4><mark>" + cg.mygoals + " : " + cg.opponentgoals + "</mark></h4>"
              + "<p>" + cg.date + " " + cg.time
              + "</p><p>" + cg.location
              + "</p><p>" + cg.status
              + "</p><input type='button' value='View Stats' class='viewStatsBtn' id='view" + cg.gameid + "'onclick='clicked(this.id)'>"
              + "<input type='button' value='Edit Game' id='edit" + cg.gameid + "' class='editGameBtn'"
              + styleStr + " onclick='clicked(this.id)'></div>";
            }
            else if(todayDate > compareDate) {
              disGam.innerHTML += "<div class='box0'><h2>Previous Game: " + cg.date
              + "</h2><h3>" + snpsht.team + " vs " + cg.opponentname + "</h3>"
              + "<h4><mark>" + cg.mygoals + " : " + cg.opponentgoals + "</mark></h4>"
              + "<p>" + cg.date + " " + cg.time
              + "</p><p>" + cg.location
              + "</p><p>" + cg.status
              + "</p><input type='button' value='View Stats' id='view" + cg.gameid + "' class='viewStatsBtn' onclick='clicked(this.id)'></div>";
            }
            else if(todayDate < compareDate) {
              disGam.innerHTML += "<div class='box0'><h2>Upcoming Game: " + cg.date
              + "</h2><h3>" + snpsht.team + " vs " + cg.opponentname
              + "</h3><p>" + cg.date + " " + cg.time
              + "</p><p>" + cg.location
              + "</p><p>" + cg.status
              + "<input type='button' value='Edit Game' id='edit" + cg.gameid + "' class='editGameBtn'"
              + styleStr + " onclick='clicked(this.id)'></div>";
            }
          });
          if (disGam.value == "") {
            disGam.innerHTML = "<div class='box0'><h2>No Games to Show</h2></div>";
          }
        });
      });

    }

  }

  function clicked(id) {
    var rootref = firebase.database().ref();
    var gameid = id.substr(4, id.length);
    var movegame = rootref.child("inspectgame/");
    movegame.set({
      team: userteam,
      gameid: gameid
    });
    var stri = id.substr(0, 4);
    if(stri == "edit") {
      previouspage = "schedulehtml";
      clickEditGame();
    }
    if(stri == "view") {
      globalViewGame = gameid;
      previouspage = "schedulehtml";
      clickViewGameStats();
    }
  };

/********************************** SCRIPT FOR SIGNUP **********************************************/
  var userid = document.getElementById('signupemail');
  var fn = document.getElementById('signupfname');
  var ln = document.getElementById('signuplname');
  var pw = document.getElementById('signuppwd');
  var cpw = document.getElementById('signupconfpwd');
  var coachfield = document.getElementById('newteamfield');
  var playerfield = document.getElementById('playerfield');
  var fanfield = document.getElementById('fanfield');
  var bdayfield = document.getElementById('bdayfield');
  var jerseynumber = document.getElementById('sujerseynumber');


  function clickSignUp(){
    show(signupdiv);

    if(!navigator.onLine){
      alert('There is no connection. Please reconnect and try again.');
      previouspage = "loginhtml";
      clickLogin();
    }

    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "signuphtml"
    });
    currentpage = "signuphtml";

    fn.value = "";
    ln.value = "";
    pw.value = "";
    cpw.value = "";
    coachfield.value = "";
    userid.value = "";
    playerfield.selectedIndex = 0;
    jerseynumber.value = "";
    bdayfield.value = "";
  }

  document.getElementById('signupBackBtn').addEventListener('click', function(){
    previouspage = "signuphtml";
    clickLogin();
  });

  document.getElementById('signupBtn').addEventListener("click", function() {

    var usertype = document.querySelector('input[name=utype]:checked');
    var selectedteam;

    if (userid.value.length == 0 || fn.value.length == 0 || ln.value.length == 0
          || pw.value.length == 0 || cpw.value.length == 0) {
      alert('Sign Up form is not complete. Please fill everything out to proceed.');
      return false;
    }

    else if(usertype.value == "player" && (isNaN(jerseynumber.value) || jerseynumber.value.length == 0)) {
      alert('Jersey number must be a NUMBER.');
      return false;
    }

    else if(userid.value.indexOf("@") == 0 || userid.value.indexOf("@") + 1 == userid.value.lastIndexOf(".")) {
      alert('Invalid email. Please use a valid email.');
      return false;
    }

    else if(userid.value.lastIndexOf(".") == (-1) || userid.value.indexOf("@") == (-1)) {
      alert('Invalid email form. Please put valid email address.');
      return false;
    }

    else if(!usertype) {
      alert('Please specify type of user.');
      return false;
    }

    else if ( pw.value != cpw.value ) {
      alert('Passwords do not match. Please try again.');
      return false;
    }

    else if( usertype.value == "coach" && !coachfield.value) {
      alert('Please specify the name of the team you wish to create.');
      return false;
    }

    else if( usertype.value == "player" && playerfield.options[playerfield.selectedIndex].value == "default") {
      alert('Please specify your team.');
      return false;
    }

    else if( usertype.value == "fan" && fanfield.options[fanfield.selectedIndex].value == "default") {
      alert('Please specify the team you want to follow. If there are no teams to choose from, please contact your local coach to check if team has been created.');
      return false;
    }

    else if( usertype.value == "player" && !bdayfield.value) {
      alert('Please specify your birthdate to confirm with coach and the team roster.');
      return false;
    }

    else if( usertype.value == "player" && (bdayfield.value.indexOf("/") == (-1) || bdayfield.value.lastIndexOf("/") == (-1))){
      alert('Incorrect birthdate format. Please put birthdate in mm/dd/yy format.');
      return false;
    }

    else if( usertype.value == "player" && (bdayfield.value.indexOf("/") == bdayfield.value.lastIndexOf("/"))) {
      alert('Incorrect birthdate format. Please put birthdate in mm/dd/yy format.');
      return false;
    }

    else if( usertype.value == "player" &&
    (isNaN(bdayfield.value.slice(0, bdayfield.value.indexOf("/")))
    || isNaN(bdayfield.value.slice(bdayfield.value.indexOf("/") + 1, bdayfield.value.lastIndexOf("/")))
    || isNaN(bdayfield.value.slice(bdayfield.value.lastIndexOf("/") + 1, bdayfield.value.length)) ||
    ((bdayfield.value.slice(0, bdayfield.value.indexOf("/")).length != 2)
    || (bdayfield.value.slice(bdayfield.value.indexOf("/") + 1, bdayfield.value.lastIndexOf("/").length != 2)
    || (bdayfield.value.slice(bdayfield.value.lastIndexOf("/") + 1, bdayfield.value.length).length != 2))))){
      alert('Incorrect birthdate format. Values must be numbers and/or must be in the format mm/dd/yy!');
      return false;
    }

    else {
      var rootref = firebase.database().ref();
      var userslist = rootref.child('users/');
      var teamslist = rootref.child('teams/');

      userslist.orderByChild("username").equalTo(userid.value).once('value', snapshot => {
        const usernm = snapshot.val();
        if(usernm) {
          alert('Username already exists. Please use another username/email.');
          return;
        }
        else {
          if(usertype.value == "coach"){
            teamslist.orderByChild("name").equalTo(coachfield.value).once('value', snapshot => {
              const teamnm = snapshot.val();
              if(teamnm) {
                alert('Team already exists. Please use another team name.');
                return;
              }
              else {
                var newteam = teamslist.push();
                newteam.set({
                  name: coachfield.value,
                });
                var newuser = userslist.push();
                newuser.set({
                  username: userid.value,
                  password: pw.value,
                  team: coachfield.value,
                  type: usertype.value
                });
                alert('Created account. Please proceed to login.');
                previouspage = "signuphtml";                
                clickLogin();
              }
            });
          }

          else if(usertype.value == "player") {
            var findroster = playerfield.options[playerfield.selectedIndex].value;
            var samStr = "players/";
            samStr = samStr.concat(findroster);
            samStr = samStr.concat("/");
            var rosterlist = rootref.child(samStr);

            var birthdate = bdayfield.value;
            var firstdash = birthdate.indexOf("/");
            var seconddash = birthdate.lastIndexOf("/");
            var bMonth = birthdate.slice(0, firstdash);
            var bDay = birthdate.slice(firstdash + 1, seconddash);
            var bYear = birthdate.slice(seconddash + 1, birthdate.length);
            var rawBirthdate = bMonth + bDay + bYear;
            var firstname = fn.value;
            var lastname = ln.value;
            var jsn = Number(jerseynumber.value).toString();

            var playerid = firstname.concat(lastname);
            playerid = playerid.concat(rawBirthdate);
            playerid = playerid.concat(jsn);

            rosterlist.orderByChild("playerid").equalTo(playerid).once("value", snapshot => {
              const plnm = snapshot.val();
              if(plnm){
                var newuser = userslist.push();
                newuser.set({
                  username: userid.value,
                  password: pw.value,
                  team: findroster,
                  type: usertype.value
                });
                alert('Created account. Please proceed to login.');
                previouspage = "signuphtml";                
                clickLogin();
              }
              else{
                alert('User does not exist in the roster of specified team. Contact the coach to verify birthdate, your jersey number on the roster, and overall inclusion in team roster.');
                return;
              }
            });
          }

          else if(usertype.value == "fan") {
            alert('Adding user');
            var newuser = userslist.push();
            newuser.set({
              username: userid.value,
              password: pw.value,
              team: fanfield.options[fanfield.selectedIndex].value,
              type: usertype.value
            });
            alert('Created account. Please proceed to login.');
            previouspage = "signuphtml";            
            clickLogin();
          }
        }
      });
    }
  });

  var ifcoach = document.getElementById('coachoptions');
  var ifplayer = document.getElementById('playeroptions');
  var iffan = document.getElementById('fanoptions');

  function coachFunc() {
    ifplayer.style.display = "none";
    iffan.style.display = "none";
    ifcoach.style.display = "inline";
  }

  function playerFunc() {
    var playeroutput = document.getElementById('playerfield');
    ifplayer.style.display = "inline";
    iffan.style.display = "none";
    ifcoach.style.display = "none";
    playeroutput.innerHTML = "<option value='default'>Choose your team</option>";
    var rref = firebase.database().ref();
    var tlist = rref.child('teams/');
    tlist.on('value', function(snapshot){
      snapshot.forEach(function(chNo) {
        var noode = chNo.val();
        playeroutput.innerHTML += "<option value='" + noode.name + "'>" + noode.name + "</option>";
      });
    });
  }

  function fanFunc() {
    var fanoutput = document.getElementById('fanfield');
    ifplayer.style.display = "none";
    iffan.style.display = "inline";
    ifcoach.style.display = "none";
    fanoutput.innerHTML = "<option value='default'>Choose a team to follow.</option>";
    var rr = firebase.database().ref();
    var tl = rr.child("teams/");
    tl.on('value', function(snapshot){
      snapshot.forEach(function(chn){
        var ndoe = chn.val();
        fanoutput.innerHTML += "<option value='" + ndoe.name + "'>" + ndoe.name + "</option>";
      });
    });
  }

/********************************** SCRIPT FOR VIEWGAMESTATS **********************************************/

  function clickViewGameStats(){
    show(viewgamestatsdiv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "viewgamestatshtml"
    });
    currentpage = "viewgamestatshtml";
    var myte = document.getElementById('mytea');
    var oppt = document.getElementById('oppte');
    var my = document.getElementById('myteam');
    var their = document.getElementById('oppteam');
    var ms = document.getElementById('myscore');
    var ts = document.getElementById('theirscore');
    var mg = document.getElementById('mygoals');
    var tg = document.getElementById('theirgoals');
    var mf = document.getElementById('myfouls');
    var tf = document.getElementById('theirfouls');
    var mrc = document.getElementById('myredcards');
    var trc = document.getElementById('theirredcards');
    var myc = document.getElementById('myyellowcards');
    var tyc = document.getElementById('theiryellowcards');
    var msog = document.getElementById('myshotsongoal');
    var tsog = document.getElementById('theirshotsongoal');
    var mck = document.getElementById('mycornerkicks');
    var tck = document.getElementById('theircornerkicks');
    var mgk = document.getElementById('mygoalkicks');
    var tgk = document.getElementById('theirgoalkicks');

    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');

      for (var i = 0; i < gamesArr.length; i++) {
        var game = gamesArr[i];
        if(globalViewGame == game.gameid) {
          myte.innerHTML = globalTeam,
          oppt.innerHTML = game.opponentname,
          my.innerHTML = globalTeam,
          their.innerHTML = game.opponentname,
          ms.innerHTML = game.mygoals;
          ts.innerHTML = game.opponentgoals;
          mg.innerHTML = game.mygoals;
          tg.innerHTML = game.opponentgoals;
          mf.innerHTML = game.myfouls;
          tf.innerHTML = game.opponentfouls;
          mrc.innerHTML = game.myredcards;
          trc.innerHTML = game.opponentredcards;
          myc.innerHTML = game.myyellowcards;
          tyc.innerHTML = game.opponentyellowcards;
          msog.innerHTML = game.myshotsongoal;
          tsog.innerHTML = game.opponentshotsongoal;
          mck.innerHTML = game.mycornerkicks;
          tck.innerHTML = game.opponentcornerkicks;
          mgk.innerHTML = game.mygoalkicks;
          tgk.innerHTML = game.opponentgoalkicks;
        }
      }
      if(globalUser == "coach") {
        document.getElementById('editgamestatsBtn').disabled = true;
      }
    }

    if(navigator.onLine) {
      var rootref = firebase.database().ref();
      var viewgame = rootref.child("inspectgame/");
      viewgame.once("value", function(snapshot) {
        var gametoview = snapshot.val();
        var gid = gametoview.gameid;
        var tmm = gametoview.team;
        var sring = "games/";
        tmm = sring.concat(tmm);
        tmm = tmm.concat("/");
        var gameslist = rootref.child(tmm);
        gameslist.orderByChild("gameid").once("value",function(snap){
          snap.forEach(function(snapshot){
            var stats = snapshot.val();
            if(stats.gameid == gid) {
              myte.innerHTML = gametoview.team,
              oppt.innerHTML = stats.opponentname,
              my.innerHTML = gametoview.team,
              their.innerHTML = stats.opponentname,
              ms.innerHTML = stats.mygoals;
              ts.innerHTML = stats.opponentgoals;
              mg.innerHTML = stats.mygoals;
              tg.innerHTML = stats.opponentgoals;
              mf.innerHTML = stats.myfouls;
              tf.innerHTML = stats.opponentfouls;
              mrc.innerHTML = stats.myredcards;
              trc.innerHTML = stats.opponentredcards;
              myc.innerHTML = stats.myyellowcards;
              tyc.innerHTML = stats.opponentyellowcards;
              msog.innerHTML = stats.myshotsongoal;
              tsog.innerHTML = stats.opponentshotsongoal;
              mck.innerHTML = stats.mycornerkicks;
              tck.innerHTML = stats.opponentcornerkicks;
              mgk.innerHTML = stats.mygoalkicks;
              tgk.innerHTML = stats.opponentgoalkicks;
            }
          });
        });
      });
      var curuser = rootref.child("currentuser/");
      curuser.once("value", function(snapshot){
        var username = snapshot.val().type;
        if(username == "coach") {
          document.getElementById('editgamestatsBtn').style.display = 'inline';
        }
      });
    }
  }

  var edBtn = document.getElementById('editgamestatsBtn');
  edBtn.addEventListener('click', function() {
    previouspage = "viewgamestatshtml";
    clickEditGameStats();
  });

/********************************** SCRIPT FOR VIEWPLAYER **********************************************/

  var bBtn = document.getElementById('vpbackbtn');
  var eBtn = document.getElementById('vpeditbtn');
  var fnm = document.getElementById('ddfn');
  var lnm = document.getElementById('ddln');
  var email = document.getElementById('ddem');
  var nme = document.getElementById('ddpn');
  var pos = document.getElementById('ddp');
  var jer = document.getElementById('ddj');
  var dob = document.getElementById('ddd');
  var goa = document.getElementById('ddg');
  var ast = document.getElementById('dda');
  var gpd = document.getElementById('ddgp');
  var fl = document.getElementById('ddf');
  var rcd = document.getElementById('ddr');
  var ycd = document.getElementById('ddy');

  function clickViewPlayer(){
  
    show(viewplayerdiv);
    var rootref = firebase.database().ref();
    var here = rootref.child('currentuser/');
    here.update({
      page: "viewplayerhtml"
    });
    currentpage = "viewplayerhtml";

    if(!navigator.onLine) {
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      previouspage = "rosterhtml";
      if(globalUser == 'coach') {
        document.getElementById('vpeditbtn').disabled = true;
      }
      for(var i = 0; i < playersArr.length; i++) {
        var curpla = playersArr[i];
        if(globalViewPlayer == curpla.playerid){
          fnm.innerHTML = curpla.firstname;
          lnm.innerHTML = curpla.lastname;
          email.innerHTML = curpla.email;
          nme.innerHTML = curpla.name;
          pos.innerHTML = curpla.position;
          jer.innerHTML = curpla.jerseynumber;
          dob.innerHTML = curpla.birthdate;
          goa.innerHTML = curpla.goals;
          ast.innerHTML = curpla.assists;
          gpd.innerHTML = curpla.gamesplayed;
          fl.innerHTML = curpla.fouls;
          rcd.innerHTML = curpla.redcards;
          ycd.innerHTML = curpla.yellowcards;
        }
      }
    }


    if(navigator.onLine) {

      var rootref = firebase.database().ref();
      var currus = rootref.child("currentuser/");
      currus.once("value", function(snapshot){
        var snpsht = snapshot.val();
        if(snpsht.type == 'coach') {
          document.getElementById('vpeditbtn').style.display = 'inline';
        }
      });
      var viewplayer = rootref.child("inspectplayer/");
      viewplayer.once("value", function(snapshot){
        var player = snapshot.val();
        var stg = "players/";
        stg = stg.concat(player.team);
        stg = stg.concat("/");
        var playerslist = rootref.child(stg);
        playerslist.orderByChild("playerid").once("value", function(snapshot){
          snapshot.forEach(function(snap){
            var pla = snap.val();
            if(pla.playerid == player.playerid) {
              fnm.innerHTML = pla.firstname;
              lnm.innerHTML = pla.lastname;
              email.innerHTML = pla.email;
              nme.innerHTML = pla.name;
              pos.innerHTML = pla.position;
              jer.innerHTML = pla.jerseynumber;
              dob.innerHTML = pla.birthdate;
              goa.innerHTML = pla.goals;
              ast.innerHTML = pla.assists;
              gpd.innerHTML = pla.gamesplayed;
              fl.innerHTML = pla.fouls;
              rcd.innerHTML = pla.redcards;
              ycd.innerHTML = pla.yellowcards;
            }
          });
        });
      });
    }
  }

  bBtn.addEventListener('click', function() {
    var currus = rootref.child("currentuser/");
    currus.once("value", function(snapshot){
      var snpsht = snapshot.val();
      if(snpsht.type == 'coach') {
        previouspage = "viewplayerhtml";
        clickEditRoster();
      }
      else {
        previouspage = "viewplayerhtml";        
        clickRoster();
      }
    });
  });

  eBtn.addEventListener('click', function() {
    previouspage = "viewplayerhtml";    
    clickEditPlayer();
  });
/********************************** SCRIPT FOR LOGOUT **********************************************/

  function logoutClean() {
    document.getElementById('mainnavbar').style.display = "none";
    if(navigator.onLine){
      var rrf = firebase.database().ref();
      var cu = rrf.child("currentuser/");
      cu.set({
        username: "",
        team: "",
        type: "",
        page: ""
      });
    }
    else{ 
      currentpage = "loginhtml"; 
      previouspage = "loginhtml";
    }
  }

/********************************** SCRIPT FOR GO **********************************************/

  function go(cur, to) {
    cur.style.display = "none";
    to.style.display = "inline";
  }

/********************************** SCRIPT FOR SHOW **********************************************/

  function show(d) {
    if(d != addgamediv) {
      addgamediv.style.display = "none";
    }
    if(d != addplayerdiv) {
      addplayerdiv.style.display = "none";
    }
    if(d != addpracticediv) {
      addpracticediv.style.display = "none";
    }
    if(d != editgamediv) {
      editgamediv.style.display = "none";
    }
    if(d != editgamestatsdiv) {
      editgamestatsdiv.style.display = "none";
    }
    if(d != editplayerdiv) {
      editplayerdiv.style.display = "none";
    }
    if(d != editrosterdiv) {
      editrosterdiv.style.display = "none";
    }
    if(d != editpracticediv) {
      editpracticediv.style.display = "none";
    }
    if(d != schedulediv) {
      schedulediv.style.display = "none";
    }
    if(d != homediv) {
      homediv.style.display = "none";
    }
    if(d != logindiv) {
      logindiv.style.display = "none";
    }
    if(d != rosterdiv) {
      rosterdiv.style.display = "none";
    }
    if(d != signupdiv) {
      signupdiv.style.display = "none";
    }
    if(d != viewgamestatsdiv) {
      viewgamestatsdiv.style.display = "none";
    }
    if(d != viewplayerdiv) {
      viewplayerdiv.style.display = "none";
    }
    d.style.display = "inline";
  }


/********************************** SCRIPT FOR back button **********************************************/

document.addEventListener("backbutton", function(){
  var currentvalue = previouspage; 
  if(currentvalue == "addgamehtml"){
    clickAddGame();
  }
  if(currentvalue == "addplayerhtml"){
    clickAddPlayer();
  }
  if(currentvalue == "addpracticehtml"){
    clickAddPractice();
  }
  if(currentvalue == "editgamehtml"){
    clickEditGame();
  }
  if(currentvalue == "editgamestatshtml"){
    clickEditGameStats();
  }
  if(currentvalue == "editplayerhtml"){
    clickEditPlayer();
  }
  if(currentvalue == "editrosterhtml"){
    clickEditRoster();
  }
  if(currentvalue == "editpracticehtml"){
    clickEditPractice();
  }
  if(currentvalue == "schedulehtml"){
    clickSchedule();
  }
  if(currentvalue == "homehtml"){
    clickHome();
  }
  if(currentvalue == "loginhtml"){
    clickLogin();
  }
  if(currentvalue == "rosterhtml"){
    clickRoster();
  }
  if(currentvalue == "viewgamestatshtml"){
    clickViewGameStats();
  }
  if(currentvalue == "viewplayerhtml"){
    clickViewPlayer();
  }
});

/********************************** SCRIPT FOR DEF **********************************************/

  function def() {

    if(!navigator.onLine){
      alert('There is no connection. Please reconnect. All editing/adding functionalities are now disabled until connection is restored.');
      var currentvalue = currentpage;
      if(!currentvalue || currentvalue == "") {
        navdiv.style.display = "none";
        logindiv.style.display = "inline";
      }
      else if(currentvalue == "signuphtml"){
        document.getElementById(currentvalue).style.display = "inline";
        clickSignUp();
      }
      else {
        document.getElementById(currentvalue).style.display = "inline";
        navdiv.style.display = "inline";

        if(currentvalue == "addgamehtml"){
          clickAddGame();
        }
        if(currentvalue == "addplayerhtml"){
          clickAddPlayer();
        }
        if(currentvalue == "addpracticehtml"){
          clickAddPractice();
        }
        if(currentvalue == "editgamehtml"){
          clickEditGame();
        }
        if(currentvalue == "editgamestatshtml"){
          clickEditGameStats();
        }
        if(currentvalue == "editplayerhtml"){
          clickEditPlayer();
        }
        if(currentvalue == "editrosterhtml"){
          clickEditRoster();
        }
        if(currentvalue == "editpracticehtml"){
          clickEditPractice();
        }
        if(currentvalue == "schedulehtml"){
          clickSchedule();
        }
        if(currentvalue == "homehtml"){
          clickHome();
        }
        if(currentvalue == "loginhtml"){
          clickLogin();
        }
        if(currentvalue == "rosterhtml"){
          clickRoster();
        }
        if(currentvalue == "viewgamestatshtml"){
          clickViewGameStats();
        }
        if(currentvalue == "viewplayerhtml"){
          clickViewPlayer();
        }
      }
    }

    if(navigator.onLine){
      var rootref = firebase.database().ref();
      var here = rootref.child('currentuser/');
      here.once("value", function(snapshot){
        var currentvalue = snapshot.val().page;
        if(!currentvalue || currentvalue == "") {
          navdiv.style.display = "none";
          logindiv.style.display = "inline";
        }
        else if(currentvalue == "signuphtml"){
          document.getElementById(currentvalue).style.display = "inline";
          clickSignUp();
        }
        else {
          document.getElementById(currentvalue).style.display = "inline";
          navdiv.style.display = "inline";

          if(currentvalue == "addgamehtml"){
            clickAddGame();
          }
          if(currentvalue == "addplayerhtml"){
            clickAddPlayer();
          }
          if(currentvalue == "addpracticehtml"){
            clickAddPractice();
          }
          if(currentvalue == "editgamehtml"){
            clickEditGame();
          }
          if(currentvalue == "editgamestatshtml"){
            clickEditGameStats();
          }
          if(currentvalue == "editplayerhtml"){
            clickEditPlayer();
          }
          if(currentvalue == "editrosterhtml"){
            clickEditRoster();
          }
          if(currentvalue == "editpracticehtml"){
            clickEditPractice();
          }
          if(currentvalue == "schedulehtml"){
            clickSchedule();
          }
          if(currentvalue == "homehtml"){
            clickHome();
          }
          if(currentvalue == "loginhtml"){
            clickLogin();
          }
          if(currentvalue == "rosterhtml"){
            clickRoster();
          }
          if(currentvalue == "viewgamestatshtml"){
            clickViewGameStats();
          }
          if(currentvalue == "viewplayerhtml"){
            clickViewPlayer();
          }
        }
      });
    }
  }

  window.onbeforeunload = function() {
    currentpage = "homehtml";
  }