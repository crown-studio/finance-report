export const waitFor = (msec: number) =>
	new Promise(resolve => {
		setTimeout(() => {
			resolve(`${msec * 100} seconds`);
		}, msec);
	});
