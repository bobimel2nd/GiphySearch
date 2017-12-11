$( document ).ready(function() {
  var giphy = $("#giphy");
  var search = "";
  var columnsPerPage = 6;
  var columnSize = "col-xs-2";
  var rowsPerPage = 3;
  var offset = 0;
  var total = 0;

  $(document).on("click", "#Search", function (){
    offset = 0;
    searchGiphy(giphy.val());
  });
  $(document).on('keyup', "#giphy", function (e) {
      if (e.keyCode == 13) {
        offset = 0;
        searchGiphy(giphy.val());
      }
  });
  $(document).on("click", ".searches", function() {
    offset = 0;
    moreGiphys($(this).data("search"));
  });
  $(document).on("click", "#more", function() {
    offset += 6;
    moreGiphys($('#more').data("search"))
  });
  $(document).on("click", ".smallPic", function() {
      getGiphy($(this));
  });

  function searchGiphy(searchText) {
    var search = searchText.toLowerCase();
    search = search.replace(" ", "+");
    search = search.replace(":", "+");
    search = search.replace("-", "+");
    search = search.replace(",", "+");
    searchText = searchText.capitalizeAll();

    // find if search matches button already there
    var btns = $(".searches")
    for (var i=0; i<btns.length; i++) {
      if (btns[i].dataset.search === search) break;
    }
    // if no button for search then add it
    if (i >= btns.length) {
      var btn = $("<button>");
      btn.addClass("searches")
      btn.attr("data-search", search);
      btn.text(searchText);
      $("#giphyButtons").append(btn);
      $("#giphyButtons").append(" ");
    }
    moreGiphys(search);
  }

  function moreGiphys(search) {
    if (offset === 0) $("#giphyRows").html("");
    $('#more').data("search", search);
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=Rwbfio5IHBbFFNHyLD8FqeEjS73KUiFM&limit=6&rating=g&q=" + search + "&offset=" + offset;
    $.ajax({ 
      url: queryURL, 
      method: "GET" })
    .done(function(response) {
      updateDisplay(response.data, response.pagination.count);
    })
  }

  function updateDisplay(gifsArray, count) {
    var html = $("#giphyRows");
    var row = $("<div>");
    row.addClass("row");
    html.prepend(row);
    for (var i=0; i<count; i++) {
      var col = $("<div>");
      col.addClass(columnSize)
      row.append(col);
      var img = $("<img>");
      img.addClass("smallPic");
      img.attr("src", gifsArray[i].images.fixed_height_still.url);
      img.attr("alt", gifsArray[i].title);
      img.attr("title", gifsArray[i].title);
      img.data("gif",gifsArray[i].images.original.url);
      col.append(img);
    }
  }

  function getGiphy(giphyImg) {
    $("#giphyImg").attr("src", "#");
    $("#giphyImg").attr("src", giphyImg.data("gif"));
    $("#giphyImg").attr("alt", giphyImg.data("gif"));
    $("#title").text(giphyImg.attr("title"));
    DataPopupOpen("giphyPopup");
  };

  String.prototype.capitalizeAll = function() {
    var text = this.toLowerCase();
    array   = text.split(' '); // split on spaces
    capitalized = '';
    $.each(array, function( index, value ) {
      capitalized += value.charAt(0).toUpperCase() + value.slice(1);
      if( array.length != (index+1) )
        capitalized += ' '; // add a space if not end of array
    });
    return capitalized;
  }
})