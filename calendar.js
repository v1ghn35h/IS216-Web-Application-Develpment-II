document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listYear'
    },

    displayEventTime: true, // don't show the time column in list view

    // API Key
    googleCalendarApiKey: 'AIzaSyBLxGXn-ZzMfSKIobD-6C4chf4qI8XXRn8',

    // Events
    eventSources: [
      {
        googleCalendarId:'d55701d01ba1038768a0a98fba868aab7e3ce8954f4a78a63d4970026c34d4a2@group.calendar.google.com',
        className: 'Adventure',
        color: '#ffb700' // orange
      },
      {
        googleCalendarId:'7a9df4f985d4443d3711619daf830984c0382e2b7dc9f2a3af052d96347fe077@group.calendar.google.com',
        className: 'Arts & Culture',
        color: '#ffc2d1' // pink
      },
      {
        googleCalendarId:'bfbe99ec974a40336137e144b240bc6c0638f50120390e989db68dbaf6febc83@group.calendar.google.com',
        className: 'Community',
        color: '#ffd81a' // yellow
      },
      {
        googleCalendarId:'34e6e342a1a4f0fac2dc4c3b018d8fc49fc4408fe7c339767f56732c7759407c@group.calendar.google.com',
        className: 'Global Culture',
        color: '#ecbcfd' // purple
      },
      {
        googleCalendarId:'835cd39d1fefa4b47d0967c3049bd4e68676f5f08143e14dbd42ec97f0e9237e@group.calendar.google.com',
        className: 'School Society',
        color: '#adc178' // green
      },
      {
        googleCalendarId:'f10659566b954502d50d0e59720982c28b6a17ffe79492e393cf6fb4566be0c2@group.calendar.google.com',
        className: 'Sports',
        color: '#01497c' // dark blue
      },
      {
        googleCalendarId:'432fd38ca06006129addbc65d3ec1bc80260681f26bffed41e5e69d5c822ad57@group.calendar.google.com',
        className: 'Student Bodies',
        color: '#8ecae6' // light blue
      },
    ],

    eventClick: 
  
      function(arg) {

        // opens events in a popup window
        window.open(arg.eventSources.url, '_blank', 'width=700,height=600');

        // prevents current tab from navigating
        arg.jsEvent.preventDefault();
      }

  });

  calendar.render();
});