#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const cp = require('child_process');
const emoji = require('node-emoji');
const { Select, Input } = require('enquirer');

const logger = require('./logger');