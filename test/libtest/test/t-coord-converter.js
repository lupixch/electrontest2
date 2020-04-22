const basedir = '../../..';
const Cc = require(basedir + '/lib/coord-converter.js').CoordConverter;
const CCFormats = require(basedir + '/lib/coord-converter.js').CCFormats;


let chai = require('chai');
let expect = chai.expect;

let assert = require('assert');

let p1 = {
    latitude: 47.1234,
    longitude: 8.4567
};

// TODO: spacing in coords should be aligned with converter options
let p1Swiss1903 = '677251 219658';
let p1WGS84_ddmmss = 'N47 7 24.24 E8 27 24.12';
let p1WGS84_ddmmddd = 'N47 7.404 E8 27.402';

let p2 = {
    latitude: 47.1235,
    longitude: 8.4568
};


describe('Constructor', function() {
    it(' leads to standard format', function() {
        let cc = new Cc();
        let format = cc.getFormat();
        expect(format).to.equal(CCFormats.WGS84_ddmmddd);
    });
});

describe('Set and get of format type', function() {
    it('changes and returns the correct type', function() {
        let cc = new Cc();
        let format = cc.getFormat();
        expect(format).to.equal(CCFormats.WGS84_ddmmddd);
        cc.setFormat(CCFormats.WGS84_ddmmss);
        format = cc.getFormat();
        expect(format).to.equal(CCFormats.WGS84_ddmmss);
        cc.setFormat(CCFormats.Swissgrid1903P);
        format = cc.getFormat();
        expect(format).to.equal(CCFormats.Swissgrid1903P);
    });
});


describe('Conversion type "WGS84 dd mm.ddd"', function() {
    it(' changes and returns the correct type', function() {
        let cc = new Cc();
        let format = cc.getFormat();
        cc.setFormat(CCFormats.WGS84_ddmmddd);
        p = cc.asPoint(p1WGS84_ddmmddd);
        expect(p.latitude).to.equal(p1.latitude);
        expect(p.longitude).to.equal(p1.longitude);
        expect(cc.asString(p1)).to.equal(p1WGS84_ddmmddd);
    });
});
