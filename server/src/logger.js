import moment from 'moment';
import chalk from 'chalk';
const log = console.log;

const getTime = () => {
	return `[${moment().format('YYYY-MM-DD HH:mm:ss')}]`;
};

export const error = (...args) => {
	log(
		`${[chalk.bgRed(chalk.bold(' ERRO '))]} ${chalk.gray(getTime())}`,
		...args
	);
};

export const warn = (...args) => {
	log(
		`${[chalk.bgYellow(chalk.bold(' WARN '))]} ${chalk.gray(getTime())}`,
		...args
	);
};

export const info = (...args) => {
	log(
		`${[chalk.bgCyan(chalk.bold(' INFO '))]} ${chalk.gray(getTime())}`,
		...args
	);
};

export const success = (...args) => {
	log(
		`${[chalk.bgGreenBright(chalk.bold(' SUCC '))]} ${chalk.gray(
			getTime()
		)}`,
		...args
	);
};
