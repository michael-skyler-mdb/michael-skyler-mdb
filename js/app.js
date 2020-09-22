const url = 'https://fabulous-difficult-redcurrant.glitch.me/movies';

function movieFetch () {
    // const url = `${url}movies`;
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(reviewObj),
    // };
    // fetch(url, options)
    //     .then( response => console.log(response) ) /* review was created successfully */
    //     .catch( error => console.error(error) ); /* handle errors */
    fetch(url).then(response => response.json())
        .then( data => {
            $("#movie-list").empty();
            let list = ""
            for (let item of data){
                list +=  `<div class="movie-container" id="${item.id}"><h5>${item.title}</h5>
                            <div>Rating ${item.rating}</div><br><button class="edit">Edit</button><button class="delete">Delete</button></div><hr>`
            }
            $("#movie-list").append(list);
        })
        .catch(error => console.error(error));
}


function addMovieFunction () {
    let newMovieID;
    fetch(url).then(response => response.json()).then(data => data.reduce((total,movie) => {
        if(movie.id + 1 > total){
            return movie.id + 1;
        };
        console.log(data);
        return  newMovieID = total;
    },0))
    let newTitle = $("#newMovieTitle").val();
    let newRating = $('input[name="rating"]:checked').val();
    const reviewObj = {
        id: newMovieID,
        title: newTitle,
        rating: newRating,
        // comments: "This is a really good place for coding and eating"
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewObj),
    };
    fetch(url, options)
        .then(response => console.log(response)) /* review was created successfully */
        .catch(error => console.error(error)); /* handle errors */
};

function moviePatch (patchID) {

    const reviewObj = {
        id: newMovieID,
        title: newTitle,
        rating: newRating,
        // comments: "This is a really good place for coding and eating"
    };

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewObj),
    };
    fetch(`url/${patchID}`, options)
        .then(response => console.log(response)) /* review was created successfully */
        .catch(error => console.error(error)); /* handle errors */
}

$(document).ready(function() {
    movieFetch();
});
$("#addMovie").click(() => {
    addMovieFunction();
    movieFetch();
    console.log("Success");
});