/**
 * Exec shell commands
 * https://nodejs.org/api/child_process.html
 */
'use strict';
const os = require('os');
const exec = require('child_process').exec;

/**
 * Removes a list of docker images.
 *
 * @param {string[]} images - list of images hashes
 * @private
 */
function remove_images(images) {
    for(let i=0; i < images.length; i++) {
        exec('docker rmi -f ' + images[i], (err, stdout) => {
            if(err) {
                console.error(err);
            } else {
                console.log(stdout);
            }
        });
    }
}

/**
 * Execute docker commands
 *
 * @param {string} cmd
 * @private
 */
function _exec(cmd) {
    exec(cmd, (err, stdout) => {
        if(err) {
            console.error(err);
        } else {
            console.log(stdout);
        }
    });
}

/**
 * Will execute the callback with an error object if it's not a valid system or if docker is not installed
 *
 * https://nodejs.org/api/os.html#os_os_platform
 *
 * @param {Function} callback - callback with a error
 */
function check_system(callback) {
    let allowed = ['darwin', 'freebsd', 'linux'];
    // console.log('OS: ' + os.platform());

    if(allowed.indexOf(os.platform()) === -1) {
        callback(new Error('Operating system is not supported'));

    } else {
        exec('type docker', (err) => {
            if(err) {
                callback(new Error('Docker is not installed'));
            } else {
                // We have a go!
                callback();
            }
        });
    }
}

function stats() {
    exec('docker images', (err, stdout) => {
        if(!err) {
            let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            let list = stdout.split('\n');
            let size_position = list[0].indexOf('SIZE');
            let bytes = 0;

            for(let i=1; i<list.length; i++) {
                // console.log(list[i].split(' '));
                let tuple = list[i].substring(size_position, list[i].length).split(' ');
                let floaty = parseFloat(tuple[0]);
                if(!Number.isNaN(floaty)) {
                    let power = sizes.indexOf(tuple[1]);
                    bytes += floaty * Math.pow(1024, power > -1 ? power : 0);
                }
            }
            let formatted = (bytes / Math.pow(1024, 3)).toPrecision(3);
            console.log('Images Size: ' + formatted + 'GB');
        }
    });    
}

module.exports = {
    check_system: check_system,
    remove_all: () => {_exec('docker rmi $(docker images -q)');},
    remove_untagged: () => {_exec('docker rmi `docker images -qf dangling=true`');},
    remove_images: remove_images,
    stats: stats,
    remove_exited: () => {_exec('docker rm `docker ps -aqf status=exited`');},
    stopall: () => {_exec('docker stop `docker ps -q`')}
};
