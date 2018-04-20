import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

public forecast: Observable<any>;
public toggleWeather: boolean = false;


closeWeather(city, state){
    this.toggleWeather = !this.toggleWeather;   
    this.city = "";
    this.state= "";   
}

search(city, state){

  this.weather = this.httpClient.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%2C%20" + state + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys");
  this.weather
  .subscribe(data => {
    console.log('my data: ', data.query.results);

    this.currentWeather = data.query.results;
    this.locationCity = data.query.results.channel.location.city;
    this.locationState = data.query.results.channel.location.region;
    this.description = data.query.results.channel.item.description;
    
    this.todaysWeatherTemp = data.query.results.channel.item.condition.temp;
    this.todaysWeatherCondition = data.query.results.channel.item.condition.text;
    this.forecast = data.query.results.channel.item.forecast;
     this.noData = false;
     this.toggleWeather = !this.toggleWeather;   


  })}

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {



  }

}
