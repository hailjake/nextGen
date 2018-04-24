import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { IfObservable } from 'rxjs/observable/IfObservable';

@Component({
    selector: 'page-places-details',
    templateUrl: 'places-details.html'
})

export class PlacesDetailsPage {
    constructor(public navCtrl: NavController, public httpClient: HttpClient, private storage: Storage, public loadingCtrl: LoadingController, private geolocation: Geolocation) { }

    public details: Observable<any>;
    public name: Observable<any>;
    public photos: Array<any>;
    public contactPhone: Observable<any>;
    public formattedAddress: Observable<any>;

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
        this.storage.get('Details').then((val) => {
            if (val != null) {
                this.details = val;
                this.name = val.venue.name;
                this.contactPhone = val.venue.contact.phone;
                this.formattedAddress = val.venue.location.formattedAddress;

                this.photos = val.venue.photos.groups;

            } else {

                console.log('fail');
            }

        });




    }


}