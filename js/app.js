const url = 'https://fabulous-difficult-redcurrant.glitch.me/movies';
const omdb = `http://www.omdbapi.com/?apikey=${MDBKey}&`
let thisID;
let rating;

const starterMovies = ['Nausicaä of the Valley of the Wind ', 'Blade Runner', 'Spaceballs', 'Rubber']
// const omdbFetch = (movie) => fetch(omdb).then(response => response.json());

function movieEntry(movieTitle) {
        fetch(`${omdb}t=${movieTitle}`).then(response => response.json()).then(data => {
            console.log(data);
            return data;
        });
}

function omdbMovieFunction (movie) {
    const reviewObj = {
        title: movie.Title,
        rating: '',
        genre: movie.Genre,
        poster: movie.Poster,
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
};

function movieFetch () {
    fetch(url).then(response => response.json())
        .then( data => {
            $("#movie-list").empty();
            let list = ""
            for (let item of data){
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
        })
        .catch(error => console.error(error));
};

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

const movieDelete = (id) => {
    fetch(`${url}/${id}`, {
        method: "DELETE"
    }).then(movieFetch);
};

$(document).ready(function() {
    setTimeout(function () {
        movieFetch();
    },2500);

});

$("#addMovieButton").click(() => {
    $('#newMovieTitle').val("");
})

$("#addMovie").click(() => {
    if($("#newMovieTitle").val().trim().length > 0) {
        // let entry = movieEntry($("#newMovieTitle").val().trim());
        addMovieFunction();

    } else {
        alert("Hey, Can't do that!")
    };
});

$(document).on("click", ".info", function() {
    thisID = $(this).parent().attr('id');
    modalFill(thisID)
});

$(document).on("click", ".edit", function() {
    thisID = $(this).parent().attr('id');
    let currentRating = $(this).parent().find('.rating').html();
    console.log(currentRating);
    $(`input[name='editRating'][value=${currentRating}]`).prop('checked', true);
    console.log(thisID);
});

$(document).on("click", ".submit-edit", function(){
    let editRating = $(`input[name="editRating"]:checked`).val();
    console.log(editRating)
    moviePatch(editRating);
    $('#newMovieTitle').empty();
});

$(document).on("click", ".delete", function(){
    let response = confirm("Are you sure want to?");
    if (response) {
        let deleteID = $(this).parent().attr('id');
        movieDelete(deleteID);
    }
});

