// load VIDEOGAMES from a server as JSON data
var videoGames = [];
document.getElementById("input-area").hidden = true;
document.getElementById("video-games-list-area").hidden = true;
document.getElementById("email-exists").hidden = true;
document.getElementById("login-wrong").hidden = true;
document.getElementById("edit-title").hidden = true;
document.getElementById("edit-submit").hidden = true;
var submitButton = document.querySelector("#submit");
var videoGameInput = document.querySelector("#favorite-video-games");
var characterInput = document.querySelector("#favorite-video-character");
var achievmentInput = document.querySelector("#favorite-video-achievment");
var ratingInput = document.querySelector("#favorite-video-rating");
var difficultyInput = document.querySelector("#favorite-video-difficulty");
var editSubmit = document.querySelector("#edit-submit");
//registration 
var registrationName = document.querySelector("#registration-name");
var registrationLastName = document.querySelector("#registration-last-name");
var registrationEmail = document.querySelector("#registration-email");
var registrationPassword = document.querySelector("#registration-password");
var registrationSubmit = document.querySelector("#registration-submit");
var loginSubmit = document.querySelector("#login-submit");
var loginEmail = document.querySelector("#login-email");
var loginPassword = document.querySelector("#login-password");

//BUTTON FUNCTIONS
//used for video game edits
editSubmit.onclick = function(){
    console.log("confirm edit button was clicked");
    //Call the edit stuff
    editVideoGameFromServer(idValue,videoGameInput.value,characterInput.value,achievmentInput.value,ratingInput.value,difficultyInput.value);
    //then clean up the edit page
    document.getElementById("edit-title").hidden = true;
    document.getElementById("edit-submit").hidden = true;
    document.getElementById("submit").hidden = false;
    videoGameInput.value = "";
    characterInput.value = "";
    achievmentInput.value = "";
    ratingInput.value = "";
    difficultyInput.value = "";
};
//used for video game creation
submitButton.onclick = function(){
    var videoGameName = videoGameInput.value;
    var character = characterInput.value;
    var achievment = achievmentInput.value;
    var rating = ratingInput.value;
    var difficulty = difficultyInput.value;
    createVideoGame(videoGameName,character,achievment,rating,difficulty);
    videoGameInput.value = "";
    characterInput.value = "";
    achievmentInput.value = "";
    ratingInput.value = "";
    difficultyInput.value = "";
};
//used for creating a new user
registrationSubmit.onclick = function(){
    var name = registrationName.value;
    var lastName = registrationLastName.value;
    var email = registrationEmail.value;
    var password = registrationPassword.value;
    createUser(name,lastName,email,password);
};

//used for creating a new session
loginSubmit.onclick = function(){
    var email = loginEmail.value;
    var password = loginPassword.value;
    createSession(email,password);
};

//CREATE NEW USER ON THE SERVER
function createUser(firstName,lastName, email,password){
    var data = "firstname=" + encodeURIComponent(firstName);
    data += "&lastname=" + encodeURIComponent(lastName);
    data += "&email=" + encodeURIComponent(email);
    data += "&password=" + encodeURIComponent(password);
    console.log("this is the data I am going to send to the server", data);

    fetch("https://favorite-video-games.herokuapp.com/users",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        console.log(response);
        if(response.status == 201){
            console.log("The user was successfully created");
            document.getElementById("email-exists").hidden = true;
        }else{
            document.getElementById("email-exists").hidden = false;
        }
            
    });
};

//create a session on the server
function createSession(email,password){
    var data = "email=" + encodeURIComponent(email);
    data += "&password=" + encodeURIComponent(password);
    console.log("this is the data I am going to send to the server", data);

    fetch("https://favorite-video-games.herokuapp.com/sessions",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        if(response.status == 201){
            console.log("The user is logged in");
            document.getElementById("login-wrong").hidden = true;
            document.getElementById("input-area").hidden = false;
            document.getElementById("video-games-list-area").hidden = false;
            document.getElementById("login-area").hidden = true;
            document.getElementById("registration-area").hidden = true;
            loadVideoGames();
        }else{
            document.getElementById("login-wrong").hidden = false;
        }
            
    });
};

//create a new video game on the server
function createVideoGame(videoGameName,videoGameCharacter, videoGameAchievment,rating,difficulty){
    var data = "name=" + encodeURIComponent(videoGameName);
    data += "&character=" + encodeURIComponent(videoGameCharacter);
    data += "&achievment=" + encodeURIComponent(videoGameAchievment);
    data += "&rating=" + encodeURIComponent(rating);
    data += "&difficulty=" + encodeURIComponent(difficulty);
    console.log("this is the data I am going to send to the server", data);

    fetch("https://favorite-video-games.herokuapp.com/FavoriteVideoGames",{
        method: 'POST',
        credentials: 'include',
        body:data,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    }).then(function(response){
        loadVideoGames();
    });
};

