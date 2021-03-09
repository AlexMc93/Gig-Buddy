import axios from 'axios';
import { apiKey } from './apiKey';

const request = axios.create({
    baseURL: "https://app.ticketmaster.com/discovery/v2"
})

const dateFormat = (date) => {

    const months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
    }

    const year = date.slice(0, 4);
    const month = months[date.slice(5, 7)];
    const day = date.slice(8);

    return `${day} ${month} ${year}`
}

const timeFormat = (time) => {

    if (!time) return ''

    const hoursObj = {
        '01': '1am',
        '02': '2am',
        '03': '3am',
        '04': '4am',
        '05': '5am',
        '06': '6am',
        '07': '7am',
        '08': '8am',
        '09': '9am',
        '10': '10am',
        '11': '11am',
        '12': '12pm',
        '13': '1pm',
        '14': '2pm',
        '15': '3pm',
        '16': '4pm',
        '17': '5pm',
        '18': '6pm',
        '19': '7pm',
        '20': '8pm',
        '21': '9pm',
        '22': '10pm',
        '23': '11pm',
        '24': '12pm'
    }

    const minutesObj = {
        '00:00': '',
        '15:00': '15',
        '30:00': '30',
        '45:00': '45'
    }

    const minutes = minutesObj[time.slice(3)]
    const hours = hoursObj[time.slice(0, 2)]

    if (minutes) return `${hours.slice(0, -2)}:${minutes}${hours.slice(-2)}`
    else return hours
}

const formatEvent = (event) => {

    const findImage = (imgArr) => {
        const index = imgArr.findIndex((img) => img.ratio === "16_9")
        if (index >= 0) return imgArr[index].url
        else return imgArr[0].url
    }

    return { 
        name: event.name,
        date: dateFormat(event.dates.start.localDate),
        time: timeFormat(event.dates.start.localTime), 
        venue: `${event._embedded.venues[0].name}, ${event._embedded.venues[0].city.name}`, 
        postCode: event._embedded.venues[0].postalCode, 
        location: event._embedded.venues[0].location,
        image: findImage(event.images),
        id: event.id,
        genre: event.classifications[0].genre.name, 
        subGenre: event.classifications[0].subGenre.name }

}

export const getEvents = (city = 'manchester', size = 20) => { 
    return request.get(`/events.json?classificationName=music&city=${city}&size=${size}&${apiKey}`)
    .then(({data}) => {

        if (data.hasOwnProperty('_embedded')) {
            const events = data._embedded.events;
            return events.map((event) => {
                   return formatEvent(event)
            })
        } else {
            return {errMsg: 'No events found - please adjust your search'}
        }
    } 
    )
   .catch((err) => {
        return {errMsg: 'Problem connecting, please check your internet connection'}
   })
}

export const getEventsNearUser = (lat, long, radius = 15, size = 20) => {

    return request.get(`/events.json?classificationName=music&latlong=${lat},${long}&radius=${radius}&size=${size}&${apiKey}`)
    .then(({data}) => {

        if (data.hasOwnProperty('_embedded')) {
            const events = data._embedded.events;
            return events.map((event) => {
                return formatEvent(event)
            })
        } else {
            return {errMsg: 'No events near your location - try a manual search instead'}
        }
    })
    .catch((err) => {
        return {errMsg: 'Problem connecting, please check your internet connection'}
    })
}