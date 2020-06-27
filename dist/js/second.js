//line14: First form for movie(fetch)
//line48: First form for movie(display)
//line68: First form for movie display(toggle)

//line90: second form for channel id(fetch)
//line117: second form for channel(display) 
//line158: second form for channel playlists(display)

//line179: Display Alert Message(Global function)
//line197:  Display Alert Message(Global)


import fetchJsonp from 'fetch-jsonp';

const searchForm = document.querySelector('#searchForm');
const searchForm2 = document.querySelector('#searchForm2');

searchForm.addEventListener('submit', fetchMovie);
searchForm2.addEventListener('submit', fetchChannel);


// ========First form for movie(fetch)====================================
function fetchMovie(e) {
  e.preventDefault();
  // Get User Input
  const movie = document.querySelector('#movie').value;
  const movieNumber = document.querySelector('#movieNumber').value;

  if(movie === ''  || movieNumber === '' ||(!isValid(movieNumber))){
    showAlert('Please Enter All Fields, or Enter A Valid Number!', 'danger');
    movieNumber = '0'
  }else{
    clearField();
  }
  
 // Fetch Movies
 fetchJsonp( `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movie}&key=AIzaSyCI0ULuQ4191oGLsP4B4qRc-V8sFj3bz8o&type=video&maxResults=${movieNumber}&callback=callback`,
 {
  jsonpCallbackFunction: 'callback'
}
)
.then(res => res.json())
.then(data => showVideo(data.items.map(data => data.id)))
// .then(data => console.log(data))
.catch(err => console.log(err));
const Bar = document.querySelector('#myBar'); // 0%
const Bar2 = document.querySelector('.hide'); //<p>loading</p>
  if (Bar.style.display === "none") {
    Bar.style.display = "block";
    Bar2.style.display = "block";
  }
move(); //animation bar fnuction
frame();//animation bar fnuction
}

// =============First form for movie(display)==========================================
function showVideo(data){
  let output='<div class="card card-group  mydiv"> ';
  data.forEach((id) => {
    output+=`
    <div class="card-body">
    <h3 class="card-title">ID: ${id.videoId}</h3>
    <p>https://www.youtube.com/watch?v=${id.videoId}</p>
    <a class="card-text" href="https://www.youtube.com/watch?v=${id.videoId}"><h3>Link<h3></a>
    
    <iframe width="480" height="315" src="https://www.youtube.com/embed/${id.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <hr>
    </div>`;
  });
  output += `</div>`
  setTimeout(() => btnbtn.style.display = "block", 1500 );
  setTimeout(() =>document.getElementById('results').innerHTML = output, 1000);
  
}

//===============First form for movie display(toggle)=================================
//when click, the display area will show or hide 
document.getElementById("btnbtn").addEventListener("click", function(){
  //console.log("click");
  if (results.style.display === "none") {
    results.style.display = "block";
  }else{
    results.style.display = "none";
  }
});
//prevent many click( 2s per click now) 
$("#btnbtn").click(function() {
  $(this).attr("disabled", true);
  setTimeout(function() {
      $('#btnbtn').removeAttr("disabled");      
  }, 2000);
});
  

//======================second form for channel id(fetch)================================
function fetchChannel(e) {
  e.preventDefault();
  // Get User Input
  const channel = document.querySelector('#channel').value;
  
  
  if(channel === '' ){
    showAlert2('Please Enter All Fields, or Enter A Valid Channel ID!', 'danger');
  }else{
    clearField();
  }

 // Fetch channel
 fetchJsonp( `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channel}&key=AIzaSyAU3Ph1_2qQ0lDbFwWJmhIMEexP8TYRln4&callback=callback`,
 {
  jsonpCallbackFunction: 'callback'
}
)
.then(res => res.json())
.then(data => showplaylist(data.items.map(data => data.contentDetails.relatedPlaylists.uploads)))
//.then(data => console.log(data))
.catch(err => showAlert2('Please Enter A Valid Channel ID or Enter all Field.', 'danger'));
}

// =============second form for channel(display)===============================================
function showplaylist(data){
  var getchannel = data[0];
  //console.log( getchannel);
  var count = data.length;
  if (count = 1){  //if have result, the data length = 1
  const show = document.querySelector(".none")  //display channel number <p>area
  show.style.display = "block";                

  const show2 = document.querySelector(".none2")//display channel number <input>area
  if (show2.style.display === "none") {
    show2.style.display = "block";}
  
  const content = document.querySelector(".content"); //set default display vh to 70 
  content.style.minHeight = "70vh";                   
  const coll2 = document.querySelector(".coll");
  coll2.addEventListener("click", function() {        //when click the toggle, set vh
  content.style.minHeight = "0vh"                     //to 0 = display area disappear
  })
  } 
   //check vaild
   const channelNumber = document.getElementById('channelNumber').value;
  if(channelNumber === ''  || channelNumber<=0 || channelNumber>50){
    channelNumber =''
     showAlert2('Please Enter All Fields, or Enter A Valid Number!', 'danger');
     
   }else{
     clearField();
   }
  

  // Fetch channelplaylists
 fetchJsonp( `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${getchannel}&key=AIzaSyAU3Ph1_2qQ0lDbFwWJmhIMEexP8TYRln4&maxResults=${channelNumber}&callback=callback`,
 {
  jsonpCallbackFunction: 'callback'
}
)
.then(res => res.json())
.then(data => showChannelplaylists(data.items.map(data => data.contentDetails)))
.catch(err => showAlert2('Please Enter A Valid Channel Number!', 'danger'));
}

