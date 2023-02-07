// This is temporary
memory = JSON.parse(localStorage.getItem("memory")) || {};

function openPage(url) {
    window.location.href = url;
}

function onLoadRedirector() {
    if(window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html' || window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/add_stats.html' || window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html#') {
        generateDropdown();
    } else if(window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/show_stats.html') {
        showStats();
    }
}

window.addEventListener('load', onLoadRedirector, false);

// Code for the dropdown
// When an element is clicked
document.addEventListener("click", e => {
    const isDropdown = e.target.matches("[data-dropdown-button]");
    if(!isDropdown && e.target.closest("[data-dropdown]") != null) {
        return;
    }
    // if the clicked element is the dropdown, toggle the active-mode.
    let currentDropdown;
    if(isDropdown) {
        currentDropdown = e.target.closest("[data-dropdown]");
        currentDropdown.classList.toggle("active");
    }

    // find all the active elements with the data-type '[data-dropdown]'. 
    // Do nothing if it is the current dropdown.
    // If it is another dropdown, close it.
    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if(dropdown === currentDropdown){
            return;
        }
        dropdown.classList.remove("active");
    })
})

function generateDropdown() {
    memory = JSON.parse(localStorage.getItem("memory"));
    let teachers = Object.keys(memory);
    for(i = 0; i < teachers.length; i++) {
        // Reference the dropdown
        if(window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html' || window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html#') {
            parentDiv = document.getElementById("dropdown-links1");
        } else {
            parentDiv = document.getElementById("dropdown-links2");
        }
        // Create an a-tag
        let newATag = document.createElement("a");
        // The a-tag some text, a class, an ID, and an onclick-event
        newATag.innerText = teachers[i];
        newATag.className = "dropdown-a-tag link";
        newATag.id = "dropdown-a-tag" + String(i);
        newATag.href = "#";
        newATag.setAttribute("onClick", "specifyTeacher(this.id)");
        // Add the a-tag to the dropdown
        parentDiv.appendChild(newATag);
    }
}

function specifyTeacher(id) {
    console.log(id);
    let currentTeacher = document.getElementById(id).innerHTML;
    localStorage.setItem("current_teacher", currentTeacher);
    if(window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html' || window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/choose_teacher.html#') {
        openPage('show_stats.html');
    } else if(window.location.href == 'https://asossosaror.github.io/track-late-teachers/html/add_stats.html') {
        document.getElementById("dropdown-btn2").innerHTML = currentTeacher;
    }
}

function showStats() {
    memory = JSON.parse(localStorage.getItem("memory"));
    currentTeacher = localStorage.getItem("current_teacher");
    console.log(currentTeacher);
    let h1 = document.getElementById("teacher-name-h1");
    h1.innerHTML = currentTeacher;
    generateChart();
    // Calculate average and median
    let stats = memory[currentTeacher];
    let average = 0;
    for(let i = 0; i < stats.length; i++) {
        average += stats[i];
    }
    average = average / stats.length;
    if(isNaN(average)) {
        average = "Inte tillräckligt mycket data."
    }
    let sorted_stats = stats.sort();
    let median = sorted_stats[Math.round(stats.length / 2)];
    if(median == undefined) {
        median = "Inte tilräckligt mycket data.";
    }
    let p_average = document.getElementById("p_average");
    let P_median = document.getElementById("p_median");
    p_average.innerHTML = "Average: " + String(average);
    P_median.innerHTML = "Median: " + String(median);
}

function submitStats() {
    document.getElementById("dropdown-btn2").innerHTML = "Choose teacher";
    memory = JSON.parse(localStorage.getItem("memory"));
    currentTeacher = localStorage.getItem("current_teacher");
    let minLate = document.getElementById("numberinput-time").value;
    console.log(typeof(minLate));
    minLate = parseInt(minLate);
    let teacherArray = memory[currentTeacher];
    console.log(teacherArray);
    teacherArray.push(minLate);
    console.log(teacherArray);
    memory[currentTeacher] = teacherArray;
    localStorage.setItem("memory", JSON.stringify(memory));
    console.log(memory);
    console.log(JSON.parse(localStorage.getItem("memory")));
    openPage('index.html');
}

function addTeacher() {
    memory = JSON.parse(localStorage.getItem("memory")) || {};
    let textinput_name = document.getElementById("textinput-new-teacher").value;
    memory[textinput_name] = [];
    localStorage.setItem("memory", JSON.stringify(memory));
    textinput_name = "";
    openPage('index.html');
}

function generateChart() {
    memory = JSON.parse(localStorage.getItem("memory"));
    currentTeacher = localStorage.getItem("current_teacher");
    let stats = memory[currentTeacher];
    // Create an array with the same length as 'stats'.
    let x_axis = [];
    for(let i = 0; i < stats.length; i++) {
        x_axis.push(i + 1);
    }
    // Create chart
    new Chart("chart", {
        type: "line",
        data: {
            labels: x_axis,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(0,0,255,1.0)",
                borderColor: "rgba(0,0,255,0.1)",
                data: stats
            }]
        },
        options: {
            legend: {display: false},
            scales: {
                yAxes: [{ticks: {min: 0, max:16}}]
            }
        }
    });
}