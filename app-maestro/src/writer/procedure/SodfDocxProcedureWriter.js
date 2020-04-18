'use strict';

const docx = require('docx');
const DocxProcedureWriter = require('./DocxProcedureWriter');
const SodfDocxTaskWriter = require('../task/SodfDocxTaskWriter');
// const consoleHelper = require('../../helpers/consoleHelper');

module.exports = class SodfDocxProcedureWriter extends DocxProcedureWriter {

	constructor(program, procedure) {
		super(program, procedure);
		this.lastActor = false;
		this.lastLocation = false;
	}

	getRightTabPosition() {
		return 10800;
	}

	getPageSize() {
		return {
			width: 12240,
			height: 15840,
			orientation: docx.PageOrientation.PORTRAIT
		};
	}

	getPageMargins() {
		return {
			top: 720,
			right: 720,
			bottom: 720,
			left: 720
		};
	}

	/**
	 * Create a docx section from a Task object from this.procedure.tasks
	 * @param {Task} task
	 */
	renderTask(task) {

		const handler = new SodfDocxTaskWriter(
			task,
			this
		);

		this.doc.addSection({
			headers: { default: this.genTaskHeader(task) },
			footers: { default: this.genFooter() },
			size: this.getPageSize(),
			margins: this.getPageMargins(),
			children: [new docx.Table({
				rows: handler.writeDivisions(),
				width: {
					size: 100,
					type: docx.WidthType.PERCENTAGE
				}
				// columnWidths
				// margins: { marginUnitType, top, bottom, right, left }
				// float
				// layout
			})]
		});
	}
};
