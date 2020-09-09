---
sidebar_label: multi-unit
title: Multi-Unit Build Pipelines
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


This pipeline contains an example for building multiple deployment units from the same code repository. This is best used with the multibranch pipeline or a pipeline stored in the application code.

## Build Units

We have two build units in this pipeline example; 
* an `apigateway` with an openapi spec
* a `lambda function` which implements the API backend

## Triggers

Changes to the file paths **api/spec** or **api/gw/** will trigger the build process for the `apigateway`. If this is sucessful a build job is triggered to deploy the `apigateway`.

Changes to the files under **lambda/\*** will trigger the build process for the `lambda function`. If it completes, a build job is triggered to deploy the `lambda` deployment-unit.


## Parameters
The "force_*" paramters allow you to override the conditional trigger on the file paths. This is useful in build pipelines that may fail on underlying services or updates to the build hosts are made.

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index)

## Example
```groovy
#!groovy
pipeline {
    agent {
        label '<hamlet agenet label>'
    }
    options {
        timestamps ()
        buildDiscarder(
            logRotator(
                numToKeepStr: '10'
            )
        )
        disableConcurrentBuilds()
        durabilityHint('PERFORMANCE_OPTIMIZED')
        parallelsAlwaysFailFast()
        checkoutToSubdirectory 'build'
    }

    parameters {
        booleanParam(
            name: 'force_apigateway',
            defaultValue: false,
            description: 'Force build of component'
        )

        booleanParam(
            name: 'force_lambda',
            defaultValue: false,
            description: 'Force build of component'
        )
    }

    environment {
        properties_file = '.hamlet/product/<product properties file>'
        slack_channel = '<slack channel>'
        product_cmdb = '<cmdb repo Url>'

        PRODUCT_INFRASTRUCTURE_REFERENCE = 'master'
        PRODUCT_CONFIG_REFERENCE = 'master'

        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        AUTODEPLOY = 'true'
    }


    stages {
        stage('Setup') {
            steps {

                // Product Setup
                dir('.hamlet/product') {
                    git(
                        url: "${env["product_cmdb"]}",
                        credentialsId: '<Github Creds for CMDB>',
                        changelog: false,
                        poll: false
                    )
                }

                // Load in Properties files
                script {
                    def productProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    productProperties.each{ k, v -> env["${k}"] ="${v}" }

                }

                script {
                    def contextProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
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

        stage('API Gateway') {
            when {
                anyOf {
                    changeset "api/spec/**"
                    changeset "api/gw/**"

                    equals expected: true, actual: params.force_apigateway
                }
            }

            environment {
                DEPLOYMENT_UNITS = 'api-v1'
                BUILD_PATH = '/api/gw'
                IMAGE_FORMAT = 'openapi'
                GENERATION_CONTEXT_DEFINED = ''
            }

            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_BASE_DIR}/setContext.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/buildSetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/buildOpenapi.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/manageImages.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
            }

            post {
                success {
                    script {
                        if ( env.BRANCH_NAME == 'master' ) {
                            build job: "../../deploy/${env["ENVIRONMENT"]}-deploy", wait: false, parameters: [
                                string(name: 'DEPLOYMENT_UNITS', value: "${env["DEPLOYMENT_UNITS"]}" ),
                                string(name: 'GIT_COMMIT', value: "${env["GIT_COMMIT"]}"),
                                string(name: 'IMAGE_FORMATS', value: "${env["IMAGE_FORMAT"]}" )
                            ]
                        }
                    }
                }
            }
        }

        stage('API Lambda') {
            when {
                anyOf {
                    changeset "lambda/**"

                    equals expected: true, actual: params.force_lambda
                }
            }

            environment {
                DEPLOYMENT_UNITS = 'lambda-v1'
                BUILD_PATH = 'lambda'
                BUILD_TASKS = 'build'
                IMAGE_FORMAT = 'lambda'
                GENERATION_CONTEXT_DEFINED = ''
            }

            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_BASE_DIR}/setContext.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/buildSetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/buildJS.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/manageImages.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
            }

            post {
                success {
                    script {
                        if ( env.BRANCH_NAME == 'master' ) {
                            build job: "../../deploy/${env["ENVIRONMENT"]}-deploy", wait: false, parameters: [
                                string(name: 'DEPLOYMENT_UNITS', value: "${env["DEPLOYMENT_UNITS"]}" ),
                                string(name: 'GIT_COMMIT', value: "${env["GIT_COMMIT"]}"),
                                string(name: 'IMAGE_FORMATS', value: "${env["IMAGE_FORMAT"]}" )
                            ]
                        }
                    }
                }
            }
        }

    }


    post {
        success {
            slackSend (
                message: "Build Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS} - Commit: ${params.GIT_COMMIT}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "Build Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS} - Commit: ${params.GIT_COMMIT}",
                channel: "${env["slack_channel"]}",
                color: "#D20F2A"
            )
        }
        cleanup {
            cleanWs()
        }
    }
}
```