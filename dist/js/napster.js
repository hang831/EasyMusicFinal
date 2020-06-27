//search


const $search = $('#search');

var myArray = new Array();
const save = document.getElementById("search");

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener('keypress', Search);

function Search(e){
  if (e.key != 'Enter') {
   const dump = 1; //(dummy command)
  }else{
    $("#search").html(""); //clear before display
 //get user input
 const searchInputValue = document.getElementById("searchInput").value;
 //console.log(searchInputValue); ( for debug only )
 
 const searchresult = $.get('http://api.napster.com/v2.2/search/verbose?apikey=ZGRhMzc3MzQtMjNlZS00MGRiLThmOGMtYzE2ZjJhMzYyNDNj&query='+searchInputValue+'&type=track');
 
 
    
  searchresult
  .then((response) => {
    for(let i=0;i<10;i++){
      
      //myArray[i] = searchresult.responseJSON.search.order[i]; 
      var tableContents = '<div class="list-group-item" style="width:20%;  display:block; float:left;">'+' ['+[i+1]+'] ID: '+searchresult.responseJSON.search.order[i]+'</div><br>';
      save.innerHTML += tableContents;  
                        }
                      });                 
                    }
                  }
                        
    
const displaytemplateSource = document.getElementById('display-temp').innerHTML;
const displaytemp = Handlebars.compile(displaytemplateSource);

const $display= $('#display-container');

const DisplayInput2 = document.getElementById("displayInput2");
DisplayInput2.addEventListener('keypress', DisplayNow);

function DisplayNow(e){
  if (e.key != 'Enter') {
    const dump = 1; //(dummy command)
  }else{
    $("#display").html("");
const displayvalue = document.getElementById("displayInput2").value;
//console.log(displayvalue);
const display = $.get('http://api.napster.com/v2.2/tracks/'+ displayvalue +'?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&range=week');

display
   .then((response) => { 
       //$test.innerHTML = "<button class='btn btn-info'>HI lorem  </button>"
        $display.html(testtemplate(response));
    })
  }
}





const playlistTemplateSource = document.getElementById('playlist-template').innerHTML;
const playlistTemplate = Handlebars.compile(playlistTemplateSource);

const tracksTemplateSource = document.getElementById('tracks-template').innerHTML;
const tracksTemplate = Handlebars.compile(tracksTemplateSource);

const $playlist = $('#playlist-container');
const $tracks = $('#tracks-container');
const $mainTitle = $('.header');
const $backButton = $('.back-button');

const getTopPlaylists = $.get('https://api.napster.com/v2.0/playlists?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm');

function getPlaylistTracks(id) {
  return $.get('https://api.napster.com/v2.0/playlists/' + id + '/tracks?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm&limit=200');
}

$backButton.click(() => {
	$playlist.show();
  $tracks.hide();
  $mainTitle.text('Top Playlists');
  $backButton.hide();
});

$backButton.hide(); // Initally hide back button.

function changeToTracks(playlistName) {
	$mainTitle.text(playlistName);
  $playlist.hide();
	$tracks.show();
  $backButton.show();
  
  return renderTracks;
}

function renderTracks(response) {
  $tracks.html(tracksTemplate(response));
}

getTopPlaylists
  .then((response) => {
    $playlist.html(playlistTemplate(response));
    addPlaylistListener();
  });

function addPlaylistListener() {
  $('.cover').on('click', (e) => {
    const $playlist = $(e.target);
    getPlaylistTracks($playlist.data('playlistId'))
      .then(changeToTracks($playlist.data('playlistName')));
  });
}





const testtemplateSource = document.getElementById('test-template').innerHTML;
const testtemplate = Handlebars.compile(testtemplateSource);

const $test= $('#testcontainer');

const get = $.get('http://api.napster.com/v2.2/tracks/top?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&range=week');

get
   .then((response) => { 
       //$test.innerHTML = "<button class='btn btn-info'>HI lorem  </button>"
        $test.html(testtemplate(response));
    });


  