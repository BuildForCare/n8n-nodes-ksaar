/* eslint-disable n8n-nodes-base/node-param-resource-with-plural-option */

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	// ILoadOptionsFunctions,
	// INodeListSearchResult
} from 'n8n-workflow';

import {
    KsaarRequest
} from './helpers';


import {
    applicationSearch,
    workflowSearch,
    fileFieldSearch,
    userSearch,
    fieldSearch
} from './SearchFunctions';

import {
    formValue
} from './KsaarTypes';

export class Ksaar implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
        displayName: 'Ksaar',
        name: 'ksaar',
        // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
        icon: 'file:ksaar.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
        description: 'Consume Ksaar API',
        defaults: {
            name: 'Ksaar',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'ksaarApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.ksaar.co/v1',
        },
		properties: [
		// Resources and operations will go here
            {
                displayName: 'Send Headers',
                name: 'sendHeaders',
                type: 'boolean',
                default: false,
            },
            {
				displayName: 'Headers',
				name: 'headers',
				type: 'fixedCollection',
                placeholder: 'Add a header',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'HeadersValues',
                        displayName: 'Headers',
                        values: [
                            {
                                displayName: 'Header',
                                name: 'name',
                                type: 'string',
                                default: '',
                                required: true,
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                required: true,
                            },
                        ],
                    },
                ],
				displayOptions: {
					show: {
						sendHeaders: [true],
					},
				},
				default: {},
			},

            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Users',
                        value: 'users',
                    },
                    {
                        name: 'Applications',
                        value: 'applications',
                    },
                    {
                        name: 'Workflows',
                        value: 'workflows',
                    },
                    {
                        name: 'Records',
                        value: 'records',
                    },
                ],
                default: 'users',
            },

			// ----------------------------------
			//         operations:Users
			// ----------------------------------
            {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['users'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get a user',
					},
					// {
					// 	name: 'Update',
					// 	value: 'update',
					// 	description: 'Update a user',
					// 	action: 'Update a user',
					// },
				],
				default: 'get',
			},
			// ----------------------------------
			//         operations:Users:Get
			// ----------------------------------
            {
				displayName: 'User ID',
				name: 'user_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
					show: {
						resource: ['users'],
                        operation: ['get']
					},
				},
				default: '',
                required: true,
			},


			// ----------------------------------
			//         operations:Applications
			// ----------------------------------
            {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['applications'],
					},
				},
				options: [
                    {
                        name: 'Email',
						value: 'email',
						description: 'Get user by email',
						action: 'Get user by email',
					},
					{
						name: 'Fields',
						value: 'fields',
						description: 'Get user\'s fields',
						action: 'Get user s fields',
					},
                    {
                        name: 'Get',
                        value: 'get',
                        description: 'Get applications',
                        action: 'Get applications',
                    },
                    {
                        name: 'Users',
                        value: 'users',
                        description: 'Get users',
                        action: 'Get users',
                    },
                    {
                        name: 'Workflows',
                        value: 'workflows',
                        description: 'Get workflows',
                        action: 'Get workflows',
                    },
				],
				default: 'get',
			},
			// ----------------------------------
			//         operations:Applications:Get
			// ----------------------------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['applications'],
						operation: ['get'],
					},
				},
				default: false,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-return-all
				description: 'Whether to return all results or use pagination',
			},
            {
				displayName: 'Results per Page',
				name: 'results_per_page',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                    maxValue: 500
                },
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['get'],
						returnAll: [false]
					},
				},
				default: 100,
                required: true,
			},
            {
                displayName: 'Page Number',
				name: 'page_number',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                },
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['get'],
						returnAll: [false]
					},
				},
				default: 1,
                required: true,
			},
            {
                displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['get'],
					},
				},
				options: [
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
                ],
				default: 'createdAt',
                required: true,
			},
			// ----------------------------------
			//         operations:Applications:Workflows
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['workflows']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['applications'],
						operation: ['workflows'],
					},
				},
				default: false,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-return-all
				description: 'Whether to return all results or use pagination',
			},
            {
				displayName: 'Results per Page',
				name: 'results_per_page',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                    maxValue: 500
                },
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['workflows'],
						returnAll: [false]
					},
				},
				default: 100,
                required: true,
			},
            {
                displayName: 'Page Number',
				name: 'page_number',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                },
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['workflows'],
						returnAll: [false]
					},
				},
				default: 1,
                required: true,
			},
            {
                displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['workflows']
					},
				},
				options: [
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
                ],
				default: 'createdAt',
                required: true,
			},
			// ----------------------------------
			//         operations:Applications:Users
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['users']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Results per Page',
				name: 'results_per_page',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                    maxValue: 500
                },
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['users']
					},
				},
				default: 100,
                required: true,
			},
            {
                displayName: 'Page Number',
				name: 'page_number',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                },
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['users']
					},
				},
				default: 1,
                required: true,
			},
            {
                displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['users']
					},
				},
				options: [
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
                ],
				default: 'createdAt',
                required: true,
			},
			// ----------------------------------
			//         operations:Applications:Email
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['email']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'User Email',
				name: 'user_email',
				type: 'string',
                placeholder: 'name@compagny.com',
				displayOptions: {
                    show: {
						resource: ['applications'],
                        operation: ['email']
					},
				},
				default: '',
                required: true,
			},
			// ----------------------------------
			//         operations:Applications:Fields
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['applications'],
                        operation: ['fields']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},

			// ----------------------------------
			//         operations:Workflows
			// ----------------------------------
            {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workflows'],
					},
				},
				options: [
					{
						name: 'Get Fields',
						value: 'get_fields',
						action: 'Get fields',
					},
					{
						name: 'Get Records',
						value: 'get_records',
						action: 'Get records',
					},
				],
				default: 'get_records',
			},
			// ----------------------------------
			//         operations:Workflows:Get Records
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_records']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_records']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'Sort By',
				name: 'sort_by',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
                    show: {
						resource: ['workflows'],
                        operation: ['get_records'],
					},
				},
				options: [
					{
						name: 'Created At',
						value: 'createdAt',
					},
					{
						name: 'Updated At',
						value: 'updatedAt',
					},
                ],
				default: 'createdAt',
                required: true,
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['workflows'],
						operation: ['get_records'],
					},
				},
				default: false,
				// eslint-disable-next-line n8n-nodes-base/node-param-description-wrong-for-return-all
				description: 'Whether to return all results or use pagination',
			},
            {
				displayName: 'Filters',
				name: 'filters',
				type: 'fixedCollection',
                placeholder: 'Add a filter',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'filtersValues',
                        displayName: 'Filter',
                        values: [
                            {
                                displayName: 'Field',
                                name: 'field_name',
                                type: 'resourceLocator',
                                modes: [
                                    {
                                        displayName: 'Field',
                                        name: 'list',
                                        type: 'list',
                                        placeholder: 'Select a field...',
                                        typeOptions: {
                                            searchListMethod: 'fieldSearch',
                                            searchable: true,
                                        },
                                    },
                                    {
                                        displayName: 'ID',
                                        name: 'id',
                                        type: 'string',
                                        placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
                                        validation: [
                                            {
                                                type: 'regex',
                                                properties: {
                                                    regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
                                                    errorMessage: 'Not a valid ID',
                                                },
                                            },
                                        ],
                                    },
                                ],
                                default: { mode: 'list', value: '' },
                                required: true,
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Value to set for the field key',
                                required: true,
                            },
                        ],
                    },
                ],
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_records'],
						returnAll: [true],
					},
				},
				default: {},
			},
            {
				displayName: 'Results per Page',
				name: 'results_per_page',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                    maxValue: 500
                },
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_records'],
						returnAll: [false],
					},
				},
				default: 100,
                required: true,
			},
            {
                displayName: 'Page Number',
				name: 'page_number',
				type: 'number',
                typeOptions: {
                    minValue: 1,
                },
				displayOptions: {
                    show: {
						resource: ['workflows'],
                        operation: ['get_records'],
						returnAll: [false],
					},
				},
				default: 1,
                required: true,
			},

			// ----------------------------------
			//         operations:Workflows:Get Fields
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_fields']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['workflows'],
                        operation: ['get_fields']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},


			// ----------------------------------
			//         operations:Records
			// ----------------------------------
            {
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['records'],
					},
				},
				options: [
                    {
                        name: 'Create a Record',
                        value: 'create',
                        action: 'Create a record',
                    },
                    {
                        name: 'Delete a Record',
                        value: 'delete',
                        action: 'Delete a record',
                    },
                    // {
                    //     name: 'Delete a Record File',
                    //     value: 'delete_file',
                    //     action: 'Delete a record file',
                    // },
                    {
                        name: 'Get a Record',
                        value: 'get',
                        action: 'Get a record',
                    },
                    // {
                    //     name: 'Get a Record File',
                    //     value: 'get_file',
                    //     action: 'Get a record file',
                    // },
                    {
												name: 'Update a Record',
												value: 'update',
												action: 'Update a record',
                    },
                    {
												name: 'Update a Record File',
												value: 'update_file',
												action: 'Update a record file',
                    },
				],
				default: 'get',
			},

			// ----------------------------------
			//         operations:Records:Get
			// ----------------------------------
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['get']
					},
				},
				default: '',
                required: true,
			},


			// ----------------------------------
			//         operations:Record:Create a Record
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['create']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['create']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'User',
				name: 'user_email',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'User',
						name: 'list',
						type: 'list',
						placeholder: 'Select an user...',
						typeOptions: {
							searchListMethod: 'userSearch',
							searchable: true,
						},
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@compagny.com',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^.+@[^\.].*\.[a-z]{2,}$',
									errorMessage: 'Not a valid Email',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['create']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
                placeholder: 'Add a field',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'fieldsValues',
                        displayName: 'Field',
                        values: [
                            {
                                displayName: 'Field',
                                name: 'field_id',
                                type: 'resourceLocator',
                                modes: [
                                    {
                                        displayName: 'Field',
                                        name: 'list',
                                        type: 'list',
                                        placeholder: 'Select a field...',
                                        typeOptions: {
                                            searchListMethod: 'fieldSearch',
                                            searchable: true,
                                        },
                                    },
                                    {
                                        displayName: 'ID',
                                        name: 'id',
                                        type: 'string',
                                        placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
                                        validation: [
                                            {
                                                type: 'regex',
                                                properties: {
                                                    regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
                                                    errorMessage: 'Not a valid ID',
                                                },
                                            },
                                        ],
                                    },
                                ],
                                default: { mode: 'list', value: '' },
                                required: true,
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Value to set for the field key',
                                required: true,
                            },
                        ],
                    },
                ],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['create']
					},
				},
				default: {},
			},

			// ----------------------------------
			//         operations:Record:Update a Record
			// ----------------------------------
            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['update']
					},
				},
				default: '',
                required: true,
			},
            {
				displayName: 'User',
				name: 'user_email',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'User',
						name: 'list',
						type: 'list',
						placeholder: 'Select an user...',
						typeOptions: {
							searchListMethod: 'userSearch',
							searchable: true,
						},
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@compagny.com',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^.+@[^\.].*\.[a-z]{2,}$',
									errorMessage: 'Not a valid Email',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
                placeholder: 'Add a field',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'fieldsValues',
                        displayName: 'Field',
                        values: [
                            {
                                displayName: 'Field',
                                name: 'field_id',
                                type: 'resourceLocator',
                                modes: [
                                    {
                                        displayName: 'Field',
                                        name: 'list',
                                        type: 'list',
                                        placeholder: 'Select a field...',
                                        typeOptions: {
                                            searchListMethod: 'fieldSearch',
                                            searchable: true,
                                        },
                                    },
                                    {
                                        displayName: 'ID',
                                        name: 'id',
                                        type: 'string',
                                        placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
                                        validation: [
                                            {
                                                type: 'regex',
                                                properties: {
                                                    regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
                                                    errorMessage: 'Not a valid ID',
                                                },
                                            },
                                        ],
                                    },
                                ],
                                default: { mode: 'list', value: '' },
                                required: true,
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Value to set for the field key',
                                required: true,
                            },
                        ],
                    },
                ],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update']
					},
				},
				default: {},
			},

			// ----------------------------------
			//         operations:Records:Delete
			// ----------------------------------
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['delete']
					},
				},
				default: '',
                required: true,
			},

			// ----------------------------------
			//         operations:Records:Get File
			// ----------------------------------

            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['get_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['get_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Field',
				name: 'field_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Field',
						name: 'list',
						type: 'list',
						placeholder: 'Select a field...',
						typeOptions: {
							searchListMethod: 'fileFieldSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['get_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['get_file']
					},
				},
				default: '',
                required: true,
			},

			// ----------------------------------
			//         operations:Records:Update File
			// ----------------------------------

            {
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Field',
				name: 'field_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Field',
						name: 'list',
						type: 'list',
						placeholder: 'Select a field...',
						typeOptions: {
							searchListMethod: 'fileFieldSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['update_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['update_file']
					},
				},
				default: '',
                required: true,
			},

			// ----------------------------------
			//         operations:Records:Delete File
			// ----------------------------------

				{
				displayName: 'Application',
				name: 'application_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Application',
						name: 'list',
						type: 'list',
						placeholder: 'Select an application...',
						typeOptions: {
							searchListMethod: 'applicationSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['delete_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Workflow',
				name: 'workflow_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Workflow',
						name: 'list',
						type: 'list',
						placeholder: 'Select a workflow...',
						typeOptions: {
							searchListMethod: 'workflowSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['delete_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
				displayName: 'Field',
				name: 'field_id',
				type: 'resourceLocator',
                modes: [
					{
						displayName: 'Field',
						name: 'list',
						type: 'list',
						placeholder: 'Select a field...',
						typeOptions: {
							searchListMethod: 'fileFieldSearch',
							searchable: true,
						},
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
									errorMessage: 'Not a valid ID',
								},
							},
						],
					},
				],
				displayOptions: {
					show: {
						resource: ['records'],
                        operation: ['delete_file']
					},
				},
				default: { mode: 'list', value: '' },
                required: true,
			},
            {
                displayName: 'Record ID',
				name: 'record_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['delete_file']
					},
				},
				default: '',
                required: true,
			},
            {
                displayName: 'File ID',
				name: 'file_id',
				type: 'string',
                placeholder: '4ba0bc35-3ace-4f1d-a877-b5a94619029d',
				displayOptions: {
                    show: {
						resource: ['records'],
                        operation: ['delete_file']
					},
				},
				default: '',
                required: true,
			},
		]
	};


	methods = {
		listSearch: {
			applicationSearch,
			workflowSearch,
            fileFieldSearch,
            userSearch,
            fieldSearch,
		},
	};

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

        let responseData: IDataObject[] = [];

            const resource = this.getNodeParameter('resource', 0) as string;
            const operation = this.getNodeParameter('operation', 0) as string;

            // ------------------------
            //      USERS
            // ------------------------
            if (resource === 'users') {
                if (operation === 'get') {
                    const user_id = this.getNodeParameter('user_id', 0) as string;
                    const endpoint = `/users/${user_id}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
                // else if (operation === 'update') {
                //     const user_id = this.getNodeParameter('user_id', 0) as string;
                //     const endpoint = `/users/${user_id}`;
                //     const body: IDataObject = {
                //         "fields": {

                //         }
                //     };
                //     responseData = await KsaarRequest.call(this, 'PATCH', endpoint, body);
                // }
            }

            // ------------------------
            //      APPLICATIONS
            // ------------------------
            if (resource === 'applications') {
                if (operation === 'get') {
                    const returnAll = this.getNodeParameter('returnAll', 0) as any;
					const sort_by = this.getNodeParameter('sort_by', 0) as string;

					if(returnAll) {
						let page_number = 1;

						let endpoint = '';
						const body: IDataObject = {};
						let resultData = {
							results: []
						};

						do {
							endpoint = `/applications?page=${page_number}&limit=500&sortBy=${sort_by}`;
							resultData = await KsaarRequest.call(this, 'GET', endpoint, body);
							let results = resultData.results.map((r: any) => {
								return r;
							});
							responseData = [...responseData, ...results] as never[];
							page_number ++;

						} while (resultData.results.length != 0);


					} else {
						const results_per_page = this.getNodeParameter('results_per_page', 0) as string;
						const page_number = this.getNodeParameter('page_number', 0) as string;
						const endpoint = `/applications?page=${page_number}&limit=${results_per_page}&sortBy=${sort_by}`;
						const body: IDataObject = {};
						responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
					}
                }
                else if (operation === 'workflows') {
                    const returnAll = this.getNodeParameter('returnAll', 0) as any;
                    const application_id = this.getNodeParameter('application_id', 0) as any;
                    const sort_by = this.getNodeParameter('sort_by', 0) as string;

					if(returnAll) {
						let page_number = 1;

						let endpoint = '';
						const body: IDataObject = {};
						let resultData = {
							results: []
						};

						do {
							endpoint = `/applications/${application_id.value}/workflows?page=${page_number}&limit=500&sortBy=${sort_by}`;
							resultData = await KsaarRequest.call(this, 'GET', endpoint, body);
							let results = resultData.results.map((r: any) => {
								return r;
							});
							responseData = [...responseData, ...results] as never[];
							page_number ++;

						} while (resultData.results.length != 0);

					} else {
						const results_per_page = this.getNodeParameter('results_per_page', 0) as string;
						const page_number = this.getNodeParameter('page_number', 0) as string;
						const endpoint = `/applications/${application_id.value}/workflows?page=${page_number}&limit=${results_per_page}&sortBy=${sort_by}`;
						const body: IDataObject = {};
						responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
					}
                }
                else if (operation === 'users') {
                    const application_id = this.getNodeParameter('application_id', 0) as any;
                    const results_per_page = this.getNodeParameter('results_per_page', 0) as string;
                    const page_number = this.getNodeParameter('page_number', 0) as string;
                    const sort_by = this.getNodeParameter('sort_by', 0) as string;
                    const endpoint = `/applications/${application_id.value}/users?page=${page_number}&limit=${results_per_page}&sortBy=${sort_by}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
                else if (operation === 'email') {
                    const application_id = this.getNodeParameter('application_id', 0) as any;
                    const user_email = this.getNodeParameter('user_email', 0) as string;
                    const endpoint = `/applications/${application_id.value}/users/email/${user_email}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
                else if (operation === 'fields') {
                    const application_id = this.getNodeParameter('application_id', 0) as any;
                    const endpoint = `/applications/${application_id.value}/users/fields`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
            }

            // ------------------------
            //      WORKFLOWS
            // ------------------------
            if (resource === 'workflows') {
                if (operation === 'get_records') {
                    const workflow_id = this.getNodeParameter('workflow_id', 0) as any;
                    const returnAll = this.getNodeParameter('returnAll', 0) as any;
					const sort_by = this.getNodeParameter('sort_by', 0) as string;

					if(returnAll) {
						const filters = this.getNodeParameter('filters', 0) as any;
						let page_number = 1;

						let endpoint = '';
						const body: IDataObject = {};
						let resultData = {
							results: []
						};

						do {
							endpoint = `/workflows/${workflow_id.value}/records?page=${page_number}&limit=500&sortBy=${sort_by}`;
							resultData = await KsaarRequest.call(this, 'GET', endpoint, body);
							let results = resultData.results.map((r: any) => {
								return r;
							});
							if(filters.filtersValues !== undefined) {
								for(let filter of filters.filtersValues) {
									results = results.filter((r: any) => r[filter.field_name.cachedResultName] == filter.value);
								}
							}
							responseData = [...responseData, ...results] as never[];
							page_number ++;

						} while (resultData.results.length != 0);

					} else {
						const results_per_page = this.getNodeParameter('results_per_page', 0) as string;
						const page_number = this.getNodeParameter('page_number', 0) as string;
						const endpoint = `/workflows/${workflow_id.value}/records?page=${page_number}&limit=${results_per_page}&sortBy=${sort_by}`;
						const body: IDataObject = {};
						responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
					}
                }
                else if (operation === 'get_fields') {
                    const workflow_id = this.getNodeParameter('workflow_id', 0) as any;
                    const endpoint = `/workflows/${workflow_id.value}/fields`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
            }

            // ------------------------
            //      RECORDS
            // ------------------------
            if (resource === 'records') {
                if (operation === 'get') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const endpoint = `/records/${record_id}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
                else if (operation === 'create') {
                    const workflow_id = this.getNodeParameter('workflow_id', 0) as any;
                    const user_email = this.getNodeParameter('user_email', 0) as any;
                    const fields = this.getNodeParameter('fields', 0) as any;
                    const endpoint = `/workflows/${workflow_id.value}/records`;
                    const body: IDataObject = {
                        email: user_email.value,
                        form: {}
                    };

                    let myObject: formValue = {};
                    for(let field of fields.fieldsValues) {
                        myObject[field.field_id.value as string] = field.value;
                    }

                    body.form = myObject;

                    responseData = await KsaarRequest.call(this, 'POST', endpoint, body);
                }
                else if (operation === 'update') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const user_email = this.getNodeParameter('user_email', 0) as any;
                    const fields = this.getNodeParameter('fields', 0) as any;
                    const endpoint = `/records/${record_id}`;
                    const body: IDataObject = {
                        email: user_email.value,
                        form: {}
                    };

                    let myObject: formValue = {};
                    for(let field of fields.fieldsValues) {
                        myObject[field.field_id.value as string] = field.value;
                    }

                    body.form = myObject;

                    responseData = await KsaarRequest.call(this, 'PATCH', endpoint, body);
                }
                else if (operation === 'delete') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const endpoint = `/records/${record_id}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'DELETE', endpoint, body);
                }
                else if (operation === 'get_file') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const field_id = this.getNodeParameter('field_id', 0) as any;
                    const endpoint = `/records/${record_id}/files/${field_id.value}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'GET', endpoint, body);
                }
                else if (operation === 'update_file') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const field_id = this.getNodeParameter('field_id', 0) as any;
                    const endpoint = `/records/${record_id}/files/${field_id.value}`;

										const binaryData = this.helpers.assertBinaryData(0, "data");
										const dataBuffer = await this.helpers.getBinaryDataBuffer(0, "data");

                    const body: IDataObject = {};
										body.qqfile = {
											value: dataBuffer,
											options: {
												filename: binaryData.fileName,
											},
										};

                    responseData = await KsaarRequest.call(this, 'POST', endpoint, body, 'multipart/form-data');


                }
                else if (operation === 'delete_file') {
                    const record_id = this.getNodeParameter('record_id', 0) as any;
                    const field_id = this.getNodeParameter('field_id', 0) as any;
                    const file_id = this.getNodeParameter('file_id', 0) as any;
                    const endpoint = `/records/${record_id}/files/${field_id.value}/${file_id}`;
                    const body: IDataObject = {};
                    responseData = await KsaarRequest.call(this, 'DELETE', endpoint, body, 'multipart/form-data');
                }
            }

            return [this.helpers.returnJsonArray(responseData)];
    }
}
