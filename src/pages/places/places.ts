import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})

export class PlacesPage {
    constructor(public navCtrl: NavController, public httpClient: HttpClient, private storage: Storage, public loadingCtrl: LoadingController, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {


    }


    public key: Observable<string>;

    public places: Array<any>;
    public placeData: Observable<any>;
    public lat: Observable<any>;
    public long: Observable<any>;

    public currentLat: number = null;
    public currentLong: number = null;



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
        this.getCoords(this.currentLat, this.currentLong);
        this.nativeGeocoder.reverseGeocode(this.currentLat, this.currentLong)
            .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
            .catch((error: any) => console.log(error));

    }

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


    //  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=1500&type=restaurant&keyword=bar&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM"
    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Irvine&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM



    // open recent result with update
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
    }

}
