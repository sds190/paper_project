var elem = document.documentElement;

function openFullscreen(){
  if(elem.requestFullscreen){
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen){
    elem.webkitRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
  elem.mozRequestFullScreen();
  }
}

var row = 0;
var envelope_number = document.getElementById("envelope_number");
var id_input = document.getElementById("id_input");
var eval = document.getElementById("eval");
var finished_num = 0;
const sheet_name = 'eval';
const last_sheet_name ="last"
const header = document.getElementById("header");
const top_page = document.getElementById("top_page");
const guide = document.getElementById("guide");
const all_eval = document.getElementById("all_eval");
const next = document.getElementById("next");
const save = document.getElementById("save");
const rest = document.getElementById("rest");
const cont = document.getElementById("continue");
const last_eval = document.getElementById("last_eval");
const thank = document.getElementById("thank");
var i = 1;

var ss_id = document.getElementById("ss_id");
ss_id.addEventListener("keydown", function(event){
  if(event.keyCode === 13){
    event.preventDefault();
    check_id();
  }
})

var color5r = document.getElementById("color5r");
color5r.addEventListener("keydown", function(event){
  if(event.keyCode === 13){
    event.preventDefault();
    check3();
  }
})

  function check_id(){
    var ss_id = document.getElementById("ss_id").value;
    if (ss_id == ""){
      alert("IDを入力してください");
    } else {
      check_in();
    }
  }

  function check_in() {
    var id = document.getElementById("ss_id");
    var spreadsheetId = id.value;
      gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId ,
          range: sheet_name // KALAU CUMA NAMA SHEET, DIA AMBIL SEMUA DATA
      }).then((response) => {
          var result = response.result;
          var numRows = result.values ? result.values.length : 0;
          console.log(`${numRows} rows retrieved.`);
          // DATA ARRAY NYA ADA DI result.values MISAL MAU DIBACA
          i = numRows //real need change to i
          top_page.style.display = "none";
          if(i<31){
            guide.style.display = "block";
          } else {
            ans_last_eval();
          }}, function (error) {
                alert("正しいIDを入力してください");
                reloadPage();
              });
        }

function reloadPage(){
  location.reload(true);
}

function start() {
  header.style.display = 'none';
  guide.style.display = 'none';
  if (i<31){
    alert("パンフレットの内容ではなく折り方によって得られるUXを直観的に入力してください")
    envelope_number.innerHTML = i;
    top_page.style.display ='none';
    rest.style.display="none";
    alert("実験始まります");
    openFullscreen();
    setTimeout(function(){
      all_eval.style.display = 'block';
    },500)} else{
      ans_last_eval();
    }
  }

  function resume(){
    if (i<31){
      guide.style.display = "block";
      cont.onclick = next_envelope()
    } else {
      ans_last_eval();
    }
  }

function focus_next_slider(e){
  var x = document.activeElement.id;
  var index = parseInt(x.slice(-2));
  const sliders = document.querySelectorAll('.slider');
  try{
    if (e.keyCode === 13){
      if(index<28){
        sliders[index].focus();
      } else if (index == 28){
        check();
      }}
    } catch(error){}
}

function focus_next_color(e){
  var x = document.activeElement.id;
  var index = parseInt(x.charAt(x.length-2));
  const next_index = index+1
  const next_id = 'color'+next_index
  const next_color_name = document.getElementById(next_id);
  try{
    if (e.keyCode === 13){
        event.preventDefault();
        next_color_name.focus();
      }
    } catch(error){}
}

