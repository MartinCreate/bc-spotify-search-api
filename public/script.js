(function() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
    ///////////////////////// ^ DO NOT TOUCH - SETUP CODE ^ /////////////////////////

    var nextUrl;

    $("#submit-btn").on("click", function() {
        var userInput = $("input[name=user-input]").val();
        var dropdownSelectVal = $("select").val();
        var baseURL = "https://elegant-croissant.glitch.me/spotify";

        hideMoreButton();

        $.ajax({
            url: baseURL,
            method: "GET",
            data: {
                query: userInput,
                type: dropdownSelectVal
            },
            success: function(response) {
                response = response.albums || response.artists;

                //Message for results found/not found
                var resultsPresent;
                if (response.items.length == 0) {
                    resultsPresent = "No results found for " + $("input").val();
                } else {
                    resultsPresent = "Results for: " + $("input").val();
                }
                $(".resultsFound").html(resultsPresent);

                //Handlebar Results-Html - Create and insert
                var myHtmlString = Handlebars.templates.handleB(response);
                $("#resultsContainer").html(myHtmlString);

                //Next Url, for MoreButton/infinite scroll
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

                //Handlebar Results-Html - Create and insert
                var myHtmlString = Handlebars.templates.handleB(response);
                $("#resultsContainer").append(myHtmlString);

                //Next Url, for MoreButton/infinite scroll
                nextUrl = setNextUrl(response);
                if (response.next == null || response.items.length < 20) {
                    hideMoreButton();
                }

                infiniteScroll();
            }
        });
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
