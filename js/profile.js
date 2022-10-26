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