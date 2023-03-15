import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions
} from 'n8n-core';

import {
	NodeApiError,
	NodeOperationError,
	IDataObject
} from 'n8n-workflow';

/**
 * Make an API request to Ksaar
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */

export async function KsaarApiAuth(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions): Promise<any> {

	const credentials = await this.getCredentials('ksaarApi');

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

        return 'Basic'.concat(' ', Buffer.from(credentials.login.toString().concat(":", credentials.password.toString())).toString('base64'));
	}

export async function KsaarRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {}
):  Promise<any> {

	const auth = await KsaarApiAuth.call(this);

	const options = {
		headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
		method,
		body,
		uri: `https://api.ksaar.co/v1${endpoint}`,
		json: true,
	};

	console.log(options);

	try { 
		return await this.helpers.request!.call(this, options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error, { message: error.response.data.message});
	}
}