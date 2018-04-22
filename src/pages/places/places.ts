import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

@Component({
    selector: 'page-places',
    templateUrl: 'places.html'
})

export class PlacesPage {
    constructor(public navCtrl: NavController, public httpClient: HttpClient, private storage: Storage, public loadingCtrl: LoadingController) { }



    public places: Array<any>;
    public placeData: Observable<any>;
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
    }


    //  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=1500&type=restaurant&keyword=bar&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM"
    // https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Irvine&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM



    // open recent result with update
    loadThingsToDo(places, lat, long, placeData) {
        placeData = "";
        places = [];
        lat = "33.6656706";
        long = "-117.7498381";
        this.placeData = this.httpClient.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=2500&type=restaurant&keyword=bar&key=AIzaSyBnUd-L4TY1Bj0pYxtowBTAWlZ_xTBBeAM");
        this.placeData
            .subscribe(data => {
                console.log(data.results);
                this.places = data.results;
            })
    }

}
