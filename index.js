const mockData = JSON.parse(
    `
    {
        "albums": [
            {
                "album_title": "Count Bateman",
                "avg_user_rating": 8.786,
                "band_name": "Frog",
                "genres": ["Indie Rock", "Acoustic"],
                "last_listened": 1609528990000,
                "release_date": "2019/08/16"
            },
            {
                "album_title": "Stay Positive",
                "avg_user_rating": 9.234,
                "band_name": "The Hold Steady",
                "genres": ["Rock", "Punk"],
                "last_listened": 1611766459503,
                "release_date": "2008/07/15"
            },
            {
                "album_title": "Courting Strong",
                "avg_user_rating": null,
                "band_name": "Martha",
                "genres": ["Punk", "Indie Rock"],
                "last_listened": 1610471530000,
                "release_date": "2014/05/26"
            },
            {
                "album_title": "Born Like This",
                "avg_user_rating": 7.983,
                "band_name": "MF Doom",
                "genres": ["Hip-hop", "Rap"],
                "last_listened": 1607951459000,
                "release_date": "2009/03/24"
            },
            {
                "album_title": "Giant Steps",
                "avg_user_rating": 8.444,
                "band_name": "John Coltrane",
                "genres": ["Jazz"],
                "last_listened": 1608786659000,
                "release_date": "1960/02/01"
            }
        ]
    }
    `
);

const mockFetchHelper = (
    isSuccess=true,
    returnValue,
    timeoutValue=1000
) => new Promise(
    (
        resolve,
        reject
    ) => setTimeout(
        () => {
            if(isSuccess) return resolve(returnValue);
            return reject(returnValue);
        },
        timeoutValue
    )
);

const load = async () => {
    document.body.innerHTML = 'Loading...';

    // Simulating API failure
    let isSuccess = true;
    let returnValue = mockData;

    // 20% to fail
    if(
        Math.random() > 0.8
    )
    {
        isSuccess = false;
        returnValue = {
            error: 'Internal server error'
        };
    }

    let data;

    try
    {
        // Await for the API call
        data = await mockFetchHelper(
            isSuccess,
            returnValue
        );
    }
    catch(error)
    {
        // Retry on fail
        console.error(error);
        document.body.innerHTML = 'Error while fetching, retrying...';

        return setTimeout(
            load,
            1000
        );
    }

    // Remove the loading message
    document.body.innerHTML = '';

    const table = document.createElement('table');
    document.body.appendChild(table);

    const headers = document.createElement('tr');
    table.appendChild(headers);

    [
        'Band',
        'Album',
        'Genres',
        'Last Played',
        'Date Released'
    ].forEach(
        column => {
            const header = document.createElement('td');
            header.innerHTML = column;
            headers.appendChild(header);
            return;
        }
    );

    data.albums.sort(
        (
            first,
            second
        ) => first['last_listened'] < second['last_listened'] ? 1 : -1
    );

    data.albums.forEach(
        album => {
            const row = document.createElement('tr');
            table.appendChild(row);

            const band = document.createElement('td');
            row.appendChild(band);
            band.innerHTML = album['band_name'] ? album['band_name'] : '- -';

            const albumTitle = document.createElement('td');
            row.appendChild(albumTitle);
            albumTitle.innerHTML = album['album_title'] ? album['album_title'] : '- -';

            const genres = document.createElement('td');
            row.appendChild(genres);
            genres.innerHTML = album['genres']?.length ? album['genres'].join(', ') : '- -';

            const lastListened = document.createElement('td');
            row.appendChild(lastListened);

            let dateFormatted = new Date(album['last_listened']).toLocaleString();
            dateFormatted = `${dateFormatted.slice(0, dateFormatted.length - 6)} ${dateFormatted.slice(dateFormatted.length - 2)}`;
            dateFormatted = dateFormatted.replace(',', '');

            lastListened.innerHTML = album['last_listened'] ? dateFormatted : '- -';

            const released = document.createElement('td');
            row.appendChild(released);

            released.innerHTML = album['release_date'] ? new Date(album['release_date']).toLocaleDateString() : '- -';
        }
    );
};

document.addEventListener(
    'DOMContentLoaded',
    load
);