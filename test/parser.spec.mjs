import { assert, expect } from 'chai'
import { dirname, join } from 'path'

import { StepToJsonParser } from '../src/parser.js'
import { fileURLToPath } from 'url';
import { fixSpecialChars } from '../src/utils.js'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stepFile = readFileSync(join(__dirname, '/Workbench.stp'), { encoding: 'utf8' });
const parser = new StepToJsonParser(stepFile);

describe('Testing parser', () => {
    describe('Testing function to parse', () => {
        it('Parsed STEP-file should match expected result', () => {
            const actualResult = parser.parse();

            const fileContent = readFileSync(join(__dirname, 'Workbench.json'));
            const expectedResult = JSON.parse(fileContent);
            assert.deepEqual(
                actualResult,
                expectedResult,
                "Parsed structure doesn't match the expected structure"
            );
        });
    });

    describe('Testing parsing with a uuid', () => {
        it('All entries of parsed structure should contain a property "uuid"', () => {
            const actualResult = parser.parseWithUuid();

            // Assumption here: If rootObject.contains array has property 'uuid', then all components will have a property 'uuid'
            actualResult.contains.forEach((containedElement) => {
                expect(containedElement).to.haveOwnProperty('uuid');
            });
        });
    });
});

describe('Testing util functions', () => {
    describe('Testing function to fix special chars', () => {
        it('Umlauts should be fixed', () => {
            const stepRenderedTextWithUmlauts =
                '\\X\\C4 - \\X\\E4 - \\X\\D6 - \\X\\F6 - \\X\\DC - \\X\\FC';
            const textWithCorrectUmlauts = 'Ae - ae - Oe - oe - Ue - ue';

            assert.equal(
                fixSpecialChars(stepRenderedTextWithUmlauts),
                textWithCorrectUmlauts,
                'Function should fix German umlauts'
            );
        });
    });
});
