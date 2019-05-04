// Grab the articles as a json
// window.onload = function() {
//   let $articles = $("#articles");
//    // Get the articles
//   $.ajax({
//     type: "GET",
//     url: "/articles"
//   })
//   .then(function(data) {  // update the articles shown
//     $articles.empty();
//     for (var i=0; i<data.length; i++) {
//       $articles.append(articleCard(data[i]));
//     }
//   })

// }

// // Click scrape button function
// $(document).on("click", "#scrape", function() {
//   // Run a GET request to scrape the articles
//   $.ajax({
//     method: "GET",
//     url: "/scrape",
//   })
//     .then(function(msg) {
//       alert(msg);
//       // location.reload();
//     // })
//     // .then(function() {
      
//       // $.ajax({
//       //   method: "GET",
//       //   url: "/articles",
//       // })
//       // .then(function(data) {
//       //   let $articles = $("#articles");
//       //   $articles.empty();
//       //   for (var i=0; i<data.length; i++) {
//       //     $articles.append(articleCard(data[i]));
//       //   }
//       // })
//     });

//   // // Also, remove the values entered in the input and textarea for note entry
//   // $("#titleinput").val("");
//   // $("#bodyinput").val("");
// });


// Whenever someone clicks an h3 tag
$(document).on("click", "h3", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      let titleStr = `
        <h2>${data.title}</h2>
        <input id='titleinput' name='title' >
        <textarea id='bodyinput' name='body'></textarea>
        <button data-id=${data._id} id='savenote'>Save Note</button>
      `;

      $("#notes").append(titleStr);

      // If there are notes in the article, provide links to them for viewing and editing
      if (data.notes.length > 0) {
        let noteTitleStr = "";
        data.notes.forEach((n) => {
          noteTitleStr += `<h4>${n.title}</h4>`
        })

        console.log(noteTitleStr);
        $("#notes").prepend(noteTitleStr);
        // // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // // Place the body of the note in the body textarea
        // $("#bodyinput").val(data.note.body);
      }
    });
});



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


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