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
      
            display_events: '',
            db_events: '', // this stores all events extracted from db
            userInfo: '',
            sorted_events_by_type: null,
            sorted_events_by_fees: null,
            sorted_events_by_date: null,

            //sort inputs
            sort_by: '',

            //filter inputs
            filter_club: [],
            filter_event_type: [],
            filter_start_date: null,
            filter_end_date: null,
            filter_min_price: null,
            filter_max_price: null,

            selected_badge: '',

        };
    }, // data
 
    beforeMount() { 
        console.log("====Function-GETALLEVENTS===")
        onValue(allEvents, (snapshot) => {
            const data = snapshot.val()
            console.log("-------In event mounted------");
            console.log(data);
            this.db_events = data
            this.display_events = data
            // console.log(this.display_events);

            console.log("-------end event mounted------");
        })


        onValue(users, (snapshot) => {
            const data = snapshot.val()
            console.log("-------In user mounted------");
            console.log(data);
            this.userInfo = data.user1.user_profile_info
            console.log(this.userInfo);
            console.log("-------end user  mounted------");
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

        remove_filter_badge(value) {
            console.log(value);
            let index = this.filter_club.indexOf(value)

            this.filter_club.splice(index, 1)
            this.filter_events()
        },

        filter_events() {
            console.log("====Function-filter_events()===")

            console.log(this.db_events);
            let all_events= this.db_events

            let old_filtered_obj = {}
            let new_filtered_obj = {}

            this.selected_badge = ''


            // check if user selected any clubs to filter and if they did, extract those events
            if (this.filter_club.length > 0) {
                for (let [event, details] of Object.entries(all_events)) {
                    if (this.filter_club.includes(details.club)) {
                        old_filtered_obj[event] = details
                    }
                }
            }
            
            // check if user selected any event types to filter and if they did, extract those events
            if (this.filter_event_type.length > 0) {

                let use_db_events = Object.keys(old_filtered_obj).length == 0 ? all_events : old_filtered_obj
                
                // console.log(use_db_events);
                
                for (let [event, details] of Object.entries(use_db_events)) {
                    
                    if (this.filter_event_type.includes( details.type )) {
                        // console.log(details);
                        
                        new_filtered_obj[event] = details
                        // console.log(new_filtered_obj);
                    }
                }
                old_filtered_obj = Object.assign({}, new_filtered_obj)
            }
            
    
            new_filtered_obj = {}

            // console.log(old_filtered_obj);
            
            // check if user selected any price to filter and if they did, extract those events
            if (this.filter_min_price != null || this.filter_max_price != null) {

                let use_db_events = Object.keys(old_filtered_obj).length == 0 ? all_events : old_filtered_obj

                for (let [event, details] of Object.entries(use_db_events)) {
       
                    let event_price = details.fees
                    

                    if (this.filter_min_price != null && this.filter_max_price == null && event_price >= this.filter_min_price) {
                        new_filtered_obj[event] = details
                    }
                    else if (this.filter_max_price != null && this.filter_min_price == null && event_price <= this.filter_max_price) {
                        new_filtered_obj[event] = details
                    }
                    
                    else if (event_price >= this.filter_min_price && event_price <= this.filter_max_price) {
                        // console.log("im here");
                        new_filtered_obj[event] = details
                        
                    }
                }
                old_filtered_obj = Object.assign({}, new_filtered_obj)
            }

            new_filtered_obj = {}
            

            this.display_events = old_filtered_obj


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
                this.display_events = this.sorted_events_by_type
            }
            else if (this.sort_by == "fees") {
                this.display_events = this.sorted_events_by_fees
            }
            else if (this.sort_by == "date") {
                this.display_events = this.sorted_events_by_date
            }

            console.log("====FunctionEND-sort_events()===")
        }

  
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
//     <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
//         <a href="">
//             <div class="card-flyer">
//                 <div class="text-box">
//                     <div class="image-box">
//                         <img :src="photo" alt="" />
//                     </div>
//                     <div class="text-container">
//                         <h5 class="card-title"> {{ name }} </h5>  
//                         <!-- SUBTITLE -->
//                         <h6 class="card-subtitle mb-2 "> {{ club }} </h6>
//                         <!-- BODY -->
//                         <p class="card-text text-wrap">
//                             Date: {{ date }}
//                             <br>
//                             Time: {{ time }}
//                             <br>
//                             Fees: {{ fees }}
//                             <br>
//                             Location: {{ location }}
//                         </p>
//                         <!-- sign up button-->
//                         <div>
//                             <button type="button" class="btn signup-btn mt-3" data-bs-target="#SignUpPage" data-bs-toggle="modal">Sign up now</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </a>
//     </div>`
// });
// component must be declared before app.mount(...)
