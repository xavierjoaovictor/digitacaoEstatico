$( document ).ready(function() {

  var errors = 0;
  var count = 60;
  var counter;
  
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
 
  $("#startButton").click(startTest);
  
  function startTest(){
  
      $("#formEmail").css({ display : "none" });
      $("#formDigitacao").css("display","block");
      
      counter = setInterval(timer, 1000);
  
  }

  function timer(){
    count = count - 1;
    if (count <= 0)
      {
        clearInterval(counter);
        $("#formDigitacao").css("display","none");
        submit();
        return;
      }
      $("#counterSpan").text(count);
  }

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
    
    var textoOriginal = $('#textoDigitacao').text();
    var texto = $('#inputDigitacao');
    var email = $('#emailInput');
    var porcentagemAtingida = similarity(texto.val(), textoOriginal);
    var data = new Date();

    if (texto.val() != "" || email != "")
    {
      firebase.database().ref('resultados/').push({
        Email: email.val(),
        IP: leadIP,
        Porcentagem: Math.floor(porcentagemAtingida * 100) + "%",
        TextoFinal: texto.val(),
        Erros: errors,
        Data: data.toLocaleString()
      }, onSignupComplete);

      texto.val("");
      email.val("");
    }
  }

  var onSignupComplete = function(error) {
    if (error) {
      console.log(error);
    } else {
      alert("Teste Finalizado!");
      window.location.replace("https://bancointer.com.br/");
    }
  };
 
  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }
  
  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  } 

  database.ref('/resultados').once('value', function(snapshot){
    if(snapshot.exists()){
        var content = '';
        snapshot.forEach(function(data){
            var val = data.val();
            content += '<tr>';
            content += '<td>' + val.Email + '</td>';
            content += '<td>' + val.IP + '</td>';
            content += '<td>' + val.Porcentagem + '</td>';
            content += '<td>' + val.TextoFinal + '</td>';
            content += '<td>' + val.Erros + '</td>';
            content += '<td>' + val.Data + '</td>';
            content += '</tr>';
        });
        $('#corpoTabela').append(content);
    }
  });
});