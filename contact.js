
//importing rxjs
let rxjs = require('rxjs');

let node = document.getElementById('add');
const event$ = rxjs.fromEvent(node, 'click');
event$.subscribe(function (x) {
    //setting the display to block to make the div appear on add click
    var formPt = document.getElementById("formParent");
    formPt.style.display = "block";
});


//getData is called onload to load the DB data in the table
window.onload = function () {
    getData();
}


//GET request to fetch data
function getData() {
    fetch('http://localhost:3000/contacts',
        {
            method: "GET",
        })
        .then(response => response.json())
        .then(response => {
            generate_table(response);
            console.log(typeof response)
        });
}


//save click functionality
let nodeSave = document.getElementById('save');
const event1$ = rxjs.fromEvent(nodeSave, 'click');
event1$.subscribe(function (x) {
    var checkelementExist = document.getElementById("tableID");
    if (checkelementExist) {
        var bdy = document.getElementById("bodyID");
        var tbl = document.getElementById("tableID");
        bdy.removeChild(tbl);
    }
    //get the input values to match the regex
    var firstNameData = document.getElementById('fname').value;
    var lastNameData = document.getElementById('lname').value;
    var emailData = document.getElementById('email').value;
    var contactData = document.getElementById('contact').value;
    var patternName = new RegExp("[a-zA-Z]");

    var boolFirstName = patternName.test(firstNameData);
    var boolLastName = patternName.test(lastNameData);
    var boolEmail = ValidateEmail(emailData);
    var boolContactNum = validateContactNumber(contactData);

    if (!boolFirstName) {
        alert("Enter valid input for first name");
        return;
    }
    if (!boolLastName) {
        alert("Enter valid input for last name");
        return;
    }
    if (!boolEmail) {
        alert("Enter correct input for Email");
        return;
    }
    if (!boolContactNum) {
        alert("Enter correct input for Contact");
        return;
    }
   // var formPt = document.getElementById("formParent");
   // formPt.style.display = "block";
    //postData();
    var data = {
        firstName: document.getElementById('fname').value,
        lastName: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        contactNum: document.getElementById('contact').value
    }
    fetch('http://localhost:3000/contacts', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(response => console.log(response.json()))
        .then(data => {
            console.log(data);
            getData();
        });

});



//this function generates the table to display the data
function generate_table(data) {
    var body = document.getElementsByTagName("body")[0];
    body.id = "bodyID";
    var tbl = document.createElement("table");
    tbl.id = "tableID";
    var tblBody = document.createElement("tbody");
    for (var i in data) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        var cellText1 = document.createTextNode(data[i].firstName);
        var cell2 = document.createElement("td");
        var cellText2 = document.createTextNode(data[i].lastName);
        cell1.appendChild(cellText1);
        cell2.appendChild(cellText2);
        cell1.style.width = "100px";
        cell2.style.width = "100px";
        row.appendChild(cell1);
        row.appendChild(cell2);
        //this creates the view button in the datacell
        var cell3 = document.createElement("td");
        var btn = document.createElement("BUTTON");
        var cellText4 = document.createTextNode("View");
        btn.setAttribute('value', data[i]._id);
        btn.style.backgroundColor = "#ffdab9";
        cell3.appendChild(btn);
        btn.appendChild(cellText4);
        row.appendChild(cell3);
        const evenbtn$ = rxjs.fromEvent(btn, 'click');
        evenbtn$.subscribe(function (x) {
            //this function gets the data of a particular id
            fetch('http://localhost:3000/contacts/' + x.currentTarget.value,
                {
                    method: "GET",
                })
                .then(response => response.json())
                .then(function (response) {
                    var viewPart = document.getElementById('viewDiv');
                    viewPart.style.display = "block";
                    document.getElementById('fnameView').innerHTML = response.firstName;
                    document.getElementById('lnameView').innerHTML = response.lastName;
                    document.getElementById('emailView').innerHTML = response.email;
                    document.getElementById('contactView').innerHTML = response.contactNum;
                })
        });

        tblBody.appendChild(row);
        tbl.appendChild(tblBody);
        body.appendChild(tbl);
        tbl.setAttribute("border", "1");
        tbl.style.marginLeft = "350px";
        tbl.style.marginTop = "40px";

    }
}
//onclick of Hide Btn the div should disappear
let node8 = document.getElementById('hideBtn');
const eventHide$ = rxjs.fromEvent(node8, 'click');
eventHide$.subscribe(function (x) {
    var viewDiv = document.getElementById("viewDiv");
    viewDiv.style.display = "none";

});

//function to validate email
function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
}

//function to validate contact no.
function validateContactNumber(contact) {
    if (/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(contact)) {
        return true;
    }
}