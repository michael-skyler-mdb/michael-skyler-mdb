const url = 'https://fabulous-difficult-redcurrant.glitch.me/movies';
const movieDB = fetch(url).then(response => response.json());

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
    movieDB
        .then( data => {
            let list = ""
            for (let item of data){
                list +=  `<h5>${item.title}</h5>
                            <div>Rating ${item.rating}</div><hr>`
            }
            $("#movie-list").append(list);
        })
        .catch(error => console.error(error));
}


function addMovie () {
    let newMovieID = movieDB.then(data => data.reduce((total,movie) => {
        if(movie.id + 1 > total){
            return movie.id + 1;
        };
        return total;
    },0))
    const reviewObj = {
        id: newMovieID,
        title: 'Codey',
        rating: 5,
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

$(document).ready(function() {
    movieFetch();
});