function focus_reason(e){
  var x = document.activeElement.id;
  var index = parseInt(x.charAt(x.length-1));
  const next_id = 'color'+index+'r';
  const reason = document.getElementById(next_id);
  try{
    if (e.keyCode === 13){
        event.preventDefault();
        reason.focus();
      }
    } catch(error){}
}


  function check(){
      var output = document.getElementsByTagName("output");
      var y=0;
      for (x = 0; x<output.length; x++){
        if (output[x].value==''){
          y++;
        }}
      if (y==0){
        save_file();
        i++;
        next_envelope();
      }  else {
          alert(y+'個の答えていない項目があります');
        }
    }

  function check2(){
        var output = document.getElementsByTagName("output");
        var y=0;
        for (x = 0; x<output.length; x++){
          if (output[x].value==''){
            y++;
          }}
        if (y==0){
          save_file();
          i++;
          hide_screen();
          rest.style.display="inline-block";
        }  else {
            alert(y+'個の答えていない項目があります');
          }
      }

  function next_envelope() {
      rest.style.display = "none";
      eval.style.display = "none";
      if (i<31){
        setTimeout(function(){
          document.body.scrollTop = 0;
          envelope_number.innerHTML = i;
          eval.reset();
          eval.style.display = "flex";
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
          openFullscreen();
        },500)
      } else {
        ans_last_eval();
      }
    }

  function save_file() {
      var output = document.getElementsByTagName("output");
      var data_array = [i];
      for (x = 0; x<output.length; x++){
          data_array.push(output[x].value)
        }
      var body = {
            values: [
                data_array
            ]
        };
        // INI BUAT NAMBAHIN DATA KE SHEET NYA
      var id = document.getElementById("ss_id");
      var spreadsheetId = id.value;
      gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: spreadsheetId,
          range: sheet_name, // INI NAMA SHEET YG BIASA DI BAWAH (DEFAULTNYA Sheet1)
          valueInputOption: 'RAW', // INI IKUTIN AJA
          resource: body
      }).then((response) => {
          var result = response.result;
          console.log(`${result.updates.updatedCells} cells appended.`)
      });
    }

  function hide_screen() {
      all_eval.style.display="none";
      cont.style.display="block";
      finished_num = i-1;
      const left_num = 30 - finished_num;
      if (i<31){
        alert("30枚中、"+finished_num+
        "枚のパンフレットの評価が終わりました。休憩が終わったら、「実験を続く」ボタンを押してください")
      } else{
        alert("30枚のパンフレットの評価が終わりました。次は気に入った色について答えていただきます。休憩が終わったら、「実験を続く」ボタンを押してください")
      }
}

function ans_last_eval(){
    openFullscreen()
    top_page.style.display="none";
    all_eval.style.display="none";
    rest.style.display="none";
    last_eval.style.display="block";
}

function check3(){
    var color_name = document.getElementsByClassName("fc");
    var color_reason = document.getElementsByTagName("textarea");
    var y = 0;
    for (x = 0; x<color_name.length; x++){
      if (color_name[x].value=='' || color_reason[x].value==''){
        y++;
      }}
    if (y==0){
      save_last_eval();
      close_file();
    }  else {
        alert(y+'つの完成していない答えがあります');
      }
}

function save_last_eval() {
    var color_name = document.getElementsByClassName("fc");
    var color_reason = document.getElementsByTagName("textarea");
    var id = document.getElementById("ss_id");
    var spreadsheetId = id.value;
    var data_array = [];
    for (x = 0; x<color_reason.length; x++){
        data_array.push(color_name[x].value);
        data_array.push(color_reason[x].value);
        }
    var body = {
              values: [
                  data_array
              ]
          };
    gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: spreadsheetId,
          range: last_sheet_name, // INI NAMA SHEET YG BIASA DI BAWAH (DEFAULTNYA Sheet1)
          valueInputOption: 'RAW', // INI IKUTIN AJA
          resource: body
      }).then((response) => {
          var result = response.result;
          console.log(`${result.updates.updatedCells} cells appended.`)
      });
  }


function close_file(){
    last_eval.style.display="none";
    thank.style.display="block";
  }

    // 3 VALUE INI MUSTI DIUBAH SESUAI INSTRUKSI
    var CLIENT_ID = "514380287820-tbhleigkv9mandjaqgrm3i5065e6g4ks.apps.googleusercontent.com";
    var API_KEY = "AIzaSyD1pa1gCIkPbBFSl8FPalMC0C3GSv5ks-k";
    var spreadsheetId = ss_id;

    // INI BUAT SHOW/HIDE TOMBOL2, KALO display=none ITU DI HIDE, KALO display=inline-block ITU DI SHOW
    // DI APP HARUSNYA NGGA PERLU GINIAN
    var authorizeButton = document.getElementById('authorize_button');

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            // authorizeButton.style.display = 'none';
            header.style.display = 'none';
        } else {
            authorizeButton.style.display = 'inline-block';
        }
    }

    // DARI SINI KE BAWAH JANGAN DIUBAH

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        }, function (error) {
            console.log(error)
        });
    }

    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }
