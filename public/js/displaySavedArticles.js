
let selectedArticleId;
window.onload = function() {

}

$(document).on("click", ".notes-btn", function() {
  selectedArticleId = $(this).attr("data-id");
  // Empty the notes from the note section
  refreshNotesRegion(selectedArticleId);
});


$(document).on("click", ".remove-saved-btn", function() {
  let id = $(this).attr("data-id");
  $.ajax({
    type: "POST",
    url: `/articles/${id}`,
    data: {
      saved: false,
    }
    })
    .then(function (data) {
      // var articles = data.articles;
      location.reload();
    })
  // Empty the notes from the note section
  // refreshNotesRegion(selectedArticleId);
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
    // Note added to database -- refresh the notes display
    .then(function(data) {
      // Log the response
      console.log(data);
      refreshNotesRegion(selectedArticleId);

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the updatenote button
$(document).on("click", "#updatenote", function() {
  // Grab the id associated with the article from the submit button
  var articleId = $(this).attr("data-id");
  var noteId = $(this).attr("data-note-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: `/saved/${articleId}/${noteId}`,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // Note added to database -- refresh the notes display
    .then(function(data) {
      // Log the response
      console.log(data);
      refreshNotesRegion(selectedArticleId);

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



// When you click the X to delete a note
$(document).on("click", ".delete-note", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log('deleting a note with id ' + thisId);

  // Run a DELETE request to remove the note
  $.ajax({
    method: "DELETE",
    url: "/notes/" + thisId,
  })
    // Notes Record Deleted -- refresh the Notes display
    .then(function() {
      refreshNotesRegion(selectedArticleId);
    });
});


// When you click the note title, display the note
$(document).on("click", ".existing-note-title", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log('updating a note with id ' + thisId);
  // get the note data
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId,
  })
  .then(function(noteData) {

    // the last parameter tells it that the note is being opened for editing/viewing
    refreshNotesRegion(selectedArticleId, noteData, true );
  })

});


const refreshNotesRegion = (articleId, note={  title: '', body: '' }, update=false ) => {
  $("#disp-notes-form").empty();
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
  // With that done, add the note form to the page
  .then(function(data) {
    // If there are notes in the article, display their titles and a button for deleting the note
    // Clicking on the title allows the user to update the note
    if (data.notes.length > 0) {
      let noteTitleStr = "";
      data.notes.forEach((n) => {
        noteTitleStr += `
        <div class="row">
        <div class='col-md-1'></div>
        <p class="col-md-9 p-0 m-0 existing-note-title" data-id=${n._id}>${n.title}</p>
        <button data-id=${n._id} class="col-md-1 p-0 m-0 delete-note">X</button>
        </div>
        `
      })
      
      $("#disp-notes-form").append(noteTitleStr);
    }
    $("#disp-notes-form").append(noteForm(data, note, update));
    
  });
};

const noteForm = (data, note, update) => {
  let buttonStr = 'Add Note';
  let idname = 'savenote';
  if (update) {
    buttonStr = 'Update Note';
    idname = 'updatenote';
  }
  return(
    `
    <p class="mt-2 note-title" >${data.title}</p>
    <input id='titleinput' name='title' value='${note.title}' >
    <textarea id='bodyinput' name='body'>${note.body}</textarea>
    <button data-id=${data._id} data-note-id=${note._id} id=${idname}>${buttonStr}</button>
    `
  )
}