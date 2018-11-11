

var topics = ["cat", "dog", "birds", "chicken"];
var screenWidth;
var results;
var offset = 0;
var topic = "";
var limit = 0;
var numberOfGifDisplayed = 0;
var favoriteselected = 0
var favoritGif = [];
var selectedGif = [];


function displayTopicInfo() {

  if ($("#CustomSelectLimit").val() && $("#CustomSelectLimit").val() <= 25 && $("#CustomSelectLimit").val() > 0) {
    $("#display-selected-animal").html("");
    $("#favoriteselected").text("");//favoritechecked
    $("#addtofavorite").text("");
    $("#middleDiv").html("");
    offset = 0;
    favoriteselected = 0;
    $("#middleDiv").html("");
    topic = $(this).attr("data-name");
    limit = parseInt($("#CustomSelectLimit").val());
    numberOfGifDisplayed = limit;
    $("#displayinfo").text("Now Displaying" + " " + numberOfGifDisplayed + " " + topic.toUpperCase() + " " + "Gif");
    $("#resetdiv").html("");
    var r = $("<button>");
    r.text("Close")
    r.addClass("btn btn-outline-light");
    r.attr("id", "reset");
    $("#resetdiv").append(r)
    $("#addmoregif").html("");
    var addmore = $("<button>");
    addmore.text("Add more")
    addmore.addClass("btn btn-outline-light");
    addmore.attr("id", "add");
    $("#addmoregif").append(addmore)
    getTopicGif();
  }
  else if ($("#CustomSelectLimit").val() && $("#CustomSelectLimit").val() > 25) {

    $("#CustomSelectLimit").attr("data-original-title", "Maximum  25 at atime")
    $("#CustomSelectLimit").tooltip("show");
    setTimeout(removeTooltip, 3000);
  }
  else {

    $("#CustomSelectLimit").attr("data-original-title", "please put the limit to display")
    $("#CustomSelectLimit").tooltip("show");
    setTimeout(removeTooltip, 3000);
  }
}
function addMoreGif() {
  offset = offset + limit;
  limit = 10;
  numberOfGifDisplayed = numberOfGifDisplayed + 10;
  $("#displayinfo").text("Now Displaying" + " " + numberOfGifDisplayed + " " + topic.toUpperCase() + " " + "Gif");
  getTopicGif();
}

function getTopicGif() {
  var apikey = "KYolfYLXYl961kGmNrzBGBEqGRVj5yF7";
  var query = "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=" + apikey + "&limit=" + limit + "&offset=" + offset;


  $.ajax({
    url: query,
    method: "GET"

  }).then(function (response) {

    console.log(response);
    results = response.data;

    for (var i = 0; i < results.length; i++) {
      var ctrl = $('<input/>').attr({ type: 'checkbox', name: 'check', value: results[i].images.fixed_height.url }).addClass("rad");  //checkbox      
      var animalDiv = $("<div>");
      var p = $("<p>");
      p.addClass("text-muted");
      p.text("Rating: " + results[i].rating);
      var animalImage = $("<img>");
      animalDiv.addClass("col-md-auto")

      animalImage.addClass("clickToAnimate border border-white")
      if (screenWidth >= 768) {  //if document width greater or equal to 768 capture fixed-hight            
        animalImage.attr("src", results[i].images.fixed_height_still.url);
        animalImage.attr("data-still", results[i].images.fixed_height_still.url);
        animalImage.attr("data-animate", results[i].images.fixed_height.url);
      }
      else {//if document width is less than 768 capture fixed-hight-small image
        animalImage.attr("src", results[i].images.fixed_height_small_still.url);
        animalImage.attr("data-still", results[i].images.fixed_height_small_still.url);
        animalImage.attr("data-animate", results[i].images.fixed_height_small.url);
      }
      animalImage.attr("data-state", "still");
      animalImage.attr("title", "Click The Image To Animate");
      animalDiv.append(p);
      animalDiv.append(ctrl);//checkbox
      animalDiv.append(animalImage);
      $("#display-selected-animal").append(animalDiv)
    }
  });

}




function animateThePic() {

  var state = $(this).attr("data-state");

  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
    $(this).attr("title", "Click The Image To Stop Animate");

  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
    $(this).attr("title", "Click The Image To Animate");
  }
}



