// FIREBASE IMPORT
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, ref, onValue , set, query, orderByChild, get, child } from
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


//////////////////////////////////////////////////



const explorePage = Vue.createApp({ 
    data() { 
        return { 
            curr_display_events: [],
            all_display_events: '',
            db_events: '', // this stores all events extracted from db
            userInfo: '',
            sorted_events_by_type: null,
            sorted_events_by_fees: null,
            sorted_events_by_date: null,

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
            this.userInfo = data.user1.user_profile_info
            console.log(this.userInfo);
            console.log("-------end user  mounted------");
        })

        // display events converted to list
        get(query(allEvents, orderByChild("type"))).then((snapshot) => {
            let events = []
            snapshot.forEach(childSnapshot => {
                events.push(childSnapshot.val())
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
                sort_type.push(childSnapshot.val())
            })
            this.sorted_events_by_type = sort_type
        })

        // events sorted by fees
        get(query(allEvents, orderByChild("fees"))).then((snapshot) => {
            let sort_fees = []
        
            snapshot.forEach(childSnapshot => {
                sort_fees.push(childSnapshot.val())
            })
            this.sorted_events_by_fees = sort_fees
        })

        // events sorted by start date
        get(query(allEvents, orderByChild("date"))).then((snapshot) => {
            let sort_date = []
        
            snapshot.forEach(childSnapshot => {
                sort_date.push(childSnapshot.val())
            })
            this.sorted_events_by_date = sort_date
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

    },

    methods: {
    
        paginate (events){
            console.log(events);

            console.log(this.number_of_pages);
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

        // filter works, to be completed
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


            // check if user selected any clubs to filter and if they did, extract those events
            if (this.filter_club.length > 0) {
                
                for (let event of all_events) {
                    // console.log(event);

                    if (this.filter_club.includes(event.club)) {
                        

                        old_filtered_arr.push(event)
                    }
                }
            }
            
            // check if user selected any event types to filter and if they did, extract those events
            if (this.filter_event_type.length > 0) {

                let use_db_events = old_filtered_arr.length == 0 ? all_events : old_filtered_arr
                
                // console.log(use_db_events);
                
                for (let event of use_db_events) {
                    
                    if (this.filter_event_type.includes( event.type )) {
                        // console.log(details);
                        
                        
                        new_filtered_arr.push(event)
                        // console.log(new_filtered_obj);
                    }
                }
                old_filtered_arr = new_filtered_arr
            }
            
    
            new_filtered_arr = []

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

            new_filtered_arr = []


             // check if user selected any date to filter and if they did, extract those events
            let filter_start_date_obj = new Date(this.filter_start_date)
            let filter_end_date_obj = new Date(this.filter_end_date)

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
            else {
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
