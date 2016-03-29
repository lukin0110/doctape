#!/usr/bin/env node

'use strict';
const program = require('commander');
const tape = require('../src/tape.js');

/**
 * Kill the process already if the system is invalid
 */
tape.check_system((err) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
});

// Command line handling
program.version('0.0.1');
program
    .command('rmi_untagged')
    .alias('clean')
    .description('Remove all untagged images', {})
    .action(tape.remove_untagged);
program
    .command('rmi_all')
    .description('Remove all images, yes all!')
    .action(tape.remove_all);
program
    .command('rm_exited')
    .description('Remove all exited containers')
    .action(tape.remove_exited);
program
    .command('stopall')
    .description('Stop all running containers')
    .action(tape.stopall);
program
    .command('stats')
    .description('Disk consumption of images')
    .action(tape.stats);
program.parse(process.argv);