// ================End of second form for channel playlists==============================================

// ================second form for channel playlists(display)================
function showChannelplaylists(data){
  showAlert2('Success! Results are in below', 'success');
  let output2='<div class=" card card-group text-white bg-danger "> ';
  data.forEach((contentDetails) => {
    
    output2+=`
    <div class="card-body">
    <h3 class="card-title"> ID: ${contentDetails.videoId}</h3>
    <p>https://www.youtube.com/watch?v=${contentDetails.videoId}</p>
    <a class="card-text" href="https://www.youtube.com/watch?v=${contentDetails.videoId}"><h3>Link<h3></a>
    <p class="card-text"> Published at: ${contentDetails.videoPublishedAt}</p>
    <iframe width="360" height="215" src="https://www.youtube.com/embed/${contentDetails.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <hr>
    </div>`;
   
  });
  output2 += `</div>`
  document.getElementById('results2').innerHTML = output2;
  setTimeout(() => btnbtn2.style.display = "block", 1000 );
}

// ================second form for channel playlists(toggle)===========
document.getElementById("btnbtn2").addEventListener("click", function(){
  //console.log("click");
  if (results2.style.display === "none") {
    results2.style.display = "block";
  }else{
    results2.style.display = "none";
  }
});
//prevent many click( 2s per click now) 
$("#btnbtn2").click(function() {
  $(this).attr("disabled", true);
  setTimeout(function() {
      $('#btnbtn2').removeAttr("disabled");      
  }, 2000);
});




//==============Display Alert Message(Global function)===============================
export function showAlert(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add Classes
  div.className = `alert alert-${className}`;
  // Add Text
  div.appendChild(document.createTextNode(message));
  // Get Container
  const container = document.querySelector('.jumbotron');
  // Get Form
  const form = document.querySelector('#searchForm');
  // Insert Alert
  container.insertBefore(div, form);

  setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

//===========Display Alert Message*2*(Global Function)==================================
export function showAlert2(message, className) {
  // Create div
  const div = document.createElement('div');
  // Add Classes
  div.className = `alert alert-${className}`;
  // Add Text
  div.appendChild(document.createTextNode(message));
  // Get Container
  const container2 = document.querySelector('.jumbotron2');
  // Get Form
  const form = document.querySelector('#searchForm2');
  // Insert Alert
  container2.insertBefore(div, form);

  setTimeout(() => document.querySelector('.alert').remove(), 3500);
}

export function clearField(){
  document.querySelector('#movie').value='';
  document.querySelector('#movieNumber').value='';
}

export function isValid(movieNumber) {
  return /^((?!(0))[0-9]{1})$/.test(movieNumber);
}

//=======Here is line123 function, for toggle the display area====================
var coll = document.getElementsByClassName("coll");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active2");
    
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}


//====Here is line 34 function, for showing the animation progress bar and message======
    const Bar2 = document.querySelector('.hide');
    const Bar3 = document.querySelector('.hide2');
    var q = 0;
    var i = 0;
    function move() {
      if (i == 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 0;
        var id = setInterval(frame, 15);
        function frame() {
          if (width >= 100) {
            clearInterval(id);
            i = 0;
            Bar2.style.display = "none";
            Bar3.style.display = "block";
          } else {
            Bar2.style.display = "block";
            Bar3.style.display = "nono";
            width++;
            elem.style.width = width + "%";
            elem.innerHTML = width  + "%";
          }
        }
      }
  }
 
  
const btnbtn3 = document.querySelector('.btnbtn3');
btnbtn3.addEventListener("click", function(){
  const userInput = document.getElementById("myText").value;
  const userInput2 = document.getElementById("FileName").value;
  console.log(userInput2)
  //console.log(userInput);
  var blob = new Blob([userInput], { type: "text/plain;charset=utf-8" });
  saveAs(blob, userInput2);   
})

const btnbtn4 = document.querySelector('.fix2');
const hidehide = document.querySelector('.hidehide');

btnbtn4.addEventListener("click", function(){
if (hidehide.style.display === "none") {
    hidehide.style.display = "block";
}else{
  hidehide.style.display = "none";
}
})

function progress() {
  const check1 = document.getElementById('myText').validity.valid
  const check2 = document.getElementById('FileName').validity.valid
const btnbtn3 = document.getElementById('btnbtn3');

  if(check1 === true || check2 === true ){
    
    //btnbtn4.addEventListener("click", function(){
      //const filename = document.getElementById('filename').value;
      $(btnbtn3).attr("disabled", true);
      
      }

}
progress();

document.getElementById("FileName").addEventListener("keydown", function(){
  const check1 = document.getElementById('myText').value;
  const check2 = document.getElementById('FileName').value;
  
  if(check1 != '' || check2 != '' ){
    console.log("yes");
          $(btnbtn3).removeAttr("disabled");      
  }else{
    progress();
  }
})



