import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class KsaarApi implements ICredentialType {
    name = 'ksaarApi';
    displayName = 'Ksaar API';
    icon = 'file:ksaar.png';
    documentationUrl = 'https://api.ksaar.co/open-api/';
    properties: INodeProperties[] = [
        {
            displayName: 'Login',
            name: 'login',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        }
    ];
}