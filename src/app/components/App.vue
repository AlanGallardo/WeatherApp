<style>
    @import '../../public/css/index_style.css';
</style>
<template>
    <div class="screen" :class="typeof weather.request != 'undefined' && checkTime(weather.location.localtime)">
        <div id="particles-js"></div>
        <main>
            <div class="search-box">
                <input type="text" class="search-bar" placeholder="Search..." v-model="query"
                    @keypress="fetchWeather" />
            </div>

            <div class="weather-wrap" v-if="typeof weather.request != 'undefined'">
                <div class="location-box">
                    <div class="location"> {{ weather.location.name }}, {{ weather.location.country }} </div>
                    <div class="date">{{ weather.location.localtime }}</div>
                </div>

                <div class="weather-box">
                    <div class="temp">{{ Math.round(weather.current.temperature) }}°C</div>
                    <div class="weather">{{ weather.current.weather_descriptions[0] }}</div>
                </div>
            </div>
        </main>
        <footer>
            <div id="toggle" @click.prevent="displayMenu"></div>
            <div id="itemsContainer">

                <div class="fav-item" v-for="place in places">
                    <div class="remove-btn" @click.prevent="removePlace(place._id)"></div>
                    <div @click.prevent="fetchSelected(place.name)">
                        <div class="item-info">
                            <div class="item-header">
                                <div class="item-name" id="name">{{ place.name }}</div>
                                <div id="emoji" :style="{ background: 'url(' + place.icon + ')' }">
                                </div>
                            </div>
                            <div id="item-temp">
                                {{ place.temp }}°C
                            </div>
                        </div>
                    </div>
                </div>

                <template>
                    <div class="add-item" v-if="typeof weather.request != 'undefined'" @click.prevent="storePlace">
                        <div id="symbol"> + </div>
                        <div id="text"> Add current </div>
                    </div>
                </template>

            </div>
        </footer>
    </div>
</template>

<script>
    class Place {
        constructor(name, temp, icon) {
            this.name = name;
            this.temp = temp;
            this.icon = icon;
        }
    }

    import rain from '../../public/assets/particles/rain-config.json';
    import snow from '../../public/assets/particles/snow-config.json';
    import none from '../../public/assets/particles/no-config.json';

    export default {
        data() {
            return {
                api_key: '60c1f1c8c596c7fc0ba6f134b0a93ff3',
                url_base: 'http://api.weatherstack.com/',
                query: '',
                weather: {},
                rain: 'rain',
                place: new Place(),
                places: [],
                displayed_menu: false
            }
        },
        created() {
            this.getPlaces();
        },
        methods: {
            getPlaces() {
                fetch('/api/places')
                    .then(res => res.json())
                    .then(data => {
                        this.places = data;
                    });
            },
            storePlace() {
                this.place.name = this.weather.location.name;
                this.place.temp = Math.round(this.weather.current.temperature);
                this.place.icon = this.weather.current.weather_icons[0];

                fetch('/api/places', {
                    method: 'POST',
                    body: JSON.stringify(this.place),
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        this.getPlaces();
                    });
            },
            removePlace(id) {
                fetch('api/places/' + id, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        this.getPlaces();
                    });
            },
            fetchWeather(e) {
                if (e.key == "Enter") {
                    fetch(`${this.url_base}current?access_key=${this.api_key}&query=${this.query}&units=m`)
                        .then(res => {
                            return res.json();
                        }).then(this.setResults);
                }
            },
            fetchSelected(name) {
                fetch(`${this.url_base}current?access_key=${this.api_key}&query=${name}&units=m`)
                    .then(res => {
                        return res.json();
                    }).then(this.setResults);
            },
            setResults(results) {
                this.weather = results;
                this.insertParticle();
            },
            checkTime(d) {
                var hour = parseInt(d.substring(10, 13));

                if (hour >= 7 && hour <= 10)
                    return "morning";
                else if (hour >= 10 && hour <= 17)
                    return "day";
                else if (hour > 17 && hour <= 19)
                    return "sunset";
            },
            displayMenu() {
                this.displayed_menu = !this.displayed_menu;
                if (this.displayed_menu) {
                    document.getElementById('toggle').style.bottom = "40px";
                    document.getElementById('itemsContainer').style.bottom = "10px";
                } else {
                    document.getElementById('toggle').style.bottom = "220px";
                    document.getElementById('itemsContainer').style.bottom = "220px";
                }
            },
            insertParticle() {
                if (Object.keys(this.weather).length !== 0) {
                    if (this.weather.current.weather_descriptions[0].toLowerCase().includes('snow'))
                        particlesJS("particles-js", snow);
                    else if (this.weather.current.weather_descriptions[0].toLowerCase().includes('rain'))
                        particlesJS("particles-js", rain);
                    else
                        particlesJS("particles-js", none);
                }
            }
        }
    }
</script>