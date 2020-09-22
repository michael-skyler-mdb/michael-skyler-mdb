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
    fetch(url)
        .then(response => console.log(response))
        .then( data => console.log(data))
        .catch(error => console.error(error));
}

function moviePost () {
    const reviewObj = {
        restaurant_id: 1,
        name: 'Codey',
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