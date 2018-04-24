import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PlacesDetailsPage } from '../places-details/places-details';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})

export class PlacesPage {
    constructor(public navCtrl: NavController, public httpClient: HttpClient, private storage: Storage, public loadingCtrl: LoadingController, private geolocation: Geolocation) { }



    public lat: Observable<any>;
    public long: Observable<any>;
    public currentLat: number = null;
    public currentLong: number = null;
    public fourPlaceData: Observable<any>;
    public fourPlaces: Array<any>;
    public goToPlace: Array<any> = [];
    public noData: boolean = false;
    public temp: Observable<any>;

    public city: Observable<any>;
    public state: Observable<any>;


    public moreDetailsData: Observable<any>;
    public moreDetails: Array<any>;
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

        this.storage.get('Place').then((val) => {
            if (val != null) {
                this.goToPlace = val;
                this.currentLat = val[val.length - 1].lat;
                this.currentLong = val[val.length - 1].long;
                this.city = val[val.length - 1].recentCity;
                this.state = val[val.length - 1].recentState;
                this.temp = val[val.length - 1].todaysWeatherTemp;
                console.log(this.temp);
                this.fourApi(this.lat, this.long, this.currentLat, this.currentLong, this.fourPlaceData, this.fourPlaces, this.city, this.state);
            } else {
                this.getCoords(this.currentLat, this.currentLong);
                this.fourApi(this.lat, this.long, this.currentLat, this.currentLong, this.fourPlaceData, this.fourPlaces, this.city, this.state);
                console.log('fallback');
            }

        });




    }

    /*     ionViewWillLeave() {
            this.storage.set('Place', []).then((val) => {
                if (val != null) {
                    console.log(val);
    
                } else {
                    console.log(val);
                }
    
            });
        } */

    getCoords(currentLat, currentLong) {
        currentLat = null;
        currentLong = null;
        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLong = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
            // data can be a set of coordinates, or an error (if an error occurred).
            this.currentLat = data.coords.latitude
            this.currentLong = data.coords.longitude
        });
    }

    // open recent result with update
    fourApi(lat, long, currentLat, currentLong, fourPlaceData, fourPlaces, city, state) {
        fourPlaceData = "";
        fourPlaces = [];
        lat = this.currentLat;
        long = this.currentLong;

        const hotWeatherResults = "4d4b7104d754a06370d81259,56aa371be4b08b9a8d5734db,4fceea171983d5d06c3e9823,52e81612bcbc57f1066b79ea,52e81612bcbc57f1066b79eb,4bf58dd8d48988d17f941735,56aa371be4b08b9a8d5734de,56aa371be4b08b9a8d573514,4bf58dd8d48988d1f4931735,4bf58dd8d48988d182941735,4bf58dd8d48988d193941735,4d4b7105d754a06373d81259,5267e4d9e4b0ec79466e48c7,5267e4d9e4b0ec79466e48d1,5267e4d8e4b0ec79466e48c5";
        this.fourPlaceData = this.httpClient.get("https://api.foursquare.com/v2/venues/search?ll=" + lat + "," + long + "&categoryId=" + hotWeatherResults + "&radius=25000&client_id=AZGPPKRH4O4VYXUAKN3BJZSGULVAJWTBGUVXKKLWU0W34DVQ&client_secret=SNSTJLXZGQHWKYQZA3PLIA3A1LYHWRKHFG43OXJGYJXIJ55I&v=20180522");
        this.fourPlaceData
            .subscribe(data => {
                this.fourPlaces = data.response.venues;
            })
    }


    details(id) {
        this.moreDetailsData = this.httpClient.get("https://api.foursquare.com/v2/venues/" + id + "?&oauth_token=TSRW3DTOK4WFIK0UXUYTPA5PDVIGICSVHPLVNRU0WDSHTXQ0&v=20180423");
        this.moreDetailsData
            .subscribe(data => {
                this.moreDetails = data.response;
                this.storage.set('Details', this.moreDetails);
                console.log(this.moreDetails);
                this.navCtrl.push(PlacesDetailsPage);

            })
    }

}






    //  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=1500&type=restaurant&keyword=bar&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM"
    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Irvine&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM
    // open recent result with update
    /*    
        public key: Observable<string>;

    public places: Array<any>;
    public placeData: Observable<any>;
    loadThingsToDo(places, lat, long, placeData, key, currentLat, currentLong) {
            placeData = "";
            places = [];
            lat = this.currentLat;
            long = this.currentLong;
            key = "AIzaSyDV5DaD-baiwy3xNbrT36ALKIxncLq43U0";
            console.log(this.currentLat, this.currentLong);
            this.placeData = this.httpClient.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=2500&type=restaurant&keyword=bar&key=" + key);
            this.placeData
                .subscribe(data => {
                    this.places = data.results;
                })
        } */


    //categoryId=4bf58dd8d48988d182941735,4d4b7105d754a06374d81259