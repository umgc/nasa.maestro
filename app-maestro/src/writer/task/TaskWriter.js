'use strict';

const consoleHelper = require('../../helpers/consoleHelper');
const Abstract = require('../../helpers/Abstract');

module.exports = class TaskWriter extends Abstract {

	/**
	 * @param {Task} task
	 * @param {ProcedureWriter} procedureWriter
	 */
	constructor(task, procedureWriter) {
		super([
			'addImages',
			'addParagraph',
			'addBlock'
		]);
		this.task = task;

		this.procedureWriter = procedureWriter;
		this.procedure = procedureWriter.procedure;
		this.doc = procedureWriter.doc;

		this.maxImageWidth = 800; // landscape: 800, portrait probably 640
		this.maxImageHeight = 640; // landscape: 640, portrait can be more like 800

		this.stepNumber = 1;
	}

	fitImageInBox(img, box = {}) {

		if (!box.width) {
			box.width = this.maxImageWidth;
		}
		if (!box.height) {
			box.height = this.maxImageHeight;
		}

		if (img.width <= box.width && img.height <= box.height) {
			return img; // already fits, no change
		}

		const oriWidth = img.width,
			oriHeight = img.height;

		if (img.width > box.width) {
			img.width = box.width;
			img.height = Math.round(img.height * (box.width / oriWidth));
		}

		if (img.height > box.height) {
			img.height = box.height;
			img.width = Math.round(oriWidth * (box.height / oriHeight));
		}

		return img;
	}

	scaleImage(sourceFileDims, desiredImage) {
		const widthToHeightRatio = sourceFileDims.width / sourceFileDims.height;

		const imgWarnings = [];
		imgWarnings.check = function(dim, requested, srcSize) {
			if (requested > srcSize) {
				this.push(`Desired ${dim} ${requested}px is greater than file ${dim} ${srcSize}px`);
			}
		};
		imgWarnings.flush = function(imgPath) {
			if (this.length > 0) {
				consoleHelper.warn(
					[`Possibly undesirable dimensions for ${imgPath}`].concat(this), // warnings array
					'Image quality warning',
					true // add a newline above and below warning
				);
			}
		};

		imgWarnings.check('width', desiredImage.width, sourceFileDims.width);
		imgWarnings.check('height', desiredImage.height, sourceFileDims.height);

		// if both dimensions are desired, just return them (no need to scale)
		if (Number.isInteger(desiredImage.width) && Number.isInteger(desiredImage.height)) {
			// OPTIMIZE: add check for desiredImage ratio being significantly
			// different from widthToHeightRatio, and notify user that image may
			// be distorted. Alternatively: just don't allow specifying W and H.
			imgWarnings.flush(desiredImage.path);
			return desiredImage;
		}

		let scaledDims = {};

		// if just desired width is an integer (first check shows both aren't)
		if (Number.isInteger(desiredImage.width)) {
			scaledDims.width = desiredImage.width;
			scaledDims.height = Math.floor(scaledDims.width / widthToHeightRatio);

		// if just desired height is an integer (first check shows both aren't)
		} else if (Number.isInteger(desiredImage.height)) {
			scaledDims.height = desiredImage.height;
			scaledDims.width = Math.floor(scaledDims.height * widthToHeightRatio);

		// neither are valid integers. Keep image at source file's dimensions,
		// unless they are too big. Then scale image to fit.
		} else {
			scaledDims = this.fitImageInBox(sourceFileDims);
		}

		imgWarnings.flush(desiredImage.path);
		return scaledDims;
	}

	writeDivisions() {
		// Array of divisions. A division is a set of one or more series of
		// steps. So a division may have just one series for the "IV" actor, or
		// it may have multiple series for multiple actors.
		//
		// Example:
		// divisions = [
		//   { IV: [Step, Step, Step] },             // div 0: just IV series
		//   { IV: [Step], EV1: [Step, Step] },      // div 1: IV & EV1 series
		//   { EV1: [Step, Step], EV2: [Step] }      // div 2: EV1 & EV2 series
		// ]
		const divisions = this.task.concurrentSteps;
		const divisionElements = [];

		for (const division of divisions) {
			divisionElements.push(
				...this.writeDivision(division)
			);
		}

		return divisionElements;
	}

	preInsertSteps(level, isCheckbox) { // eslint-disable-line no-unused-vars
		return 'preInsertSteps(): No action for base TaskWriter class';
	}

	postInsertSteps(level, isCheckbox) { // eslint-disable-line no-unused-vars
		return 'postInsertSteps(): No action for base TaskWriter class';
	}

	insertStep(step, level = 0) {

		// const cloneDeep = require('lodash/cloneDeep');
		// const step = cloneDeep(originalStep);

		const elements = {
			images: [],
			title: [],
			prebody: [],
			body: [],
			postbody: [],
			checkboxes: []
		};

		if (step.props.images) {
			elements.images.push(...this.addImages(step.props.images));
		}

		if (step.props.title) {
			elements.title.push(step.props.title);
		}

		if (step.props.warnings.length) {
			elements.prebody.push(this.addBlock('warning', step.props.warnings));
		}
		if (step.props.cautions.length) {
			elements.prebody.push(this.addBlock('caution', step.props.cautions));
		}
		if (step.props.notes.length) {
			elements.prebody.push(this.addBlock('note', step.props.notes));
		}
		if (step.props.comments.length) {
			elements.prebody.push(this.addBlock('comment', step.props.comments));
		}

		if (step.props.text.length) {
			// todo: could make text optionally an array to do newlines
			elements.body.push(...step.props.text);
		}

		if (step.props.checkboxes.length) {
			elements.checkboxes.push(...step.props.checkboxes);
		}

		for (const module of step.props.modules) {

			// allow the module to alter this step, changing title, warnings, text, etc
			const changes = module.alterStep(this.setModuleOutputType());
			for (const elementName in changes) {
				switch (changes[elementName].type) {
					case 'APPEND':
						elements[elementName].push(...changes[elementName].content);
						break;

					case 'PREPEND':
						elements[elementName].unshift(...changes[elementName].content);
						break;

					case 'OVERWRITE':
						elements[elementName] = changes[elementName].content;
						break;

					default:
						console.log(changes);
						throw new Error(`${changes[elementName].type} not a valid insertion type`);
				}
			}

		}

		if (elements.body.length) {
			elements.body = this.addStepText(elements.body, {
				level: level,
				actors: step.context.actors,
				columnKeys: step.props.columnKeys
			});
		}

		for (let t = 0; t < elements.title.length; t++) {
			// why you'd want multiple titles I do not know...but just in case, apply addTitleText()
			// to each of them.
			elements.title[t] = this.addTitleText(elements.title[t], step.props.duration);
		}

		if (elements.checkboxes.length) {
			const grandChildren = [];
			const preSteps = this.preInsertSteps(level + 1, true);
			if (preSteps) {
				grandChildren.push(preSteps);
			}
			for (const checkstep of elements.checkboxes) {
				grandChildren.push(this.addCheckStepText(checkstep, level + 1));
			}
			const postSteps = this.postInsertSteps(level + 1, true);
			if (postSteps) {
				grandChildren.push(postSteps);
			}

			if (this.wrapStepLists) {
				elements.checkboxes = [this.wrapStepLists(grandChildren)];
			} else {
				elements.checkboxes = grandChildren;
			}
		}

		if (step.props.substeps.length) {
			const grandChildren = [];

			// FIXME why does substeps not push preInsertSteps to children?
			this.preInsertSteps(level + 1);
			for (const substep of step.props.substeps) {
				grandChildren.push(...this.insertStep(substep, level + 1));
			}
			this.postInsertSteps(level + 1);

			if (this.wrapStepLists) {
				elements.grandChildren = [this.wrapStepLists(grandChildren)];
			} else {
				elements.grandChildren = grandChildren;
			}
		} else {
			elements.grandChildren = [];
		}

		// allow TaskWriters to alter elements at this point.
		this.insertStepPostProcess(elements, step);

		const children = [
			...elements.images,
			...elements.prebody,
			...elements.title,
			elements.body,
			...elements.postbody,
			...elements.checkboxes,
			...elements.grandChildren
		];

		if (!level || level === 0) {
			this.stepNumber++;
		}

		return children;
	}

	insertStepPostProcess(/* elements, step */) {
		return true;
	}
};
