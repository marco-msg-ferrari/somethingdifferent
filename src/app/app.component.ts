import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Axis} from '../app/axis';

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
    axisArray = [];
    axisTransform = [];
    axisPrecision = [];
    query = '';

    constructor(private http: HttpClient){
        this.axisTransform['largo'] = 'lenght';
        this.axisTransform['alto'] = 'height';
        this.axisTransform['ancho'] = 'width';
        this.axisTransform['volumen_maletero_principal'] = 'trunkvolume';
        this.axisTransform['potencia_maxima'] = 'power';

        this.axisPrecision['largo'] = 0;
        this.axisPrecision['alto'] = 0;
        this.axisPrecision['ancho'] = 0;
        this.axisPrecision['volumen_maletero_principal'] = 0;
        this.axisPrecision['potencia_maxima'] = 1;
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

                    if (!isNaN(obj.value.value)) {
                        this.axisArray.push(<Axis> {
                            active: false,
                            slug: obj.slug,
                            name: obj.name,
                            unit: obj.unit,
                            value: obj.value.value,
                            valueFrom: (obj.value.value * 0.9).toFixed(this.axisPrecision[obj.slug]),
                            valueTo: (obj.value.value * 1.1).toFixed(this.axisPrecision[obj.slug]),
                            searchName: this.axisTransform[obj.slug]
                        });
                    }
                });

            },
            err => {
                console.log("Error occured.");
            }
        );
    }

    onClickMe() {
        this.query = '';
        this.axisArray.forEach(obj=> {
            if (obj.active) {
                this.query += '&' + obj.searchName + '-from=' + obj.valueFrom;
                this.query += '&' + obj.searchName + '-to=' + obj.valueTo;
            }
        });
        console.log(this.query);

        this.http.get<VehicleResponse>(
            'https://fapi.km77.com/search/' +
            '?q=ve:car:*&type=vehicle' +
            '&market=[onsale]' +
            '&numdoors=[5]' +
            '&fuel=gasoleo' +
            this.query +
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

