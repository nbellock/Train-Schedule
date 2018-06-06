        /* global firebase moment */
        // Steps to complete:

        // 1. Initialize Firebase/Done
        // 2. Create button for adding new trains - then update the html + update the database
        // 3. Create a way to retrieve trains from the train database.
        // 4. Create a way to calculate the minutes away


        // 1. Initialize Firebase
        var config = {
            apiKey: "AIzaSyB9O6ARaMmqQM8K3yhjfLoYJ4URFmW4qvE",
            authDomain: "train-schedule-c03c3.firebaseapp.com",
            databaseURL: "https://train-schedule-c03c3.firebaseio.com",
            projectId: "train-schedule-c03c3",
            storageBucket: "",
            messagingSenderId: "513784119991"
        };
        firebase.initializeApp(config);

        var database = firebase.database();


        var tMinutesTillTrain = 0;
        //Show and update current time. Use setInterval method to update time.
        function displayRealTime() {
            setInterval(function () {
                $('#current-time').html(moment().format('hh:mm A'))
            }, 1000);
        }
        displayRealTime();


        // 2. Button for adding trains
        $("#add-train-btn").on("click", function (event) {
            event.preventDefault();

            // Grabs user input
            var trainName = $("#name-input").val().trim();
            var trainDestination = $("#destination-input").val().trim();
            var trainFrequency = $("#frequency-input").val().trim();
            var trainArrival = $("#arrival-input").val().trim();
            var trainMinutes = $("#arrival-input").val().trim();

            // Creates local "temporary" object for holding train data
            var newTrain = {
                name: trainName,
                destination: trainDestination,
                frequency: trainFrequency,
                arrival: trainArrival,
                minutes: trainMinutes
            };

            // Uploads train data to the database
            database.ref().push(newTrain);

            // Logs everything to console
            console.log(newTrain.name);
            console.log(newTrain.destination);
            console.log(newTrain.frequency);
            console.log(newTrain.arrival);
            console.log(newTrain.minutes);


            // Alert
            alert("Train successfully added");

            // Clears all of the text-boxes
            $("#name-input").val("");
            $("#destination-input").val("");
            $("#frequency-input").val("");
            $("#arrival-input").val("");
            $("#minutes-input").val("");
        });

        // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
        database.ref().on("child_added", function (childSnapshot, prevChildKey) {
            event.preventDefault();
            console.log(childSnapshot.val());

            // Store everything into a variable.
            var newTrainName = childSnapshot.val().name;
            var newTrainDestination = childSnapshot.val().destination;
            var newTrainFrequency = childSnapshot.val().frequency;
            var newTrainArrival = childSnapshot.val().arrival;
            var newTrainMinutesAway = childSnapshot.val().minutes;

            // train Info
            console.log(newTrainName);
            console.log(newTrainDestination);
            console.log(newTrainFrequency);
            console.log(newTrainArrival);
            console.log(newTrainMinutesAway);



            // Calculate the next Arrival
            //Moment JS math caclulations to determine train next arrival time and the number of minutes away from destination.
            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(newTrainArrival, "hh:mm").subtract(1, "years");
            console.log(firstTimeConverted);

            // Current Time
            var currentTime = moment();
            console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
            console.log("DIFFERENCE IN TIME: " + diffTime);

            // Time apart (remainder)
            var tRemainder = diffTime % newTrainFrequency;
            console.log(tRemainder);

            // Minute Until Train
            var tMinutesTillTrain = newTrainFrequency - tRemainder;
            console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
            console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
            //Update the HTML (schedule table) to reflect the latest stored values in the firebase database.
            var tRow = $("<tr>");
            var trainTd = $("<td>").text(newTrainName);
            var destTd = $("<td>").text(newTrainDestination);
            var nextTrainTd = $("<td>").text(newTrainMinutesAway);
            var trainFrequencyTd = $("<td>").text(newTrainFrequency);
            var tMinutesTillTrainTd = $("<td>").text(tMinutesTillTrain);

            // Add each train's data into the table
            tRow.append(trainTd, destTd, trainFrequencyTd, nextTrainTd, tMinutesTillTrainTd);
            // Append the table row to the table body
            $("#train-table").append(tRow);

            // $("train-table > tbody").append("<tr><td>" + trainTd + "</td><td>" + destTd +
            //     "</td><td>" +
            //     trainFrequencyTd + "</td><td>" + tMinutesTillTrainTd + "</td><td>" + nextTrainTd + "</td><td>");
        });