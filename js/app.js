const url = 'https://fabulous-difficult-redcurrant.glitch.me/movies';
const omdb = `http://www.omdbapi.com/?apikey=${MDBKey}&`
let thisID;
let movieArray = [];//Array of movies in our database
let displayArray = [];//Array of movies currently being displayed

//Fethces are local list of Movies
function movieFetch () {
    fetch(url).then(response => response.json())
        .then( data => {
            movieArray = [];
            for (let item of data) {
                movieArray.push(item);
            }
            console.log(movieArray);
            displayArray = movieArray;
            movieRender();
        })
        .catch(error => console.error(error));
};

//Creates Cards of Local Movies List
function movieRender () {
    $("#movie-list").empty();
    let list = ""
    for (let item of displayArray){
        let rating = item.rating;
        list +=  `<div class="card movie-card mb-4 mx-2" id="${item.id}">
                            <img src="${item.poster}" class="poster mx-auto card-img-top">
                            <h4 class="text-center">${item.title}</h4>
                            <div class="movieRating mx-auto">Your rating is 
                                <span class="rating">${rating}</span>
                                ⭐️ out of 5⭐️ 
                            </div>
                            <br>
                            <button class="btn btn-info info mb-1" type="button" data-toggle="modal" data-target="#infoModal">More Info</button>
                            <button class="btn btn-primary edit mb-1" type="button" data-toggle="modal" data-target="#editModal">Edit Rating</button>
                            <button class="btn btn-danger delete mb-1">Delete</button>
                            </div>`;
    };
    $("#movie-list").append(list);
}
//Takes input from user to add a movie
function addMovieFunction (movie) {
    let newTitle = $("#newMovieTitle").val();
    let newRating = $('input[name="rating"]:checked').val();
    fetch(`${omdb}t=${newTitle}`).then(response => response.json()).then(movie => {
        console.log(movie);
        const reviewObj = {
            title: movie.Title,
            rating: newRating,
            poster: movie.Poster,
            rated: movie.Rated,
            year: movie.Year,
            director: movie.Director,
            writer: movie.Writer,
            genre: movie.Genre,
            runtime: movie.Runtime,
            awards: movie.Awards,
            plot: movie.Plot,
            reviews: movie.Ratings
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewObj),
        };
        fetch(url, options)
            .then(response => console.log(response))
            .then(movieFetch)/* review was created successfully */
            .catch(error => console.error(error)); /* handle errors */

    });

};
//When user filters based on criteria, display will update
function displayUpdate () {
    displayArray = [];
    for (let movie of movieArray) {
        let entertedTitle = $('#titleSelect').val();
        let movieTitle = movie.title.toLocaleLowerCase()
        let genre = $('#genreSelect').val();
        let movieRating = parseInt($('#ratingSelect').val());
        console.log(movieRating)
        // if (movie.title.includes(title) && (movie.genre.includes(genre) || $('#genreSelect').val() === "default")) {
        //     displayArray.push(movie);
        // }
        if (movieTitle.includes(entertedTitle.toLowerCase()) && (movie.genre.includes(genre) || $('#genreSelect').val() === "default") && (parseInt(movie.rating) == movieRating || $("#ratingSelect").val() ===  'default')) {
            displayArray.push(movie);
        }
    }
    movieRender();
};
//Populates More Info Modal
function modalFill (movieID) {
    fetch(`${url}/${movieID}`).then(response => response.json())
        .then( data => {
            $("#info-modal-body").html("<div class=\"loader\"></div>");
            let list = "";
                list +=  `<div class="modal-header">
                        <h4 class="modal-title text-center" id="infoTitle"><strong>${data.title}</strong></h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                          <div><em>${data.plot}</em></div>
                          <div><strong>Director:</strong> ${data.director}</div>
                          <div><strong>Genre:</strong> ${data.genre}</div>
                          <div><strong>Release Date: </strong>${data.year}</div>
                          <div><strong>Runtime:</strong> ${data.runtime}</div>
                          <div><strong>Awards:</strong> ${data.awards}</div>`;
            $("#info-modal-body").empty().append(list);
        })
        .catch(error => console.error(error));
};
//Allows user to changes their personal rating
function moviePatch (editRating) {
    const reviewObj = {
        rating: editRating
    };

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewObj),
    };
    fetch(`${url}/${thisID}`, options)
        .then(response => console.log(response))
        .then(movieFetch)/* edit was created successfully */
        .catch(error => console.error(error)); /* handle errors */
};
//Allows user to delete movie from local list
const movieDelete = (id) => {
    fetch(`${url}/${id}`, {
        method: "DELETE"
    }).then(movieFetch);
};
//Allows loading to appear and then populate movie cards
$(document).ready(function() {
    setTimeout(function () {
        movieFetch();
    },2500);

    console.log($('#genreSelect').val())
    console.log($('#ratingSelect').val())
});
//Opens Add Movie Modal
$("#addMovieButton").click(() => {
    $('#newMovieTitle').val("");
})
//Submission of added movie
$("#addMovie").click(() => {
    if($("#newMovieTitle").val().trim().length > 0) {
        addMovieFunction();
        $("#ratingSelect").val('default');
        $("#genreSelect").val('default');

    } else {
        alert("Hey, Can't do that!")
    };
});
//Allows user to filter local list based on title
$('#titleSelect').keyup(function (event) {
    displayUpdate();
});
//Prevents return key from refreshing Page
$("#filterForm").keydown(function (event) {
    if(event.keyCode == 13){
        event.preventDefault();
    }
})
//Allows user to filter based on genre and rating
$('#genreSelect, #ratingSelect').change(function () {
    displayUpdate();
});
//Triggers info modal for specific movie on click
$(document).on("click", ".info", function() {
    thisID = $(this).parent().attr('id');
    modalFill(thisID)
});
//Triggers edit modal for specific movie on click
$(document).on("click", ".edit", function() {
    thisID = $(this).parent().attr('id');
    let currentRating = $(this).parent().find('.rating').html();
    console.log(currentRating);
    $(`input[name='editRating'][value=${currentRating}]`).prop('checked', true);
    console.log(thisID);
});
//Submits user rating edit
$(document).on("click", ".submit-edit", function(){
    let editRating = $(`input[name="editRating"]:checked`).val();
    console.log(editRating)
    moviePatch(editRating);
    $('#newMovieTitle').empty();
    $("#ratingSelect").val('default');
    $("#genreSelect").val('default');
});
//Triggers alert to user if for deletion
$(document).on("click", ".delete", function(){
    let response = confirm("Are you sure want to?");
    if (response) {
        let deleteID = $(this).parent().attr('id');
        movieDelete(deleteID);
        $("#ratingSelect").val('default');
        $("#genreSelect").val('default');
    }
});

