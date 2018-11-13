

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
var allThisTopicResponse=[];
var indexOfThisResponse;


function displayTopicInfo() {

  if ($("#CustomSelectLimit").val() && $("#CustomSelectLimit").val() <= 25 && $("#CustomSelectLimit").val() > 0) {
        
        $(".displaygif").html("")
        allThisTopicResponse=[];
        offset = 0;
        favoriteselected = 0;
        topic = $(this).attr("data-name");
        limit = parseInt($("#CustomSelectLimit").val());
        numberOfGifDisplayed = limit;

        $("#displayinfo").text("Now Displaying" + " " + numberOfGifDisplayed + " " + topic.toUpperCase() + " " + "Gif");
           //a button to close the displayed gif

        makeCloseButton();
        makeAddMoreButton();
        setFavoriteButton("disabled","true");
        removeTooltip("#addtofavorite") 
        deleteTooltip("#addtofavorite")
        getTopicGif();
        //here
      }
  else if ($("#CustomSelectLimit").val() && $("#CustomSelectLimit").val() > 25) {

        $("#CustomSelectLimit").attr("data-original-title", "Maximum  25 at atime")
        $("#CustomSelectLimit").tooltip("show");
        setTimeout(removeTooltip, 3000,"#CustomSelectLimit");
        setTimeout(deleteTooltip, 4000,"#CustomSelectLimit");
  }
  else {

        $("#CustomSelectLimit").attr("data-original-title", "please put the limit to display")
        $("#CustomSelectLimit").tooltip("show");
        setTimeout(removeTooltip, 3000,"#CustomSelectLimit");
        setTimeout(deleteTooltip, 4000,"#CustomSelectLimit");
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
            allThisTopicResponse.push(results);
            indexOfThisResponse=allThisTopicResponse.indexOf(results)
            iterateTheResponse(indexOfThisResponse);
              
           });
        }
     function iterateTheResponse(start){
                var ctrl;
                for(start;start<allThisTopicResponse.length;start++){//added to handle the add to favorite
                    for (var i = 0; i < allThisTopicResponse[start].length; i++) {
                              
                          var animalDiv = $("<div>");
                          var p = $("<p>");
                          var animalImage = $("<img>");
                          p.addClass("text-muted");
                          p.text("Rating: " + allThisTopicResponse[start][i].rating);                        
                          animalDiv.addClass("col-md-auto ")
                          animalImage.addClass("clickToAnimate border border-white")
                         
                          if (screenWidth >= 768) {  //if document width greater or equal to 768 capture fixed-hight   
                                ctrl = $('<input/>').attr({ type: 'checkbox', name: 'check', value: allThisTopicResponse[start][i].images.fixed_height.url }).addClass("rad");  //checkbox                            
                                animalImage.attr("src",allThisTopicResponse[start][i].images.fixed_height_still.url);
                                animalImage.attr("data-still",allThisTopicResponse[start][i].images.fixed_height_still.url);
                                animalImage.attr("data-animate", allThisTopicResponse[start][i].images.fixed_height.url);
                          }
                         else {//if document width is less than 768 capture fixed-hight-small image
                                ctrl = $('<input/>').attr({ type: 'checkbox', name: 'check', value: allThisTopicResponse[start][i].images.fixed_height_small.url }).addClass("rad");  //checkbox      
                                animalImage.attr("src", allThisTopicResponse[start][i].images.fixed_height_small_still.url);
                                animalImage.attr("data-still", allThisTopicResponse[start][i].images.fixed_height_small_still.url);
                                animalImage.attr("data-animate", allThisTopicResponse[start][i].images.fixed_height_small.url);
                          }
                          animalImage.attr("data-state", "still");
                          animalImage.attr("title", "Click The Image To Animate");
                          animalDiv.append(p);
                          animalDiv.append(ctrl);//checkbox
                          animalDiv.append(animalImage);
                          $("#display-selected-animal").append(animalDiv)
                        }
                 }

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



$(document).on("click", ".topic-btn", displayTopicInfo);
$(document).on("click", ".clickToAnimate", animateThePic);
$(document).on("click", "#reset", reSetGifDisplay);
$(document).on("click", "#addmoregif", addMoreGif);
$(document).on("click", ".rad", checkFavorite);
$(document).on("click", "#addFavoriteButton", addToFavorite);
$(document).on("click", "#myfavorit", getMyFavorit);


$(document).ready(function () {
          screenWidth = $(document).width();//get the width of the document to display approperiate gif according to the size
          renderTopicButtons();
  
         $("#add-topic").on("click", function (event) {
               event.preventDefault();
              //  $("#middleDiv").html("");
        if ($("#topic-input").val()) {//prevent empty insertion

              var topic = $("#topic-input").val();
              $("#topic-input").val("");
              if (!topics.includes(topic.toLowerCase())) {//prevent duplicate insertion                          
                    topics.push(topic.toLowerCase());
                    renderTopicButtons();
              }
              else {
               
                $("#topic-input").attr("data-original-title", topic.toUpperCase() + " already exist in the list")
                $("#topic-input").tooltip("show");
                setTimeout(removeTooltip, 4000,"#topic-input");
                setTimeout(deleteTooltip, 4000,"#topic-input");
              }
        }
        else {
          
          $("#topic-input").attr("data-original-title", "please enter the name of the animal to add")
          $("#topic-input").tooltip("show");
          setTimeout(removeTooltip, 4000,"#topic-input");
          setTimeout(deleteTooltip, 4000,"#topic-input");
        }
  });

});

function removeTooltip(id) {
  $(id).tooltip("hide");
  
}

function reSetGifDisplay() {
          $(".displaygif").html("");
          removeTooltip("#addtofavorite"); 
          deleteTooltip("#addtofavorite");

}

function checkFavorite() {

          $("#addtofavorite").html("");
          if ($(this).is(":checked")) {//check one of the checkbox  is checked
                favoriteselected++;
                selectedGif.push($(this).val());
          }

          else {
              favoriteselected--
              var index = selectedGif.indexOf($(this).val());
              selectedGif.splice(index, 1);
          }
          setFavoriteButton("enabled", "true");
          $("#addtofavorite").attr("data-original-title", favoriteselected+" " +"Item selected")
          $("#addtofavorite").tooltip("show");
}

function addToFavorite() {
        var numberOfGifaddedToFavorit = 0;
        var numberOfGifalreadyFoundInFavorit=0
        favoriteselected=0;
        removeTooltip("#addtofavorite") ;
        deleteTooltip("#addtofavorite");
 
        selectedGif.forEach(function (gif) {
              if (!favoritGif.includes(gif)) {
              favoritGif.push(gif);
              numberOfGifaddedToFavorit++;
               }
             else{
              numberOfGifalreadyFoundInFavorit++; 
             }
          })
  
              $("#addtofavorite").html("");
              setFavoriteButton("disabled", "true");
              $("#myfavorit").html("My Favorit<br>"+favoritGif.length+" "+"items");
  
               selectedGif = [];
  
  
            if(numberOfGifalreadyFoundInFavorit===0){
                  $("#addtofavorite").attr("data-original-title", numberOfGifaddedToFavorit + " " + "gif added to Favorite")
                  $("#addtofavorite").tooltip("show");
                  setTimeout(removeTooltip, 3000,"#addtofavorite");
                  setTimeout(deleteTooltip, 4000,"#addtofavorite");
            }
             else{
                  $("#addtofavorite").attr("data-original-title", numberOfGifaddedToFavorit + " " + 
                  "gif added to Favorite"+" "+
                  numberOfGifalreadyFoundInFavorit+" "+"of the selected already exist in your favorit");
                  $("#addtofavorite").tooltip("show");
                  setTimeout(removeTooltip, 7000,"#addtofavorite");
                  setTimeout(deleteTooltip, 4000,"#addtofavorite");
             }
                  $("#display-selected-animal").html("");
                  favoriteselected=0;
                  iterateTheResponse(0);  //to uncheck the checkbox

        }

  function getMyFavorit(){
      
      if(favoritGif.length>0)  {
              $(".displaygif").html("");
              $("#middleDiv").html(""); 
              $("#displayinfo").text("Now Displaying"+" "+ favoritGif.length+" "+"of your Favorite Gif");
            for(var i=0;i<favoritGif.length;i++){      
                var animalDiv = $("<div>");
                var animalImage = $("<img>");
                animalDiv.addClass("col-md-auto my-2")
                animalImage.attr("src", favoritGif[i]);
                animalDiv.append(animalImage);
                animalDiv.append(animalImage);
                $("#display-selected-animal").append(animalDiv)
            }
       makeCloseButton();
     

        }
      else{
             $("#myfavorit").attr("data-original-title","you have no item to display");
             $("#myfavorit").tooltip("show");
             setTimeout(removeTooltip, 5000,"#myfavorit");
             setTimeout(deleteTooltip, 4000,"#myfavorit");
          }

      }

  function deleteTooltip(id){
      $(id).removeAttr("data-original-title");
    
  }
  // button relatedfunctions
  function renderTopicButtons() {

    $("#topic-button-view").empty();

    for (var i = 0; i < topics.length; i++) {
      var topicbtn = $("<button>");
      topicbtn.addClass("topic-btn mx-1 my-1 btn btn-outline-info");
      topicbtn.attr("data-name", topics[i]);
      topicbtn.text(topics[i]);
      $("#topic-button-view").append(topicbtn);
    }
}
  function makeCloseButton(){

      var closebtn = $("<button>");
      closebtn.addClass("btn btn-outline-light bg-info");     
       closebtn.html("&times") ;     
      closebtn.attr("id", "reset");     
      $("#resetdiv").append(closebtn)
  }

  function setFavoriteButton(property,value) {
        var f = $("<button>");
        f.addClass("btn btn-outline-light");
        f.attr("id", "addFavoriteButton")
        f.attr(property, value)
        f.html("Add To Favorite");
        $("#addtofavorite").append(f);
  }
  function  makeAddMoreButton(){
    var addmore = $("<button>");
        addmore.text("Add more")
        addmore.addClass("btn btn-outline-light");
        addmore.attr("id", "add");
        $("#addmoregif").append(addmore)
  }

