

//==================index page music track======================
const tracksTemplateSource1 = document.getElementById('tracks-template1').innerHTML;
const tracksTemplate1 = Handlebars.compile(tracksTemplateSource1);

const $tracks1 = $('#tracks-container1');

const getTopTracks1 = $.get('https://api.napster.com/v2.1/tracks/top?apikey=ZGRhMzc3MzQtMjNlZS00MGRiLThmOGMtYzE2ZjJhMzYyNDNj');

getTopTracks1
  .then((response) => {
    $tracks1.html(tracksTemplate1(response));
  });
 ;

  //=================index contenteditable HTML=============================
  const name = document.querySelector('#name');
  
  function getNames(){
    if(localStorage.getItem('name') === null){
      name.textContent = '[Enter Your Name Here]';
    } else {
      name.textContent = localStorage.getItem('name');
    }
  }

  name.addEventListener('click', (e) =>{
    e.preventDefault();
    document.querySelector('#name').style.background='#c8c8c8';
  });

  function setName(e){
    if (e.type === 'keypress') {
      // Make sure enter is pressed(code:13)
      if (e.which == 13 || e.keyCode == 13) {
        localStorage.setItem('name', e.target.innerText);
        name.blur();
      }
    } else {
      localStorage.setItem('name', e.target.innerText);
    }
  }
  name.addEventListener('keypress', setName);
  name.addEventListener('blur', setName);
  
  getNames();

  



