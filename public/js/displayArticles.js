let $displayArticles = $("#disp-articles");

window.onload = function() {
  // $.ajax({
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   type: "GET",
  //   url: "/articles"
  //   })
  //   .then(function (data) {
  //     data.forEach(a => {
  //       $displayArticles.append(articleCard(a))
  //     });

  //   })
}

/**
 * 
 * @param {*} data : Article object
 */
const articleCard = (data) => {
  let btnString = "";
  if (data.saved) {
    btnString = `<p>Article has been saved</p>`
  } else {
    btnString = `<button class="save-article" data-id=${data._id}>Save Article</button>`
  }

  let htmlStr =  `
  <div class="card">
    <div class="card-header">
      <h3 data-id=${data._id}>${data.title}</h3>
    </div>
    <div class="card-body">
      <p class="article-summary">${data.summary}</p>
      <div class="d-flex justify-content-between article-buttons">
        <a data-id=${data._id} href="${data.link}">Read Article</a>
        ${btnString}
      </div>
    </div>
  </div>
  `;

  return(htmlStr);
}

$(document).on("click",  ".save-article", function() {
  let id = $(this).attr("data-id");
  console.log(id);

  $.ajax({
    type: "POST",
    url: `/articles/${id}`,
    data: {
      saved: true,
    }
    })
    .then(function (data) {
      location.reload();
    })
})
