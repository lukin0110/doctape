/**
 * Exec shell commands
 * https://nodejs.org/api/child_process.html
 * 
 * Shortcuts:
 *  - remove untagged images: docker rmi `docker images -qf dangling=true`
 *  - remove all images: docker rmi $(docker images -q)
 *  - remove exited containers: docker rm `docker ps -aqf status=exited`
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

module.exports = {
    check_system: check_system,
    remove_all: () => {_exec('docker rmi $(docker images -q)');},
    remove_untagged: () => {_exec('docker rmi `docker images -qf dangling=true`');},
    remove_images: remove_images,
    remove_exited: () => {_exec('docker rm `docker ps -aqf status=exited`');}
};
