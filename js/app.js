const url = 'https://fabulous-difficult-redcurrant.glitch.me/movies';
const omdb = `http://www.omdbapi.com/?apikey=${MDBKey}&`
let IDToEdit;
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
                list +=  `<div class="movie-container" id="${item.id}">
                            <h4>${item.title}</h4>
                            <img src="${item.poster}">
                            <div class="movieRating">Your rating is 
                                <span class="rating">${rating}</span>
                                ⭐️ out of 5⭐️ 
                            </div>
                            <br>
                            <button class="btn btn-primary edit" type="button" data-toggle="modal" data-target="#editModal">Edit Rating</button>
                            <button class="btn btn-danger delete">Delete</button>
                            <hr>
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
            ratings: movie.Ratings
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
    fetch(`${url}/${IDToEdit}`, options)
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

$(document).on("click", ".edit", function() {
    IDToEdit = $(this).parent().attr('id');
    let currentRating = $(this).parent().find('.rating').html();
    console.log(currentRating);
    $(`input[name='editRating'][value=${currentRating}]`).prop('checked', true);
    console.log(IDToEdit);
});

$(document).on("click", ".submit-edit", function(){
    let editRating = $(`input[name="editRating"]:checked`).val();
    console.log(editRating)
    moviePatch(editRating);
    $('#newMovieTitle').empty();
});

$(document).on("click", ".delete", function(){
    let deleteID = $(this).parent().attr('id');
    movieDelete(deleteID);
});

