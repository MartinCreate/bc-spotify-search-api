(function() {
    var nextUrl;

    $("#submit-btn").on("click", function() {
        var userInput = $("input[name=user-input]").val();
        var dropdownSelectVal = $("select").val();
        var baseURL = "https://elegant-croissant.glitch.me/spotify";

        hideMoreButton();

        $.ajax({
            //send this to our proxy
            url: baseURL,
            method: "GET",
            //data we need to send along in our request
            data: {
                query: userInput,
                type: dropdownSelectVal
            },
            success: function(response) {
                response = response.albums || response.artists;

                //Message for results found/not found
                var resultsPresent = "";
                if (response.items.length == 0) {
                    resultsPresent =
                        "<div>No results found for " +
                        $("input").val() +
                        "</div>";
                } else {
                    resultsPresent =
                        "<div>Results for: " + $("input").val() + "</div>";
                }

                $(".resultsFound").html(resultsPresent);

                //Results-Html - Create and insert
                $("#results-container").html(getResultsHtml(response));

                nextUrl = setNextUrl(response);

                if (response.items.length == 20) {
                    $("#more").css({
                        visibility: "visible"
                    });
                }
                infiniteScroll();
            }
        });
    });

    $("#more").on("click", function() {
        getMore();
    });

    function getMore() {
        $.ajax({
            url: nextUrl,
            method: "GET",

            success: function(response) {
                response = response.artists || response.albums;

                console.log("moreButton response: ", response);

                //Results-Html - Create and insert
                $("#results-container").append(getResultsHtml(response));

                nextUrl = setNextUrl(response);

                if (response.next == null || response.items.length < 20) {
                    hideMoreButton();
                }

                infiniteScroll();
            }
        });
    }

    function getResultsHtml(response) {
        var myHtml = "";
        var myImage = "";
        var myName = "";
        var imgUrl =
            "/Users/martinpaul/Desktop/WORKING_msg-code/Spotify Search/default.jpg";
        for (var i = 0; i < response.items.length; i++) {
            if (response.items[i].images[0]) {
                imgUrl = response.items[i].images[0].url;
            }

            myName =
                "<a id='link' href='" +
                response.items[i].external_urls.spotify +
                "'>" +
                "<div class='artistName'>" +
                response.items[i].name +
                "</div>" +
                "</a>";

            myImage =
                "<a href='" +
                response.items[i].external_urls.spotify +
                "'>" +
                "<img class='image' src='" +
                imgUrl +
                "'/>" +
                "</a>";

            myHtml += "<div class='result'>" + myImage + myName + "</div>";
        }
        return myHtml;
    }

    function setNextUrl(respNext) {
        var nextUrlInside =
            respNext.next &&
            respNext.next.replace(
                "api.spotify.com/v1/search",
                "elegant-croissant.glitch.me/spotify"
            );

        return nextUrlInside;
    }

    function hideMoreButton() {
        $("#more").css({
            visibility: "hidden"
        });
    }

    function infiniteScroll() {
        if (location.search == "?scroll=infinitely") {
            hideMoreButton();

            checkScroll();
        }
    }

    function checkScroll() {
        var hasReachedEnd = $(document).scrollTop() + $(window).height();

        if ($(document).height() - hasReachedEnd <= 200) {
            getMore();
        } else {
            setTimeout(checkScroll, 500);
        }
    }
})();