function renderButtons() {

  $("#topic-button-view").empty();

  for (var i = 0; i < topics.length; i++) {
    var a = $("<button>");
    a.addClass("topic-btn mx-1 my-1 btn btn-outline-info");
    a.attr("data-name", topics[i]);
    a.text(topics[i]);
    $("#topic-button-view").append(a);
  }
}


$(document).on("click", ".topic-btn", displayTopicInfo);
$(document).on("click", ".clickToAnimate", animateThePic);
$(document).on("click", "#reset", reSetGifDisplay);
$(document).on("click", "#addmoregif", addMoreGif);
$(document).on("click", ".rad", checkFavorite);
$(document).on("click", "#addFavoriteButton", addToFavorite);
$(document).on("click", "#myfavorit", getmyfavorit);


$(document).ready(function () {
  screenWidth = $(document).width();//get the width of the document to display approperiate gif according to the size
  //$("#middleDiv").text(selectedFavoritGif.length);//test the width
  renderButtons();
  $("#topic-input").mouseover(function () {
    $("#topic-input").removeAttr("data-original-title");
    $("#CustomSelectLimit").removeAttr("data-original-title");
  });

  $("#add-topic").on("click", function (event) {
    event.preventDefault();
    $("#middleDiv").html("");
    if ($("#topic-input").val()) {//prevent empty insertion

      var topic = $("#topic-input").val();
      $("#topic-input").val("");
      if (!topics.includes(topic.toLowerCase())) {//prevent duplicate insertion                          
        topics.push(topic.toLowerCase());
        renderButtons();
      }
      else {

        //$("#topicinput").attr("title",topic+"already exist in the list")
        $("#topic-input").attr("data-original-title", topic.toUpperCase() + " already exist in the list")
        $("#topic-input").tooltip("show");
        setTimeout(removeTooltip, 4000);
      }
    }
    else {
      // $("#topicinput").attr("title","please enter the name of the animal")
      $("#topic-input").attr("data-original-title", "please enter the name of the animal to add")
      $("#topic-input").tooltip("show");
      setTimeout(removeTooltip, 4000);
    }
  });

});

function removeTooltip() {
  $("#topic-input").tooltip("hide");
  $("#CustomSelectLimit").tooltip("hide");
}

function reSetGifDisplay() {
  $(".displaygif").html("");
  $("#middleDiv").html("");

}

function checkFavorite() {

  $("#favoriteselected").text("");
  $("#addtofavorite").html("");
  if ($(this).is(":checked")) {//check one of the radio button is checked
    favoriteselected++;
    selectedGif.push($(this).val());
  }

  else {
    favoriteselected--
    var index = selectedGif.indexOf($(this).val());
    selectedGif.splice(index, 1);
  }

  setFavoriteButton();
  //addToFavorite();
  $("#favoriteselected").text("Total item selected" + " " + favoriteselected);
}


function setFavoriteButton() {
  var f = $("<button>");
  f.addClass("btn btn-outline-light");
  f.attr("id", "addFavoriteButton")
  f.text("Add to Favorite");
  $("#addtofavorite").append(f);
}

function addToFavorite() {
  var numberOfGifaddedToFavorit = 0;
  var numberOfGifalreadyFoundInFavorit=0

    selectedGif.forEach(function (gif) {
      if (!favoritGif.includes(gif)) {
        favoritGif.push(gif);
        numberOfGifaddedToFavorit++;
      }
      else{
        numberOfGifalreadyFoundInFavorit++; 
      }
    })
  
    $("#myfavorit").html("My Favorit<br>"+favoritGif.length+" "+"items");
  
  selectedGif = [];
  
  $("#middleDiv").html(numberOfGifaddedToFavorit + " " + "gif added to favorite" + "<br>" + 
              numberOfGifalreadyFoundInFavorit+" "+"of the selected already found in your favorit");


}

  function getmyfavorit(){
  $(".displaygif").html("");
  $("#middleDiv").html("");
  
  
  for(var i=0;i<favoritGif.length;i++){
    var animalDiv = $("<div>");
  var animalImage = $("<img>");
  animalDiv.addClass("col-md-auto")
  animalImage.attr("src", favoritGif[i]);
        animalDiv.append(animalImage);
       animalDiv.append(animalImage);
      $("#display-selected-animal").append(animalDiv)
  }

}