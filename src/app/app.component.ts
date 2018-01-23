import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    nql = 've:car:hyundai:i30:2012:5-puertas:tecno:i30-14-crdi-110-cv-tecno';
    apiKey = '';
    tlpt: any = {};
    alternativeArray: any = {};
    maletero: any = {};
    maleteroFrom: any = {};
    maleteroTo: any = {};
    largo: any = {};
    largoFrom: any = {};
    largoTo: any = {};

    constructor(private http: HttpClient){
    }

    ngOnInit(): void {
        this.http.get<VehicleResponse>(
            'https://fapi.km77.com/vehicles/' + this.nql +
            '?withmeasurements' +
            '&k=' + this.apiKey
        ).subscribe(
            data => {
                this.tlpt = data.tlpts[0];

                this.tlpt.measurements.forEach(obj=> {
                    if (obj.slug === 'largo') {
                        this.largoFrom = obj.value.value - 50;
                        this.largo = obj.value.value;
                        this.largoTo = obj.value.value + 50;
                    }
                    if (obj.slug === 'volumen_maletero_principal') {
                        this.maleteroFrom = obj.value.value - 50;
                        this.maletero = obj.value.value;
                        this.maleteroTo = obj.value.value + 50;
                   }
                });

            },
            err => {
                console.log("Error occured.");
            }
        );
    }

    onClickMe() {
        this.http.get<VehicleResponse>(
            'https://fapi.km77.com/search/' +
            '?q=ve:car:*&type=vehicle' +
            '&market=[onsale]' +
            '&numdoors=[5]' +
            '&length-from=' + this.largoFrom + '&length-to=' + this.largoTo +
            '&width-from=1120&width-to=2760' +
            '&height-from=900&height-to=2680' +
            '&trunkvolume-from=' + this.maleteroFrom + '&trunkvolume-to=' + this.maleteroTo +
            '&price-asc=undefined' +
            '&first=1&seek=20' +
            '&k=' + this.apiKey
        ).subscribe(
            data => {
                this.alternativeArray = data.tlpts;
            },
            err => {
                console.log("Error occured.");
            }
        );
    }
}

interface VehicleResponse {
    numfirst: string;
    tlpts: object;
}

