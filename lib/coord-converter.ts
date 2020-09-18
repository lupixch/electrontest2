/**
 * Conversion functions for several coordinate Format.
 */

const swissgrid = require('./swissgrid/wgs84_ch1903.js').Swisstopo;
const fcoord = require('formatcoords');
const Cparse = require('coordinate-parser');

import { Point } from './point';

export const enum Format {
    WGS84_dd,
    WGS84_ddmmss,
    WGS84_ddmmddd,
    Swissgrid1903
};

interface Options {
    latLonSeparator: number;
    decimalPlaces: number;
}

class CoordConverter {
    format: Format;
    options: Options;

    
    constructor(options: Options) {
        this.format = Format.WGS84_ddmmddd;

        const optionDefaults = {
            latLonSeparator: '   ',
            decimalPlaces: 3
        };
        this.options = Object.assign({}, optionDefaults, options);
    }

    setFormat(format: Format) : Format {
        this.format = format;
        return format;
    }

    getFormat(): Format {
        return this.format;
    }

    asPoint(coordstring: string): Point {
        // convert string to point
        let p = {
            latitude: 0,
            longitude: 0
        }
        if (coordstring.length == 0) {
            return p;
        }
        switch(this.format) {
            case Format.WGS84_dd:
            case Format.WGS84_ddmmss:
            case Format.WGS84_ddmmddd:
                // This Format can all be handled by the coordinate-parser lib
                let position = new Cparse(coordstring);
                p.latitude = position.getLatitude();
                p.longitude = position.getLongitude();
                break;

            case Format.Swissgrid1903:
                let swissArray = coordstring.split(/\s+/);
                let y = parseInt(swissArray[0]);
                let x = parseInt(swissArray[1]);
                let wgs = swissgrid.CHtoWGS(y, x);
                p.latitude = wgs[1];
                p.longitude = wgs[0];
                break;

            default:                
            break;
        }

        return p;
    }

    asString(point: Point): string {
        if (!point) {
            point = {
                latitude: 0,
                longitude: 0
            }
        }
        // convert point to string
        let coordstring = "";
        switch(this.format) {
            case Format.WGS84_dd:
                // This conversion needs more precicion
                let save = this.options.decimalPlaces;
                this.options.decimalPlaces = 6;
                coordstring = fcoord(point.latitude, point.longitude).format('Xd', this.options);
                this.options.decimalPlaces = save;
                break;

                case Format.WGS84_ddmmss:
                coordstring = fcoord(point.latitude, point.longitude).format('XD M s', this.options);
                break;
                
            case Format.WGS84_ddmmddd:
                coordstring = fcoord(point.latitude, point.longitude).format('XD m', this.options);
                break;

            case Format.Swissgrid1903:
                let x = swissgrid.WGStoCHx(point.latitude, point.longitude);
                let y = swissgrid.WGStoCHy(point.latitude, point.longitude);
                coordstring = "" + Math.round(y) + this.options.latLonSeparator + Math.round(x);
                break;

            default:                
            break;
        }
        return coordstring;
    }
};


module.exports = {
    CoordConverter : CoordConverter,
    // Format : Format
};
