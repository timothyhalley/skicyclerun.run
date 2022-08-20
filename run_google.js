// Purpose: function library for google maps API
// * Get Map Info from LAT/LON
// G-Docs: https://github.com/googlemaps/google-maps-services-js
import dotenv from 'dotenv';
dotenv.config();
// Node 
// import fs from 'fs';

// Axios
import axios from 'axios';

// google API
const gMapAPIKey = process.env.GOOGLE_API_KEY;
const gMapURL = process.env.GOOGLE_API_URL;
import { Client, Status } from '@googlemaps/google-maps-services-js';

const gClient = new Client({});

export { gmapLoactions, gmapElevation, gmapTimeZone }

async function gmapLoactions(lat, lon) {

    // usage: let locations[] = await gmapLoations(latitude, longitude)
    // note: lat; lon must be in decimal notation - convert first
    let locations = [];
    let slatlng = lat.toString() + ',' + lon.toString();
    // console.debug('string of latlon = ', slatlng)
    return await gClient
        .reverseGeocode({
            params: {
                latlng: slatlng,
                key: gMapAPIKey
            },
            timeout: 5000 // milliseconds
        }, await axios)
        .then(r => {
            locations = r.data.results[0].formatted_address
            // console.log("gmapLocation says your location is : ", locations);
            return locations;
        })
        .catch(err => {
            console.error('\n\nERROR -->', err, '\n\n');
            return locations;
        });

}

async function gmapElevation(lat, lon) {

    // usage: let elevation = await gmapElevation(latitude, longitude)
    // note: lat; lon must be in decimal notation - convert first

    return await gClient
        .elevation({
            params: {
                locations: [{ lat: lat, lng: lon }],
                key: gMapAPIKey
            },
            timeout: 1000 // milliseconds
        }, await axios)
        .then(r => {
            const elev = r.data.results[0].elevation
            // console.log("gmapElevation says your hight is: ", elev);
            return elev;
        })
        .catch(err => {
            console.error('\n\nERROR -->', err, '\n\n');
            return elev;
        });

}

async function gmapTimeZone(lat, lon, pDate) {

    // https://developers.google.com/maps/documentation/timezone/requests-timezone
    // note: timestamp must be to seconds only - mili will not work.
    // https://www.epochconverter.com/

    let latlon = Number(lat).toFixed(6) + ',' + Number(lon).toFixed(6);
    let dateUTC = pDate.getTime() / 1000 // Seconds
    return await gClient
        .timezone({
            // url: 'json',
            params: {
                location: latlon,
                timestamp: dateUTC,
                key: gMapAPIKey
            },
            timeout: 1000 // milliseconds
        }, await axios)
        .then(r => {
            const timeInfo = r.data;
            return timeInfo;
        })
        .catch(err => {
            console.error('\n\nERROR -->', err, '\n\n');
            return null;
        });

}

/// 




// France: curl 'https://maps.googleapis.com/maps/api/timezone/json?