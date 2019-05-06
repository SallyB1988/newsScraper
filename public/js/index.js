window.onload = function() {
  $.ajax({
    headers: {
      "Content-Type": "application/json"
    },
    type: "GET",
    url: "/articles"
    })
    .then(function (data) {
       res.send(data);
    })
}

// Click scrape button function
$(document).on("click", "#scrape", function() {
  // Run a GET request to scrape the articles
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .then(function(msg) {
      // alert(msg);
      location.reload();
    });
});

// Click saved button function - this could be done better!
$(document).on("click", "#btn-saved", function() {
      location.replace("/saved")
});


