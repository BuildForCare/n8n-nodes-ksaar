
 import {
	IWebhookFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeApiError,
 } from 'n8n-workflow';


import {
    KsaarRequest
} from './helpers';


 export class KsaarTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Ksaar Trigger',
        name: 'ksaarTrigger',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:ksaar.png',
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["event"]}}',
        description: 'Handle Ksaar events via webhooks',
        defaults: {
            name: 'Ksaar Trigger',
        },
        inputs: [],
        outputs: ['main'],
        credentials: [
            {
                name: 'ksaarApi',
                required: true,
            }
        ],
        webhooks: [
            {
                name: 'default',
                httpMethod: 'POST',
                responseMode: 'lastNode',
                path: 'webhook',
            },
        ],
        properties: [
            {
                displayName: 'Authentification',
                name: 'x-auth',
                type: 'string',
                required: true,
                default: '',
                description: 'Add x-auth with this value on your headers request'
            },
            {
                displayName: 'Event',
                name: 'event',
                type: 'options',
                required: true,
                default: 'rowAdded',
                options: [
                    {
                        name: 'Row Added',
                        value: 'rowAdded',
                    },
                    {
                        name: 'Row Updated',
                        value: 'rowUpdated',
                    },
                    {
                        name: 'Row Deleted',
                        value: 'rowDeleted',
                    },
                ],
            },
        ],
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {

        let workflowData: INodeExecutionData[] = [];
        let responseData: IDataObject[] = [];

        const event = this.getNodeParameter('event', 0) as string;
        const xAuth = this.getNodeParameter('x-auth', 0) as string;

        const header = this.getHeaderData();

        if(xAuth !== header["x-auth"]) {
            throw new NodeApiError(this.getNode(), { message : "Error Authentification"}, { message : "Error Authentification"});
        }

        if(event === "rowAdded") {
            const data = this.getBodyData();

            const endpoint = `/records/${data.rowId}`;
            const body: IDataObject = {};

            responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
            workflowData = this.helpers.returnJsonArray(responseData);

        }
        else if(event === "rowUpdated") {
            const data = this.getBodyData();

            const endpoint = `/records/${data.rowId}`;
            const body: IDataObject = {};

            responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
            workflowData = this.helpers.returnJsonArray(responseData);
        }
        else if(event === "rowDeleted") {
            const data = this.getBodyData();
            responseData = [
                {
                "rowId": data.rowId
                }
            ];
            workflowData = this.helpers.returnJsonArray(responseData);

        }

	    return {
            workflowData: [workflowData],
        };
    }
 }
