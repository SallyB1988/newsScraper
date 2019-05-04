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
  // With that done, add the note form to the page
  .then(function(data) {
    $("#disp-notes-form").empty();
    // If there are notes in the article, provide links to them for viewing and editing
    if (data.notes.length > 0) {
      let noteTitleStr = "";
      data.notes.forEach((n) => {
        noteTitleStr += `
        <div class="row">
        <div class='col-md-1'></div>
  
        <p class="col-md-9 p-0 m-0 note-titles">${n.title}</p>
        <button class="col-md-1 p-0 m-0 delete-note">X</button>
       </div>
        `
      })
  
      console.log(noteTitleStr);
      $("#disp-notes-form").append(noteTitleStr);
    }
    let notesForm = `
        <p id="note-title" class="mt-2" >${data.title}</p>
        <input id='titleinput' name='title' >
        <textarea id='bodyinput' name='body'></textarea>
        <button data-id=${data._id} id='savenote'>Add Note</button>
      `;

      $("#disp-notes-form").append(notesForm);

      //=================================================
    });
});



// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

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
