---
sidebar_label: environment
title: Manage Environment Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Perform environment-level deployments, including performing a deployment of a specific [mode](../../../../../foundations/lifecycle#deployment-modes) against one or more deployment units.

## Triggers
No triggers.

## Parameters
This pipeline's available parameter values are populated by the [`properties`](../properties/properties) file and so initially, no parameters can be provided. After loading the `properties` file the pipeline will prompt for user selection of the following parameters, which will each filter the pipelines scope:

**ENVIRONMENT**
Add the selected [`environment(s)`](../../../../../foundations/terminology#environment) to the deployment scope.

**LEVELS_LIST**
Add the selected [`deployment level(s)`](../../../../../foundations/lifecycle#deployment-levels) to the deployment scope.

**SEGMENT_UNITS_LIST**
Add the selected [Segment](../../../../../foundations/terminology#segment)-level deployment units to the deployment scope. Requires selection of the Segment deployment level on the LEVELS_LIST parameter.

**SOLUTION_UNITS_LIST**
Add the selected [Solution](../../../../../foundations/terminology#solution)-level deployment units to the deployment scope. Requires selection of the Solution deployment level on the LEVELS_LIST parameter.

**APPLICATION_UNITS_LIST**
Add the selected [Application](../../../../../foundations/terminology#application)-level deployment units to the deployment scope. Requires selection of the Application deployment level on the LEVELS_LIST parameter.

**TREAT_RUN_ID_DIFFERENCES_AS_SIGNIFICANT**
Forces the deployment for every deployment unit matching the selected parameters, even where the deployment unit has no new or modified configuration.

## Stages

### Get Input
Loads the [`properties`](../properties/properties) file and prompts for the selection of the now-configured Parameters.

### Setup Context
Establishes the execution environment context and loads any additional environment variables from the local `context.properties` file.

### Manage Env
Executes a Hamlet "Manage Environment" action against the Parameter selection. This includes sequential template generation and deployment for all deployment units within the scope of the Parameter selection. 

## Example
```groovy
#!groovy

pipeline {
    agent {
        label '<hamlet agent label>'
    }
    options {
        timestamps ()
        buildDiscarder(
            logRotator(
                daysToKeepStr: '14'
            )
        )
        durabilityHint('PERFORMANCE_OPTIMIZED')
        parallelsAlwaysFailFast()
        checkoutToSubdirectory '.hamlet/product/'
    }


    environment {
        properties_file = '.hamlet/product/<product properties file>'

        PRODUCT_INFRASTRUCTURE_REFERENCE = 'master'
        PRODUCT_CONFIG_REFERENCE = 'master'

        SEGMENT = 'default'
    }

    stages {

        stage('Get Input') {
            steps {
                // Load in Properties files
                script {
                    def productProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    productProperties.each{ k, v -> env["${k}"] ="${v}" }

                }

                script {
                    def input = input(
                        message: 'Manage Environment',
                        parameters: [
                            choice(
                                name: 'DEPLOYMENT_MODE',
                                choices: ['update', 'stop', 'hibernate'],
                                description: '''Desired way in which deploy should occur.
                            "update" will attempt a hot cutover from the running deployment to the desired deployment.
                            "stop" will stop the running deployment but not start the desired deployment - mainly intended to facilitate database maintenance without the application'''
                            ),
                            extendedChoice(
                                name: 'ENVIRONMENT',
                                description: 'Environments to manage',
                                multiSelectDelimiter: ',',
                                value: "${ENVIRONMENT_LIST}",
                                quoteValue: false,
                                saveJSONParameterToFile: false,
                                type: 'PT_SINGLE_SELECT',
                                visibleItemCount: 10
                            ),
                            extendedChoice(
                                name: 'LEVELS_LIST',
                                defaultValue: 'segment,solution',
                                description: 'Template levels to process',
                                multiSelectDelimiter: ',',
                                quoteValue: false,
                                saveJSONParameterToFile: false,
                                type: 'PT_CHECKBOX',
                                value: 'segment,solution,application',
                                visibleItemCount: 5
                            ),
                            extendedChoice(
                                name: 'SEGMENT_UNITS_LIST',
                                defaultValue: '',
                                description: 'Segment level units to manage',
                                multiSelectDelimiter: ',',
                                value: "${SEGMENT_UNITS}",
                                quoteValue: false,
                                saveJSONParameterToFile: false,
                                type: 'PT_CHECKBOX',
                                visibleItemCount: 10
                            ),
                            extendedChoice(
                                name: 'SOLUTION_UNITS_LIST',
                                defaultValue: '',
                                description: 'Solution level units to manage',
                                multiSelectDelimiter: ',',
                                value: "${SOLUTION_UNITS}",
                                quoteValue: false,
                                saveJSONParameterToFile: false,
                                type: 'PT_CHECKBOX',
                                visibleItemCount: 10
                            ),
                            extendedChoice(
                                name: 'APPLICATION_UNITS_LIST',
                                defaultValue: '',
                                description: 'Application level units to manage',
                                multiSelectDelimiter: ',',
                                value: "${APPLICATION_UNITS}",
                                quoteValue: false,
                                saveJSONParameterToFile: false,
                                type: 'PT_CHECKBOX',
                                visibleItemCount: 10
                            ),
                            booleanParam(
                                name: 'TREAT_RUN_ID_DIFFERENCES_AS_SIGNIFICANT',
                                defaultValue: false
                            )
                        ]
                    )
                    input.each{ k, v -> env["${k}"] ="${v}" }
                }
            }
        }

        stage('Setup Context') {
            steps {
                script {
                    currentBuild.description = "Environment: ${env["ENVIRONMENT"]}"
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_BASE_DIR}/setContext.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/constructTree.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
            }
        }

        stage('Manage Env') {
            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/manageEnvironment.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
            }
        }
    }
}
```