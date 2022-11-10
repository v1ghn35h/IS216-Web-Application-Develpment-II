
// EDIT: FIREBASE ACCESS

// ----------------------------------------
// CALENDAR FIREBASE

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app1);

/* CONNECT TO DATABASE */
// Import functions needed to read from realtime database
import { getDatabase, ref, onValue, child, get, set, remove, push, update } from
"https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js"

// Connect to the realtime database
const db = getDatabase();
let current_user = "user1" // change according to user logged in

// Vue Instance
const app = Vue.createApp({
    data() {
     return {
        // numbers: [40, 25, 52, 23],
        // colors: ['#d87a80', '#ffb980', '#b6a2de', '#2ec7c9']

        //EDIT:CORRESPONDING numbers & colours BASE ON EVENTS
        numbers: [],
        colors: []

    }},

    computed: {
        get_yummy_pie() {
            var get_counts = []
            console.log("HI")
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users/${current_user}/user_events/`)).then((snapshot) => {
            if (snapshot.exists()) {
                let db_values = snapshot.val();

                console.log("===START - GET DATABASE VALUE SUCCESS====")
                console.log(db_values)
                console.log("===END - GET DATABASE VALUE SUCCESS====")

                console.log("===START - MANIPULATING DATABASE VALUE SUCCESS====")
                
                // event category counts (named: e_c_NUM_count)

                var e_c_dict = {};

                //PREVIOUSLY USED HARDCODE -> CHANGED TO DYNAMIC 
                    // //1: Arts & Culture
                    // var e_c_1_count = 0
                    // //2: Community
                    // var e_c_2_count = 0
                    // //3: Global Culture
                    // var e_c_3_count = 0
                    // //4: School Society 
                    // var e_c_4_count = 0
                    // //5: Sports
                    // var e_c_5_count = 0
                    // //6:Student Bodies 
                    // var e_c_6_count = 0
                    // //7: Academics
                    // var e_c_7_count = 0
                    // //8: Miscellaneous
                    // var e_c_8_count = 0

            for (let an_event_obj in db_values) {
                let event_obj = db_values[an_event_obj]
                let event_cat = event_obj.category
                console.log(event_obj)
                console.log('PRINTING EVENT_CAT')

                console.log(event_cat)

                if (e_c_dict.hasOwnProperty(event_cat)) {
                    e_c_dict[event_cat] += 1;
                } else {
                    e_c_dict[event_cat] = 1;
                }
                console.log('PRINTING E_C_DICT')
                console.log(e_c_dict)
                //NOTE: e_c_dict gives data like : {Adventure: 2, Sports: 4, School Society: 1, Community: 1, Arts & Culture: 1}
            }

            //check can access vue data or not
            /* colour */
            let colors_dict = {
                'Adventure': ['#ffb700', 'icons/adventure.png'], 
                'Arts & Culture': ['#ffc2d1', 'icons/artsculture.png', ''],
                'Community': ['#ffd81a', 'icons/community.png'],
                'Global Culture': ['#ecbcfd', 'icons/globalculture.png'],
                'School Society': ['#adc178', 'icons/schoolsociety.png'],
                'Sports': ['#01497c', 'icons/sports.png'],
                'Student Bodies': ['#8ecae6', 'icons/studentbodies.png']
            }
            console.log(colors_dict)

            // create list of colours to use for piechart base on what events there are
            let event_keys = Object.keys(e_c_dict);
            let event_values = Object.values(e_c_dict);
            console.log("THIS IS events type present")
            console.log(event_keys)
            console.log(event_values)
            //NOTE: event_keys give data of event types used like: ['Adventure', 'Sports', 'School Society']
            //getting colours to match

            var color_list = []
            for (let event_cat of event_keys) {
                console.log("this is event_cat :"+event_cat)
                let color_code = colors_dict[event_cat][0]
                console.log("this is event_cat_colour :"+colors_dict[event_cat][0])
                color_list.push(color_code)
                
                // color_list.JSON.parse(color_list)
                // Array.from(color_list);



            }
            let color_list1 = Array.from(color_list)
            console.log(color_list1)
            console.log(Object.prototype.toString.call(color_list))

            this.colors = color_list1
            this.numbers = event_values
            // NOTE: color_list give list of color codes used like: ['#ffb700', '#01497c', '#adc178']
            
            console.log("===END - MANIPULATING DATABASE VALUE SUCCESS====")
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });
        }
    }

})
  
    const SCALE = 0.1
    app.component('pie-chart', {
        template: `#pie-chart`,
        props: {
            numbers: {
                type: Array,
                required: true
            },
            colors: {
                type: Array,
                required: true
            },
            radius: {
                type: Number,
                default: 46
            },
            // 邊框寬度(border width)
            strokeWidth: {
                type: Number,
                default: 8
            }
        },

        data() {
         return {
            temp: ''
        }},

        computed: {

            total() {
                return this.numbers.reduce((prev, cur) => prev + cur, 0)
            },
            percentage() {
                const temp = []
                for (const num of this.numbers) {
                temp.push(this.total ? num / this.total : 0)
                }
                return temp
            },
            // 圓心位置
            center() {
                return (this.radius + this.strokeWidth / 2) * (1 + 2 * SCALE)
            },
            // 圓周長
            circumference() {
                return 2 * this.radius * Math.PI
            }
        },
        methods: {
            handleMouseenter(index) {
                // innerRadius = radius - strokeWidth / 2
                // (newWidh - strokeWidth) / 2 = diff
                // diff / (innerRadius - diff) = SCALE
                const diff = (this.radius - this.strokeWidth / 2) * SCALE / (1 + SCALE)
                const width = diff * 2 + this.strokeWidth
                this.$ref["circle1"].style.cssText = `
                opacity: 0.8;
                stroke-width: ${width};
                transform: scale(${1 + SCALE});
                `
                this.temp = (this.percentage[index] * 100).toFixed(2) + '%'
            },

            handleMouseleave(index) {
                this.$ref["circle1"].style.cssText = ''
                this.temp = ''
            }
        }
    })
    
    app.mount("#app");