window.onload = function() {

}

$(document).on("click", ".notes-btn", function() {
  let thisId = $(this).attr("data-id");
  console.log(thisId);
  console.log('hhahfdhsf');
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  // var thisId = $(this).attr("data-id");
  // console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {

      console.log(data);
      // return(data);

// THIS LOGIC NEEDS TO MOVE TO THE displayNotes.handlebars file

      let notesForm = `
        <h2>${data.title}</h2>
        <input id='titleinput' name='title' >
        <textarea id='bodyinput' name='body'></textarea>
        <button data-id=${data._id} id='savenote'>Save Note</button>
      `;

      $("#disp-notes-form").append(notesForm);

      // // If there are notes in the article, provide links to them for viewing and editing
      // if (data.notes.length > 0) {
      //   let noteTitleStr = "";
      //   data.notes.forEach((n) => {
      //     noteTitleStr += `<h4>${n.title}</h4>`
      //   })

      //   console.log(noteTitleStr);
      //   $("#notes").prepend(noteTitleStr);
      //   // // Place the title of the note in the title input
      //   // $("#titleinput").val(data.note.title);
      //   // // Place the body of the note in the body textarea
      //   // $("#bodyinput").val(data.note.body);
      // }
      //=================================================
    });
});



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log('saving note... ');
  console.log(thisId);
  console.log($("#titleinput").val());

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saved/" + thisId,
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
