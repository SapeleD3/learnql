import {message} from '../constants';
import {IUser} from '../types/Schema';

const isEmpty = (string: string) => {
	if (string.trim() === '') return true;
	return false;
};
const isEmail = (email: any) => {
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.match(regEx)) return true;
	return false;
};

const {mustNotBeEmpty, passwordMustMatch, mustBeValidEmail} = message;

export const validateSignUpData = (data: IUser) => {
	// input validation
	const errors: any = {};
	const {password, username, email, confirmPassword} = data;

	if (isEmpty(email)) {
		errors.email = mustNotBeEmpty;
	} else if (!isEmail(email)) {
		errors.email = mustBeValidEmail;
	}

	if (isEmpty(password)) errors.password = mustNotBeEmpty;
	if (password !== confirmPassword) {
		errors.confirmPassword = passwordMustMatch;
	}
	if (isEmpty(username)) errors.username = mustNotBeEmpty;

	return {
		errors,
		valid: Object.keys(errors).length === 0,
	};
};

export const validateLoginData = (data: IUser) => {
	const errors: any = {};
	const {email, password} = data;

	if (isEmpty(email)) {
		errors.email = mustNotBeEmpty;
	} else if (!isEmail(email)) {
		errors.email = mustBeValidEmail;
	}
	if (isEmpty(password)) errors.password = mustNotBeEmpty;

	return {
		errors,
		valid: Object.keys(errors).length === 0,
	};
};
