let $displayArticles = $("#disp-articles");

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
      data.forEach(a => {
        $displayArticles.append(articleCard(a))
      });

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
const articleCard = (data) => {
  let htmlStr =  `
      <article data-id=${data._id} class="article-card">
      <h3 data-id=${data._id}>${data.title}</h3>
      <a data-id=${data._id} href="${data.link}">Read Article</a>
      <hr>
      </article>
      `;
  return(htmlStr);
}