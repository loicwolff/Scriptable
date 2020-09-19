// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: map-marked;
Location.setAccuracyToKilometer();

const loc = await Location.current();

const geo = await Location.reverseGeocode(
    loc.latitude,
    loc.longitude, 
    "fr");

const city = geo[0].postalAddress.city;

console.log(city);

Script.setShortcutOutput(city);

Script.complete();

