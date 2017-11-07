import * as utils from '../../../utils/utils';

let date = null;

/**
 * Data holder bootstrap
 */
export function init () {
    date = {
        min: new Date().getTime()
    };
}

/**
 * Process an entry from the array of the raw data
 * @param {object} entry 
 */
export function process (entry) {
    if (entry.date) {
        const millis = utils.getStringDateMilliseconds(entry.date);

        if (millis && millis < date.min) {
            date.min = millis;
        }
    }
}

/**
 * Finish formating data accumulated
 * @param {object} insights 
 */
export function finish (object) {
    object.date = {
        min: date.min,
        max: new Date().getTime()
    };

    date = null;
}