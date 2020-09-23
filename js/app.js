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
                list +=  `<div class="movie-container" id="${item.id}">
                            <h5>${item.title}</h5>
                            <div>${item.rating}</div><br>
                            <button class="btn btn-primary edit" type="button" data-toggle="collapse" data-target="#editForm${item.id}" aria-expanded="false" aria-controls="collapseExample">Edit</button>
                            <button class="btn btn-danger delete">Delete</button></div>
                            <div class="collapse" id="editForm${item.id}">
                            <div class="card card-body">
                                <div id="edit-form">
                            <input type="text" id="editMovieTitle${item.id}" value="${item.title}">
                            <label>
                                <input type="radio" name="editRating${item.id}" value="1" checked>1
                            </label>
                            <label>
                                <input type="radio" name="editRating${item.id}" value="2">2
                            </label>
                            <label>
                                <input type="radio" name="editRating${item.id}" value="3">3
                            </label>
                            <label>
                                <input type="radio" name="editRating${item.id}" value="4">4
                            </label>
                            <label>
                                <input type="radio"name="editRating${item.id}" value="5">5
                            </label>
                            <button class="btn btn-success" id="editMovie${item.id}">Submit</button>
                            </div>
                            </div>
                           </div><hr>`
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
        .then(response => console.log(response))
        .then(movieFetch)/* review was created successfully */
        .catch(error => console.error(error)); /* handle errors */
};

function moviePatch (patchID) {
    let editTitle = $("#editMovieTitle").val();
    let editRating = $('input[name="editRating"]:checked').val();
    const reviewObj = {
        id: patchID,
        title: editTitle,
        rating: editRating,
        // comments: "This is a really good place for coding and eating"
    };

    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewObj),
    };
    fetch(`${url}/${patchID}`, options)
        .then(response => console.log(response))
        .then(movieFetch)/* review was created successfully */
        .catch(error => console.error(error)); /* handle errors */
}

const movieDelete = (id) => {
    fetch(`${url}/${id}`, {
        method: "DELETE"
    }).then(movieFetch);
}

$(document).ready(function() {
    movieFetch();
});

$("#addMovie").click(() => {
    if($("#newMovieTitle").val().trim().length > 0) {
        addMovieFunction();
    } else {
        alert("Hey, Can't do that!")
    }
});

$("#editMovie").click(() => {
    let editID = $(this).parent().attr('id');
    if($("#editMovieTitle").val().trim().length > 0) {
        moviePatch(editID);
    } else {
        alert("Hey, Can't do that!")
    }
});

$(document).on("click", ".delete", function(){
    let deleteID = $(this).parent().attr('id');
    movieDelete(deleteID);
})

