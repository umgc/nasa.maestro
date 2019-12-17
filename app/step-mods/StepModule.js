'use strict';
const React = require('react');
const uuidv4 = require('uuid/v4');

const TextTransform = require('../writer/TextTransform');
const Abstract = require('../helpers/Abstract');

module.exports = class StepModule extends Abstract {

	constructor() {
		super(['alterStepBase']);
	}

	getOutputTypeFunctions(outputType) {
		const fns = {
			Base: ['Base'],
			EvaDocx: ['EvaDocx', 'Docx', 'Base'],
			Docx: ['Docx', 'Base'],
			EvaHtml: ['EvaHtml', 'Html', 'Base'],
			Html: ['Html', 'Base'],
			SodfDocx: ['SodfDocx', 'Docx', 'Base'],

			// if no react function, ReactFallback will try wrapping Html- or Base-output in JSX
			React: ['React', 'ReactFallback']
		};
		this.outputTypeFns = fns[outputType] || [];
		return this.outputTypeFns;
	}

	alterStep(outputType) {
		const functions = this.getOutputTypeFunctions(outputType);
		let fn;
		for (const suffix of functions) {
			fn = `alterStep${suffix}`;
			if (this[fn] && typeof this[fn] === 'function') {
				return this[fn]();
			}
		}
		throw new Error(`Output function matching ${fn} not found for ${this.constructor.name}`);
	}

	alterStepReactFallback() {
		if (!this.reactBaseStepModule) {
			this.reactFallbackFunction = require('./reactFallbackFunction');
		}

		// wrap JSX in separate file to prevent syntax errors in non-transpiled code
		return this.reactFallbackFunction(this);
	}

	transform(text) {
		if (!this.outputTypeFns) {
			throw new Error('Can\'t call StepModule.transform() until StepModule.getOutputTypeFunctions() called');
		}
		let xformType;
		if (this.outputTypeFns.indexOf('Docx') !== -1) {
			xformType = 'docx';
		} else if (this.outputTypeFns.indexOf('Html') !== -1) {
			xformType = 'html';
		} else if (this.outputTypeFns.indexOf('React') !== -1) {
			xformType = 'react';
		} else {
			xformType = 'text'; // todo not really sure this will work...transforms text to text...
		}
		if (!this.transformer) {
			this.transformer = new TextTransform(xformType);
		}
		return this.transformer.transform(text);
	}
};
