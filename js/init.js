$( document ).ready(function() {

  var errors = 0;
  
      // Initialize Firebase
  var config = {
      apiKey: "AIzaSyANjfG2BTtPeDc6mnM4UY7ZN5nuYrV7vas",
      authDomain: "testedigitacaointer.firebaseapp.com",
      databaseURL: "https://testedigitacaointer.firebaseio.com",
      projectId: "testedigitacaointer",
      storageBucket: "testedigitacaointer.appspot.com",
      messagingSenderId: "583907915016"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  var leadIP;
  axios.get('https://api.ipify.org?format=json').then(function (response) {
      leadIP = response.data.ip;
    }).catch(function(error) {
      console.log(error);
  });
 
  $("#inputDigitacao").keydown(function(event){
    var KeyID = event.keyCode;
    switch(KeyID)
    {
       case 8:
         errors = errors + 1; 
       break; 
       case 46:
         errors = errors + 1; 
       break;
       default:
       break;
    }
  });

  $("#finishButton").click(submit);

  function submit(){
    var texto = $('#inputDigitacao');
    var email = $('#EmailInput');

    if (validName(name.val())) {
      if (is_email(email.val())) {  
          firebase.database().ref('tests/').push({
                TextoFinal: texto.text(),
                Email: email.val(),
                IP: leadIP,
                // Data: date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(),
                // Hora: date.getHours() + ':' + date.getMinutes() + ':'+ date.getSeconds(),
                data: Date()
          },onSignupComplete);

          name.val("");
          email.val("");
          celular.val("");

        } else {
          alert("Coloque um e-mail válido!");
        }
      } else {
        alert("Coloque um nome válido!");
      }
  }

  $("#startButton").click(startTest);

  function startTest(){
    $("#startButton").css({ display : "none" })
    $("#formDigitacao").css("display","block");

  }

});