//deletes a video game 
function deleteVideoGameFromServer(videoGameId){
    fetch("https://favorite-video-games.herokuapp.com/FavoriteVideoGames/"+videoGameId,{
        method: "DELETE",
        credentials:'include'
    }).then(function(response){
        if(response.status == 200){
            console.log("the video game was successfully deleted");
            loadVideoGames();
        }
    });
}

//edits a member
function editVideoGameFromServer(videoGameId,name,character,achievment,rating,difficulty){
    var data = "id="+ encodeURIComponent(videoGameId);
    data += "&name=" + encodeURIComponent(name);
    data += "&character=" + encodeURIComponent(character);
    data += "&achievment=" + encodeURIComponent(achievment);
    data += "&rating=" + encodeURIComponent(rating);
    data += "&difficulty=" + encodeURIComponent(difficulty);
    console.log(data);
    fetch("https://favorite-video-games.herokuapp.com/FavoriteVideoGames/"+videoGameId,{
        method: "PUT",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    }).then(function(response){
        if(response.status == 200){
            console.log("the video game was successfully edited");
            loadVideoGames();
        }
    });
}

//used for editing
function displayEditForm(videoGame){
    document.getElementById("edit-title").hidden = false;
    document.getElementById("submit").hidden = true;
    document.getElementById("edit-submit").hidden = false;

    videoGameInput.value = videoGame.name;
    characterInput.value = videoGame.character;
    achievmentInput.value = videoGame.achievement;
    ratingInput.value = videoGame.rating;
    difficultyInput.value = videoGame.difficulty;
};

//load videoGames from a server as JSON data
function loadVideoGames(){
    fetch("https://favorite-video-games.herokuapp.com/FavoriteVideoGames",{
        credentials:'include'
    }).then(function(response){

        if(response.status == 401){
            document.getElementById("input-area").hidden = true;
            document.getElementById("video-games-list-area").hidden = true;
            document.getElementById("login-area").hidden = false;
            document.getElementById("registration-area").hidden = false;
            return;
        }
        document.getElementById("input-area").hidden = false;
        document.getElementById("video-games-list-area").hidden = false;
        document.getElementById("login-area").hidden = true;
        document.getElementById("registration-area").hidden = true;

        response.json().then(function(data){
        videoGames = data;
        console.log("video games from the server", videoGames);
        var videoGameList = document.querySelector("#video-game-list");
        videoGameList.innerHTML = "";
        videoGames.forEach(function(videoGame){
            var newListItem = document.createElement("li");

            var nameDiv = document.createElement("div");
            var characterDiv = document.createElement("div");
            var achievmentDiv = document.createElement("div");
            var ratingDiv = document.createElement("div");
            var difficultyDiv = document.createElement("div");

            nameDiv.innerHTML = "<b><u>Favorite Video Game: </u></b>" + videoGame.name;
            //nameDiv.classList.add("video-game-name");
            newListItem.appendChild(nameDiv);

            characterDiv.innerHTML = "<b><u>Character from Game: </u></b>" + videoGame.character;
            newListItem.appendChild(characterDiv);

            achievmentDiv.innerHTML = "<b><u>Numbered Achievment from Game: </u></b>" + videoGame.achievement;
            newListItem.appendChild(achievmentDiv);

            ratingDiv.innerHTML = "<b><u>Rating out of 10: </u></b>" + videoGame.rating;
            newListItem.appendChild(ratingDiv);

            difficultyDiv.innerHTML = "<b><u>Difficulty out of 10: </u></b>" + videoGame.difficulty;
            newListItem.appendChild(difficultyDiv);
            
        
            ////////////////////////////////////////////////////////////////
            var deleteButton = document.createElement("button");
            deleteButton.innerHTML = "Delete";
            deleteButton.onclick = function(){
                console.log("delete button was clicked",videoGame.id);

                //ask user if they really want to delete
                if(confirm("Are you sure?")){
                    deleteVideoGameFromServer(videoGame.id);
                }
            }
            newListItem.appendChild(deleteButton);

            var editButton = document.createElement("button");
            editButton.innerHTML = "Edit";
            editButton.onclick = function(){
                console.log("edit button was clicked",videoGame.id);
                displayEditForm(videoGame);
                window.idValue = videoGame.id;
            }
            newListItem.appendChild(editButton);

            videoGameList.appendChild(newListItem);
        });
        });
    });
};

loadVideoGames();