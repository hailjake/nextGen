import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { PlacesPage } from '../places/places';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController, public httpClient: HttpClient, private storage: Storage, public loadingCtrl: LoadingController) { }

  public city: string = "";
  public state: string = "";
  public noData: boolean = true;
  public weather: Observable<any>;
  public currentWeather: Observable<string>;
  public locationCity: Observable<string>;
  public locationState: Observable<string>;
  public todaysWeatherTemp: Observable<any>;
  public description: Observable<any>;
  public todaysWeatherCondition: Observable<any>;
  public todaysWeatherConditionCode: Observable<any>;
  public forecast: Observable<any>;
  public sunrise: Observable<any>;
  public sunset: Observable<any>;
  public windChill: Observable<any>;
  public windSpeed: Observable<any>;
  public humidity: Observable<any>;
  public toggleWeather: boolean = false;
  public recentSearches: Array<any> = [];
  public goToPlace: Array<any> = [];

  public lastUpdated: Array<any> = [];
  public lat: Observable<any>;
  public long: Observable<any>;
  //Loader
  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading...",
      duration: 1000
    });
    loader.present();
  }

  // On Load
  ngOnInit() {
    this.presentLoading();


    this.storage.get('RecentSearches').then((val) => {
      if (val != null) {
        this.recentSearches = val;
        this.noData = false;
      } else {
        console.log('no data');
      }

    });
  }
  // Clear All
  clearRecentSearches(recentSearches) {
    this.presentLoading();
    this.storage.clear();
    this.recentSearches = [];

  }
  // search
  search(city, state) {
    this.weather = this.httpClient.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%2C%20" + state + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");
    this.weather
      .subscribe(data => {
        this.currentWeather = data.query.results;
        this.locationCity = data.query.results.channel.location.city;
        this.lastUpdated = data.query.results.channel.lastBuildDate;
        this.sunrise = data.query.results.channel.astronomy.sunrise;
        this.sunset = data.query.results.channel.astronomy.sunset;
        this.windChill = data.query.results.channel.wind.chill;
        this.windSpeed = data.query.results.channel.wind.speed;
        this.humidity = data.query.results.channel.atmosphere.humidity;
        this.locationState = data.query.results.channel.location.region;
        this.description = data.query.results.channel.item.description;
        this.lat = data.query.results.channel.item.lat;
        this.long = data.query.results.channel.item.long;
        this.todaysWeatherTemp = data.query.results.channel.item.condition.temp;
        this.todaysWeatherCondition = data.query.results.channel.item.condition.text;
        this.todaysWeatherConditionCode = data.query.results.channel.item.condition.Code;
        this.forecast = data.query.results.channel.item.forecast;
        this.noData = false;
        this.toggleWeather = !this.toggleWeather;
        console.log(data);
        this.recentSearches.push({
          recentCity: city,
          recentState: state,
          lat: data.query.results.channel.item.lat,
          long: data.query.results.channel.item.long,
          todaysWeatherTemp: data.query.results.channel.item.condition.temp,
          todaysWeatherCondition: data.query.results.channel.item.condition.text

        })
        this.storage.set('RecentSearches', this.recentSearches);
      })
  }
  // close slide up panel
  closeWeather(city, state) {
    this.toggleWeather = !this.toggleWeather;
  }
  // open recent result with update
  searchRecent(city, state) {
    this.weather = this.httpClient.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%2C%20" + state + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");
    this.weather
      .subscribe(data => {
        this.currentWeather = data.query.results;
        this.locationCity = data.query.results.channel.location.city;
        this.lastUpdated = data.query.results.channel.lastBuildDate;
        this.sunrise = data.query.results.channel.astronomy.sunrise;
        this.sunset = data.query.results.channel.astronomy.sunset;
        this.windChill = data.query.results.channel.wind.chill;
        this.windSpeed = data.query.results.channel.wind.speed;
        this.humidity = data.query.results.channel.atmosphere.humidity;
        this.locationState = data.query.results.channel.location.region;
        this.description = data.query.results.channel.item.description;
        this.todaysWeatherTemp = data.query.results.channel.item.condition.temp;
        this.todaysWeatherCondition = data.query.results.channel.item.condition.text;
        this.todaysWeatherConditionCode = data.query.results.channel.item.condition.Code;
        this.forecast = data.query.results.channel.item.forecast;
        this.noData = false;
        this.toggleWeather = !this.toggleWeather;
      })
  }
  //Remove single result
  deleteSingleResult(i, recentSearches) {
    this.presentLoading();
    this.recentSearches.splice(i, 1);
    this.storage.set('RecentSearches', this.recentSearches);
  }

  goPlaces(lat, long, city, state, todaysWeatherTemp) {
    this.goToPlace.push({
      lat: lat,
      long: long,
      recentCity: city,
      recentState: state,
      todaysWeatherTemp: todaysWeatherTemp,

    })
    this.storage.set('Place', this.goToPlace);

    this.navCtrl.push(PlacesPage);
  }

}
