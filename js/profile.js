$(document).ready(function() {
  $(".country").submit(function() {
      let checked = $(":checkbox:checked").length
      if (checked === 0) {
          alert("Choose at least one Country");
      } else {
          alert("Selected Countries : " + checked);
          $(".country").submit(function(e) {
              return false;
          });

      }

  });
  $(".country").submit(function(e) {
      return false;
  });
});

//////////////////////////////////////////////////
// CHANGE IMAGE
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagePreview').css('background-image', 'url('+e.target.result +')');
            $('#imagePreview').hide();
            $('#imagePreview').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }

    console.log("i'm in");
}
$("#imageUpload").change(function() {
    readURL(this);
});

function foo(){
    console.log("hello");
}