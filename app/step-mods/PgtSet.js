'use strict';

const StepModule = require('./StepModule');
const docx = require('docx');

const validSettings = {
	torque: {
		A1: '2.5',
		A2: '3.8',
		A3: '4.8',
		A4: '6.3',
		A5: '7.0',
		A6: '8.3',
		A7: '9.2',
		B1: '12.0',
		B2: '16.0',
		B3: '18.4',
		B4: '19.4',
		B5: '22.0',
		B6: '24.0',
		B7: '25.5'
	},
	speed: {
		CCW3: '60',
		CCW2: '30',
		CCW1: '10',
		CW1: '10',
		CW2: '30',
		CW3: '60'
	},
	mtl: [
		'2.5',
		'5.5',
		'10.5',
		'15.5',
		'23.5',
		'30.5'
	]
};

function getCollars(instance) {
	const collars = [instance.torqueCollar, instance.speedCollar];
	if (instance.mtlCollar) {
		collars.push(instance.mtlCollar);
	}
	return collars;
}

function getCollarValues(instance, includeUnits = false) {
	const values = [
		validSettings.torque[instance.torqueCollar],
		validSettings.speed[instance.speedCollar],
		'MTL ' + (instance.mtlCollar || instance.mtlDefault)
	];
	if (includeUnits) {
		values[0] += ' ft-lb';
		values[1] += ' RPM';
	}
	return values;
}

function getSetString(instance) {
	return `PGT [${getCollars(instance).join(', ')}]`;
}

function getValueString(instance) {
	return `(${getCollarValues(instance, true).join(', ')})`;
}

function validateSetting(setting, type) {

	if (type === 'mtl' && !setting) {
		return null;
	}

	let valids;
	if (type === 'mtl') {
		valids = validSettings.mtl;
	} else {
		valids = Object.keys(validSettings[type]);
	}

	if (valids.indexOf(setting) === -1) {
		throw new Error(`Setting ${setting} is not valid for PGT ${type}`);
	}
	return setting;
}

function getMtlAndSocket(mtlOrSocket, socketOrNull = null) {
	let mtl,
		socket;
	const mtlMatch = /^\d{1,2}\.\d{1}$/;

	if (mtlOrSocket && mtlMatch.test(mtlOrSocket)) {
		if (validSettings.mtl.indexOf(mtlOrSocket) === -1) {
			throw new Error(`PGT setting ${mtlOrSocket} does not appear to be a valid MTL setting`);
		}
		mtl = mtlOrSocket;
	} else if (mtlOrSocket) {
		socket = mtlOrSocket;
	}
	if (socketOrNull) {
		if (socket) {
			throw new Error(`this.socket already set to ${socket}`);
		}
		socket = socketOrNull;
	}
	return { mtl: mtl, socket: socket };
}

module.exports = class PgtSet extends StepModule {

	constructor(step, stepYaml) {
		super();
		this.key = 'pgt.set';
		this.step = step;
		this.raw = stepYaml;

		// todo also accept torque/speed/etc separately (e.g. accept an obj instead of string)
		const inputString = stepYaml[this.key];
		const parts = inputString.split(',').map((val) => {
			return val.trim();
		});

		this.torqueCollar = validateSetting(parts[0], 'torque');
		this.speedCollar = validateSetting(parts[1], 'speed');

		const more = getMtlAndSocket(parts[2], parts[3]);

		this.mtlCollar = validateSetting(more.mtl, 'mtl');
		this.socket = more.socket;
		// this.socket = validateSetting(this.socket, 'socket'); // someday validate sockets???

		this.mtlDefault = '30.5';
	}

	alterStepBase() {
		const socket = this.socket ? ` - ${this.socket}` : '';
		return `${getSetString(this)} ${getValueString(this)}${socket}`;
	}

	alterStepDocx() {
		const textRuns = [];
		if (this.step.text) {
			textRuns.push(...this.transform(this.step.text));
		}

		const setPGT = new docx.TextRun({
			text: getSetString(this),
			bold: true
		});

		if (textRuns.length > 0) {
			// if there is step text, put first PGT text on a new line
			setPGT.break();
		}
		textRuns.push(setPGT);

		let valuesText = getValueString(this);
		if (this.socket) {
			valuesText += ` - ${this.socket}`;
		}
		textRuns.push(
			new docx.TextRun({
				text: valuesText
			}).break()
		);

		this.step.text = textRuns;

		return this.step;
	}

};