// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, onValue , set, query, orderByChild, get, child, update } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";

//////////////////////////////////////////////////
// FIREBASE VARIABLES
const firebaseConfig = {
  apiKey: "AIzaSyC_sRHAqy76KR30qWRWTT1HjahFEN0IN4Q",
  authDomain: "calendaready-g7t7.firebaseapp.com",
  databaseURL: "https://calendaready-g7t7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "calendaready-g7t7",
  storageBucket: "calendaready-g7t7.appspot.com",
  messagingSenderId: "544037155570",
  appId: "1:544037155570:web:c7e3ca7a1c55beaea8966b",
  measurementId: "G-03K9PHBX7D"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const users = ref(db, 'users') 
// const clubs = ref(db, 'clubs')
const allEvents = ref(db, 'events')
import ResolvedUID from "./login-common.js";
let current_user = ResolvedUID

//////////////////////////////////////////////////



const explorePage = Vue.createApp({ 
    data() { 
        return { 
            curr_display_events: [],
            all_display_events: '',
            db_events: '', // this stores all events extracted from db
            userInfo: '',
            userInfo: '',
            current_user: current_user,
            sorted_events_by_type: null,
            sorted_events_by_fees: null,
            sorted_events_by_date: null,

            bookmarked_events: [],
            bookmark_active: false,

            // search bar
            search_input_value: '',

            //sort inputs
            sort_by: '',

            //filter inputs
            filter_club: [],
            filter_event_type: [],
            filter_start_date: new Date().toISOString().slice(0,10),
            filter_end_date: null,
            filter_min_price: null,
            filter_max_price: null,

            selected_badge: '',

            // pagination
            number_of_events: 0,
            current_page: 1,
            number_of_pages: 0,

        };
    }, // data
 
    beforeMount() { 
        console.log("====Function-GETALLEVENTS===")
        // onValue(allEvents, (snapshot) => {
        //     let events = []
        //     const data = snapshot.val()
        //     console.log("-------In event mounted------");
        //     console.log(data);
        //     this.db_events = data
        //     this.display_events = data
        //     // console.log(this.display_events);

        //     console.log("-------end event mounted------");
        // })


        onValue(users, (snapshot) => {
            const data = snapshot.val()
            console.log("-------In user mounted------");
            console.log(data);

            console.log(data[current_user]);
            this.userInfo = data[current_user]['user_profile_info']
            console.log(this.userInfo);
            console.log("-------end user  mounted------");
        })

        // display events converted to list
        get(query(allEvents, orderByChild("date"))).then((snapshot) => {
            let events = []
            snapshot.forEach(childSnapshot => {
                // events.push(childSnapshot.val())
                let event = childSnapshot.val()
                let event_date = new Date(event.date)

                if (this.check_date(event_date)) {
                    events.push(event)
                }
            })
            this.db_events = events

            this.all_display_events = this.db_events
            // console.log(this.all_display_events);

            this.paginate(this.all_display_events)
            // this.all_display_events = this.db_events.slice(0,12)
            // console.log(this.all_display_events)
            // this.number_of_pages = (this.db_events.length)/12
            // console.log(this.number_of_pages)
        })


        // events sorted by type
        get(query(allEvents, orderByChild("type"))).then((snapshot) => {
            let sort_type = []
        
            snapshot.forEach(childSnapshot => {
                
                let event = childSnapshot.val()
                let event_date = new Date(event.date)

                if (this.check_date(event_date)) {
                    sort_type.push(event)
                }

                // console.log(childSnapshot.val());
            })
            this.sorted_events_by_type = sort_type
        })

        // events sorted by fees
        get(query(allEvents, orderByChild("fees"))).then((snapshot) => {
            let sort_fees = []
        
            snapshot.forEach(childSnapshot => {
                // sort_fees.push(childSnapshot.val())
                let event = childSnapshot.val()
                let event_date = new Date(event.date)

                if (this.check_date(event_date)) {
                    sort_fees.push(event)
                }
                
            })
            this.sorted_events_by_fees = sort_fees
        })

        // events sorted by start date
        get(query(allEvents, orderByChild("date"))).then((snapshot) => {
            let sort_date = []
        
            snapshot.forEach(childSnapshot => {
                let event = childSnapshot.val()
                let event_date = new Date(event.date)

                if (this.check_date(event_date)) {
                    sort_date.push(event)
                }


            })
            this.sorted_events_by_date = sort_date
        })

        // bookmarked events
        get(query(allEvents, orderByChild("isBookmarked"))).then((snapshot) => {
            let bkMarked_events = []
        
            snapshot.forEach(childSnapshot => {
                let event = childSnapshot.val()
                
                if (event.isBookmarked) {
                    bkMarked_events.push(event)
                }


            })
            this.bookmarked_events = bkMarked_events
        })

        

    }, // beforeMount

    computed: {

        //get all event type clubs
        event_types() {
            let all_event_types = []

            for (let [event, details] of Object.entries(this.db_events)) {
                // if (!this.organising_clubs.includes[details.club]) {
                //     this.organising_clubs.push(details.club)
                // }
                if (!all_event_types.includes[details.type]) {
                    // console.log(all_event_types);
                    all_event_types.push(details.type)
                }
            }
            return  [...new Set(all_event_types)]
        },

        //get all organising clubs
        all_clubs() {
            let organising_clubs = []

            for (let [event, details] of Object.entries(this.db_events)) {
                // if (!this.organising_clubs.includes[details.club]) {
                //     this.organising_clubs.push(details.club)
                // }
                if (!organising_clubs.includes[details.club]) {
                    // console.log(organising_clubs);
                    organising_clubs.push(details.club)
                }
            }
            return  [...new Set(organising_clubs)]
        },

        // bookmarked_events() {
        //     get(query(allEvents, orderByChild("isBookmarked"))).then((snapshot) => {
        //         let bkMarked_events = []
            
        //         snapshot.forEach(childSnapshot => {
        //             let event = childSnapshot.val()
                    
        //             if (event.isBookmarked) {
        //                 bkMarked_events.push(event)
        //             }
    
    
        //         })
        //         this.bookmarked_events = bkMarked_events
        //     })
        //     // return this.bookmarked_events
        // }

        // bookmarked_events() {
        //     let bookmarked_events = []

        //     onValue(users, (snapshot) => {
        //         const data = snapshot.val()
        //         console.log("-------In user mounted------");
        //         console.log(data);
        //         let db_bkmark_events = data.user1.user_bkmark_events

        //         for (let [event, details] of Object.entries(db_bkmark_events)) {
        //             bookmarked_events.push(details)
        //         }
        //         console.log(bookmarked_events);
        //         console.log("-------end user  mounted------");
        //     })
        //     return bookmarked_events
        // }
    

    },

    methods: {

        show_bkmarked_events() {
            console.log(this.bookmarked_events);

            if (!this.bookmark_active) { 


                this.all_display_events = this.bookmarked_events
                this.bookmark_active = true
                document.getElementById("bkmark_btn").style.backgroundColor = "#104547"
                document.getElementById("bkmark_btn").style.color = "white"
            }
            else {
                this.all_display_events = this.db_events
                this.bookmark_active = false
                document.getElementById("bkmark_btn").style.backgroundColor = "#f7f7f7"
                document.getElementById("bkmark_btn").style.color = "#104547"
                document.getElementById("bkmark_btn").style.borderColor = "#104547"
            }

            this.paginate(this.all_display_events)
        },

        bookmark_event(event, details) {
            console.log("====Function-bookmark_event()===")
            console.log(details);
            console.log(event);
            console.log(details.eventId);
            console.log(details.isBookmarked);
            


            // this.addBkMarkEvent(details.club, details.date, details.eventId, details.fees, details.location, details.name, details.photo, details.time, details.type)
            let new_bkmark_val = !details.isBookmarked
            // console.log(btn);
            this.updateBkMarkEvent(details.eventId, new_bkmark_val)

            // instead of reloading the page, the cards is bkmarked/un bkmarked
            get(query(allEvents, orderByChild("date"))).then((snapshot) => {
                let events = []
                snapshot.forEach(childSnapshot => {
                    // events.push(childSnapshot.val())
                    let event = childSnapshot.val()
                    let event_date = new Date(event.date)
    
                    if (this.check_date(event_date)) {
                        events.push(event)
                    }
                })
                this.db_events = events
    
                this.all_display_events = this.db_events
                // console.log(this.all_display_events);
    
                this.paginate(this.all_display_events)
 
            })

            get(query(allEvents, orderByChild("isBookmarked"))).then((snapshot) => {
                let bkMarked_events = []
            
                snapshot.forEach(childSnapshot => {
                    let event = childSnapshot.val()
                    
                    if (event.isBookmarked) {
                        bkMarked_events.push(event)
                    }
    
    
                })
                this.bookmarked_events = bkMarked_events
            })

            console.log("====END - Function-bookmark_event()===");
        },
        updateBkMarkEvent(eventId, isBookmark) {
            console.log("====Function-updateBkMarkEvent()===")
            update(ref(db, 'events/' + eventId), 
                    {
                        isBookmarked: isBookmark,
                     
                    },
                  )
                
            .then(() => {
                console.log('Data updated successfully!');
            })
            .catch((error) => {
                console.error(error);
            });  
              // force page to reload
            // setTimeout(function(){
            // window.location.reload();
            // }, 500);
          },
    
        paginate (events){
            console.log(events);

            console.log(this.number_of_pages);

            if (events.length == 0) {
                alert("No events found")
            }
            
            if (events.length > 12) {
                this.number_of_pages = (events.length)/12
            }
            else {
                this.number_of_pages = 1
            }
            console.log(this.number_of_pages);
            
            if (this.number_of_pages > 1) {
                // this.number_of_pages = Math.ceil(this.number_of_pages)
                this.curr_display_events = events.slice(0,12)
                console.log(this.curr_display_events)
                console.log(this.number_of_pages)
            }

            else {
                this.curr_display_events = events
                console.log(this.curr_display_events)
            }
        },
        
        pagination_next(events){
            if (this.current_page < this.number_of_pages) {

                let lower_limit = (this.current_page - 1) * 12 + 12
                this.current_page += 1

                let upper_limit = (this.current_page - 1) * 12 + 12
                this.curr_display_events = events.slice(lower_limit, upper_limit)
            }
        },
        
        pagination_prev(events){
            let upper_limit = (this.current_page - 1) * 12
            this.current_page -= 1
            let lower_limit = (this.current_page - 1) * 12
            this.curr_display_events = events.slice(lower_limit, upper_limit)
        },

        check_date(date){
            let current_date = new Date()
            let e_date = new Date(date)
            return e_date > current_date
        },

        addEvent(name, club, photo, date, location, time, type, id) {
            const dbRef = ref(getDatabase());

                  set(ref(db, 'users/' + this.current_user + '/user_events/event_' + id), 
                    {
                        title: name,
                        start: this.formatting_start_date(date, time),
                        end: this.formatting_end_date(date, time),
                        category: type,
                        id: id,
                        event_club: club,
                        photo_url: photo,
                        event_date: date,
                        event_location: location,
                        event_time: time,
                    },
                  )
                
                .then(() => {
                    console.log('Data updated successfully!');
                })
                .catch((error) => {
                console.error(error);
              });  
              // force page to reload
              setTimeout(function(){
                window.location.reload();
              }, 500);
          },


        formatting_start_date(date, time){
        let split_time = time.split("-");
        let start_time = split_time[0]
        let calendar_start_time = start_time.slice(0,2) + ":" + start_time.slice(2,5) + ":00"
        let final_start = date+"T"+calendar_start_time
        return final_start
        },
        
        formatting_end_date(date, time){
        let split_time = time.split("-");
        let end_time = split_time[1]
        let calendar_end_time = end_time.slice(0,2) + ":" + end_time.slice(2,5) + ":00"
        let final_end = date+"T"+calendar_end_time
        return final_end
        },

        format_date(date) {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            let date_obj = new Date(date)
            let day = date_obj.getDate()
            let month = months[date_obj.getMonth()]
            let year = date_obj.getFullYear()
            let date_formatted = day + " " + month + " " + year
            return date_formatted
        },

        search_input() {
            let searched_events = []

            let all_events= this.db_events

            for (let event of all_events) {
                if (event.name.toLowerCase().includes(this.search_input_value.toLowerCase())) {
                    searched_events.push(event)
                }

                if (event.club.toLowerCase().includes(this.search_input_value.toLowerCase())) {
                    searched_events.push(event)
                }

                if (event.type.toLowerCase().includes(this.search_input_value.toLowerCase())) {
                    searched_events.push(event)
                }
            }
            this.all_display_events = searched_events
            // console.log(this.all_display_events);
            this.paginate(this.all_display_events)
        },

        filter_events() {
            console.log("====Function-filter_events()===")

            console.log(this.db_events);
            let all_events= this.db_events

            let old_filtered_arr = []
            let new_filtered_arr = []

            this.selected_badge = ''

            console.log(this.filter_event_type);
            console.log(this.filter_club);


            // check if user selected any clubs to filter and if they did, extract those events
            if (this.filter_club.length > 0) {
                
                for (let event of all_events) {
                    // console.log(event);

                    if (this.filter_club.includes(event.club)) {
                        

                        old_filtered_arr.push(event)
                    }
                }
                console.log(old_filtered_arr);
            }
            // console.log(old_filtered_arr);
            
            // check if user selected any event types to filter and if they did, extract those events
            if (this.filter_event_type.length > 0) {

                let use_db_events = old_filtered_arr.length == 0 ? all_events : old_filtered_arr
                
                console.log(use_db_events);
                
                for (let event of use_db_events) {

                    
                    console.log(event);
                    if (this.filter_event_type.includes( event.type )) {
                        console.log(event.type);
                        
                        new_filtered_arr.push(event)
                    }
                }
                console.log(new_filtered_arr);
                old_filtered_arr = new_filtered_arr
            }
            
            new_filtered_arr = []
            console.log(old_filtered_arr);
            console.log(new_filtered_arr);

            // check if user selected any date to filter and if they did, extract those events
            let filter_start_date_obj = new Date(this.filter_start_date)
            let filter_end_date_obj = new Date(this.filter_end_date)
            let today = new Date().toISOString().slice(0, 10)

            if (this.filter_end_date != null) {
            
                let use_db_events = old_filtered_arr.length == 0 ? all_events : old_filtered_arr

              
                for (let event of use_db_events) {
                    let event_date = event.date
                    let event_date_obj = new Date(event_date)

                    if ( event_date_obj >= filter_start_date_obj && event_date_obj <= filter_end_date_obj) {
                    
                        new_filtered_arr.push(event)
                    }
                }
                
                old_filtered_arr = new_filtered_arr
            }
            else if (this.filter_start_date != today) {
                let use_db_events = old_filtered_arr.length == 0 ? all_events : old_filtered_arr

                for (let event of use_db_events) {
                    let event_date = event.date
                    let event_date_obj = new Date(event_date)

                    if ( event_date_obj >= filter_start_date_obj) {
                        
                        new_filtered_arr.push(event)
                    }
                }
    
                old_filtered_arr = new_filtered_arr
            }

            new_filtered_arr = []
            console.log(old_filtered_arr);
            console.log(new_filtered_arr);


            // check if user selected any price to filter and if they did, extract those events
            if (this.filter_min_price != null || this.filter_max_price != null) {

                let use_db_events = old_filtered_arr.length == 0 ? all_events : old_filtered_arr

                for (let event of use_db_events) {
       
                    let event_price = event.fees
                    

                    if (this.filter_min_price != null && this.filter_max_price == null && event_price >= this.filter_min_price) {
                        
                        new_filtered_arr.push(event)
                    }
                    else if (this.filter_max_price != null && this.filter_min_price == null && event_price <= this.filter_max_price) {
            
                        new_filtered_arr.push(event)
                    }
                    
                    else if (event_price >= this.filter_min_price && event_price <= this.filter_max_price) {

                        new_filtered_arr.push(event)
                        
                    }
                }
                old_filtered_arr = new_filtered_arr
            }



             

            console.log(old_filtered_arr);
            this.all_display_events = old_filtered_arr
            this.paginate(this.all_display_events)


            // add filter badges to display below search bar
            for (let club of this.filter_club) {
                this.selected_badge += `
                <span class="badge filter_badge">
                    ${club}     
                </span>
                `
            }
            for (let type of this.filter_event_type) {
                this.selected_badge += `
                <span class="badge filter_badge">
                    ${type}
                </span>
                `
            }

            console.log("====FunctionEND-filter_events()===")
            
        },

        sort_events() {
            console.log("====Function-sort_events()===")
            
            if (this.sort_by == "event") {
                this.all_display_events = this.sorted_events_by_type
            }
            else if (this.sort_by == "fees") {
                this.all_display_events = this.sorted_events_by_fees
            }
            else if (this.sort_by == "date") {
                this.all_display_events = this.sorted_events_by_date
            }

            this.paginate(this.all_display_events)

            console.log("====FunctionEND-sort_events()===")
        },

        clear_selections() {
            this.filter_club = []
            this.filter_event_type = []
            this.filter_min_price = null
            this.filter_max_price = null
            this.filter_start_date = new Date().toISOString().slice(0,10),
            this.filter_end_date = null
            this.selected_badge = ''

            this.sort_by = undefined        

            this.all_display_events = this.db_events
            this.paginate(this.all_display_events)
        },



  
    } 
});

const vm = explorePage.mount('#explorePage'); 

// ======================================couldnt figure out component
// explorePage.component('anEvent', { 

//     props: [ 'name', 'club', 'date', 'time', 'fees', 'location', 'photo' ],

//      // props
    
//     data() {
        
//     }, // data
    
//     methods: {
//         methodName() {
            
//         }
//     }, // methods
    
//     template: `
//     <div class="card-flyer" :id="">
//         <div class="text-box" style ="height: 412px">
//             <div class="image-box">
//                 <img :src="photo" />
//             </div>
//             <div class="text-container">

//                 <h5 class="card-title"> {{ name }} </h5>
//                 <!-- SUBTITLE -->
//                 <h6 class="card-subtitle mb-2 "> {{ club }} </h6>
//                 <!-- BODY -->
//                 <p class="card-text text-wrap">
//                     Date: {{ date }}
//                     <br>
//                     Time: {{ time }}
//                     <br>
//                     <span v-if='details.fees == 0'> Fees: Free </span> 
//                     <span v-else> Fees: {{ fees }} SGD </span> 
                    
//                     <br>
//                     Location: {{ location }}
//                 </p>
                
//             </div>
//         </div>

//         <div style="display:flex; align-content: flex-start; margin: 0px 15px 30px 15px;">
//         <button type="button" class="btn details-btn mt-1 " :data-bs-target=""
//             data-bs-toggle="modal">More info</button>
//     </div>
// </div>`
// });

// component must be declared before app.mount(...)
