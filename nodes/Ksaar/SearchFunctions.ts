import type { IDataObject, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { KsaarRequest } from './helpers';

export async function applicationSearch(
	this: ILoadOptionsFunctions,
	filter: string = '',
): Promise<INodeListSearchResult> {

    let responseData = [];
    let resultData = {
        results: []
    };
    let page_number = 1;

    let endpoint = '';
    const body: IDataObject = {};

    do {
        endpoint = `/applications?limit=500&page=${page_number}`;
        responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
        let results = responseData.results.filter((r: any) => r.name.toLowerCase().includes(filter.toLowerCase())).map((r: any) => {
            return {
                name: r.name,
                value: r.id
            }
        });
        resultData.results = [...resultData.results, ...results] as never[];
        page_number ++;

    } while (responseData.results.length != 0);


    return resultData;

}

export async function workflowSearch(
	this: ILoadOptionsFunctions,
	filter: string = '',
): Promise<INodeListSearchResult> {

    let responseData = [];
    let resultData = {
        results: []
    };

    const application_id = this.getNodeParameter('application_id', 0) as any;
    
    if (application_id.value === '') {
        return resultData;
    }

    let page_number = 1;

    let endpoint = '';
    const body: IDataObject = {};

    do {
        endpoint = `/applications/${application_id.value}/workflows?limit=500&page=${page_number}`;
        responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
        let results = responseData.results.filter((r: any) => r.name.toLowerCase().includes(filter.toLowerCase())).map((r: any) => {
            return {
                name: r.name,
                value: r.id
            }
        });
        resultData.results = [...resultData.results, ...results] as never[];
        page_number ++;

    } while (responseData.results.length != 0);


    return resultData;

}

export async function fileFieldSearch(
	this: ILoadOptionsFunctions,
	filter: string = '',
): Promise<INodeListSearchResult> {

    let responseData = [];
    let resultData = {
        results: []
    };

    const workflow_id = this.getNodeParameter('workflow_id', 0) as any;
    
    if (workflow_id.value === '') {
        return resultData;
    }

    let endpoint = '';
    const body: IDataObject = {};

    endpoint = `/workflows/${workflow_id.value}/fields`;
    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
    let results = responseData.filter((r: any) => r.name.toLowerCase().includes(filter.toLowerCase()) && r.type === "document").map((r: any) => {
        return {
            name: r.name,
            value: r.id
        }
    });

    resultData.results = [...resultData.results, ...results] as never[];

    return resultData;

}

export async function fieldSearch(
	this: ILoadOptionsFunctions,
	filter: string = '',
): Promise<INodeListSearchResult> {

    let responseData = [];
    let resultData = {
        results: []
    };

    const workflow_id = this.getNodeParameter('workflow_id', 0) as any;
    
    if (workflow_id.value === '') {
        return resultData;
    }

    let endpoint = '';
    const body: IDataObject = {};

    endpoint = `/workflows/${workflow_id.value}/fields`;
    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
    let results = responseData.filter((r: any) => r.name.toLowerCase().includes(filter.toLowerCase())).map((r: any) => {
        return {
            name: r.name,
            value: r.id
        }
    });

    resultData.results = [...resultData.results, ...results] as never[];

    return resultData;

}

export async function userSearch(
	this: ILoadOptionsFunctions,
	filter: string = '',
): Promise<INodeListSearchResult> {

    let responseData = [];
    let resultData = {
        results: []
    };

    const application_id = this.getNodeParameter('application_id', 0) as any;
    
    if (application_id.value === '') {
        return resultData;
    }

    let page_number = 1;

    let endpoint = '';
    const body: IDataObject = {};

    do {
        endpoint = `/applications/${application_id.value}/users?limit=500&page=${page_number}`;
        responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
        let results = responseData.results.filter((r: any) => r.email.toLowerCase().includes(filter.toLowerCase()) && r.status === "registered").map((r: any) => {
            return {
                name: `${r.firstName} ${r.lastName} (${r.email})`,
                value: r.email
            }
        });
        resultData.results = [...resultData.results, ...results] as never[];
        page_number ++;

    } while (responseData.results.length != 0);


    return resultData;

}