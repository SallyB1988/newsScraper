// let $displayArticles = $("#disp-articles");

window.onload = function() {
  $.ajax({
    headers: {
      "Content-Type": "application/json"
    },
    type: "GET",
    url: "/articles"
    })
    .then(function (data) {
      // var articles = data.articles;
      // data.forEach(a => {
      //   $displayArticles.append(articleCard(a))
      // });
      res.send(data);
    })
    // can do another function if I want
    // .then(function () {
    //   $.ajax({
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     type: "GET",
    //     url: "/api/charts"
    //     })
    //     .then(function (data) {
    //       if (chart1) { chart1.destroy(); }
    //       if (chart2) { chart2.destroy(); }
    //       chart1 = createChart(data.cLabels, data.cData, 'country-chart');
    //       chart2 = createChart(data.dLabels, data.dData, 'disaster-chart');
    //     })
    // })
}

// $eventsDisplay.on("click", ".listed-event", function(event) {
//   $moreInfoDisplay.html($(this).attr("data-desc"));
//   $moreInfoTitle.html($(this).attr("data-title"));
// })

/**
 * 
 * @param {*} data : Article object
 */
// const articleCard = (data) => {
//   let htmlStr =  `
//       <article data-id=${data._id} class="article-card">
//       <h3 data-id=${data._id}>${data.title}</h3>
//       <a data-id=${data._id} href="${data.link}">Read Article</a>
//       <hr>
//       </article>
//       `;
//   return(htmlStr);
// }

// Click scrape button function
$(document).on("click", "#scrape", function() {
  // Run a GET request to scrape the articles
  $.ajax({
    method: "GET",
    url: "/scrape",
  })
    .then(function(msg) {
      alert(msg);
      location.reload();
    // })
    // .then(function() {
      
      // $.ajax({
      //   method: "GET",
      //   url: "/articles",
      // })
      // .then(function(data) {
      //   let $articles = $("#articles");
      //   $articles.empty();
      //   for (var i=0; i<data.length; i++) {
      //     $articles.append(articleCard(data[i]));
      //   }
      // })
    });

  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});

// Click saved button function - this could be done better!
$(document).on("click", "#btn-saved", function() {
      location.replace("/saved")
});


