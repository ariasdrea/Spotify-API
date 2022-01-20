(function () {
    var go = $("#go");
    var input = $("input");
    var select = $("select");
    var offsetStart = 0;
    var more = $("#more");

    function getMoreResults(clickGo) {
        $.ajax({
            url: "https://spicedify.herokuapp.com/spotify",
            method: "GET",
            data: {
                q: input.val(),
                type: select.val(),
                offset: offsetStart
            },
            success: function (data) {
                data = data.artists || data.albums;

                if (data.next) {
                    offsetStart += 20;
                    $("#more").show();
                } else {
                    $("#more").hide();
                }

                // IMAGES
                var resultArr = [];
                for (var i = 0; i < data.items.length; i++) {
                    var img = "default.png";
                    if (data.items[i].images[0]) {
                        img = data.items[i].images[0].url;
                    }

                    resultArr.push({
                        externalUrl: data.items[i].external_urls.spotify,
                        image: img,
                        name: data.items[i].name
                    });
                }

                if (clickGo) {
                    $(".results").html(
                        Handlebars.templates.spotifyId({
                            spotifyObj: resultArr
                        })
                    );
                } else {
                    $(".results").append(
                        Handlebars.templates.spotifyId({
                            spotifyObj: resultArr
                        })
                    );
                }

                if (!data.items.length) {
                    $(".results").html(`No results found for "${input.val()}"`);
                }

                if (location.search.indexOf("scroll=infinite") > -1) {
                    checkInfiniteScroll();
                    more.hide();
                }
            }
        });
    }

    go.on("click", function () {
        getMoreResults(true);
    });

    more.on("click", function () {
        getMoreResults();
    });

    var timeoutId;
    function checkInfiniteScroll() {
        clearTimeout(timeoutId);
        if (
            $(window).height() + $(document).scrollTop() >=
            $(document).height() - 500
        ) {
            getMoreResults();
        } else {
            timeoutId = setTimeout(checkInfiniteScroll, 1000);
        }
    }

    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function (script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
})();
