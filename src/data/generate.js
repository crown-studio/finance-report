import fs from 'fs';
import path from 'path';
import { parse } from 'date-fns';

const months = [
	'01_JAN',
	'02_FEV',
	'03_MAR',
	'04_ABR',
	'05_MAI',
	'06_JUN',
	'07_JUL',
	'08_AGO',
	'09_SET',
	'10_OUT',
	'11_NOV',
	'12_DEZ',
];
const dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

function getParsedDate(dateString) {
	return parse(dateString, 'dd/MM/yyyy', new Date());
}

// Function to generate a unique ID
function generateUniqueId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Function to read JSON files from a directory
function mergeDatabase(directory = dirname) {
	const files = fs.readdirSync(directory);
	const jsonFiles = files.filter(file => path.extname(file) === '.json');

	console.log(new URL(import.meta.url).pathname);
	return;

	const data = [];
	for (const file of jsonFiles) {
		const filePath = path.join(directory, file);
		const fileData = fs.readFileSync(filePath, 'utf8');
		const jsonData = JSON.parse(fileData);

		// Add unique ID to each object
		const objectsWithId = jsonData.map(obj => ({ id: generateUniqueId(), ...obj }));
		data.push(...objectsWithId);
	}

	return data;
}

async function spreadDatabase(fileName) {
	// const data = await import(`file://${dirname}/${fileName}.js`, { assert: { type: 'json' } }); // Node 17.5.0
	const data = JSON.parse(fs.readFileSync(`${dirname}/${fileName}.json`, 'utf8'));
	for (let i = 0; i < 11; i++) {
		const entries = data.filter(({ pagamento }) => i === getParsedDate(pagamento).getMonth());
		fs.writeFileSync(`./src/data/files/${months[i]}.js`, JSON.stringify(entries, null, 2));
	}
}

// await spreadDatabase('database');
mergeDatabase();
