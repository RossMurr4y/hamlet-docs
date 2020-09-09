---
sidebar_label: publish expo app
title: Publishing an Expo App
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Parameters

**ENVIRONMENT** 
Add the selected [`environment(s)`](../../../../../foundations/terminology#environment) to the pipeline scope.

**DEPLOYMENT_UNIT**
Add the selected [`deployment unit`](../../../../../foundations/lifecycle#deployment-units) to the pipeline scope.

**FORCE_BINARY_BUILD**
Force the application binary build, even if the version hasn't changed.

**SUBMIT_BINARY**
Submit the binary to TestFlight for testing.

**DISABLE_OTA**
Disable the deployment of the OTA build artefact to the Expo Cloud Distribution Network (CDN).

## Environment

**BINARY_BUILD_PROCESS**
Specify the build process to use for the build artefacts. `fastlane` or `turtle` are supported.
* `fastlane` - for Expo ejected or bare workflows
* `turtle` - for Expo client-based builds

**TURTLE_VERSION**
Optional - version-locks Turtle to a specific version, ensuring the availability of a specific Expo SDK required for your build.
Each Turtle version only includes a [specific collection of SDK builders](ttps://github.com/expo/turtle/tree/master/shellTarballs). If you are keeping up-to-date with Expo releases, remove this environment variable to use the default.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Run Publish Expo
Publish build artefacts to Expo.

### Sentry Release
Upload application Source Map files to Sentry. Only applicable if using [Sentry](https://sentry.io/welcome/). This should only be performed in the first environment the application is published into.

### Post Job
After running, this pipeline will notify a defined slack channel of either success or failure.

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index).

## Example
```groovy
#!groovy

pipeline {
    agent {
        label '<osx agent label>'
    }
    options {
        timestamps ()
        buildDiscarder(
            logRotator(
                daysToKeepStr: '30'
            )
        )
        durabilityHint('PERFORMANCE_OPTIMIZED')
        parallelsAlwaysFailFast()
        skipDefaultCheckout()
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['integration', 'preproduction', 'production'],
            description: 'Environment to run the publish in'
        )

        choice(
            name: 'DEPLOYMENT_UNIT',
            choices: ['myapp-v1'],
            description: 'Unit to be published'
        )

        booleanParam(
            name: 'FORCE_BINARY_BUILD',
            defaultValue: false,
            description: 'Force the build of binary images'
        )

        booleanParam(
            name: 'SUBMIT_BINARY',
            defaultValue: false,
            description: 'Submit binary to app store for testing'
        )

        booleanParam(
            name: 'DISABLE_OTA',
            defaultValue: false,
            description: 'Disable the deployment of an OTA to the CDN. Useful when doing library updates in binary images'
        )
    }

    environment {
        slack_channel = ''
        BINARY_BUILD_PROCESS = 'fastlane'
        TURTLE_VERSION = '0.16.2'
    }

    stages {
        stage('Setup Context') {
            steps {
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

        stage('Run Publish Expo') {
            environment {
                DEPLOYMENT_UNIT = "${params["DEPLOYMENT_UNIT"]}"
                FORCE_BINARY_BUILD = "${params["FORCE_BINARY_BUILD"]}"
                SUBMIT_BINARY = "${params["SUBMIT_BINARY"]}"
                DISABLE_OTA = "${params["DISABLE_OTA"]}"
            }

            steps {
                script {
                    currentBuild.description = "Environment: ${env["ENVIRONMENT"]} - Deployment unit: ${env["DEPLOYMENT_UNIT"]}"
                }

                sh '''#!/bin/bash
                ${GENERATION_DIR}/runExpoAppPublish.sh -u "${DEPLOYMENT_UNIT}"
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
            }

            post {
                success {
                    publishHTML(
                        [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'reports/',
                            reportFiles: 'build-report.html',
                            reportName: 'Expo Build Report',
                            reportTitles: ''
                        ]
                    )
                }
            }
        }

        stage('Sentry release') {
            when {
                equals expected: '<environment>', actual: "${params.ENVIRONMENT}"
            }

            steps {

                script {
                    def chainProperties = readProperties interpolate: true, file: "${WORKSPACE}/chain.properties";
                    chainProperties.each{ k, v -> env["${k}"] ="${v}" }
                }
                build job: '../utilities/sentry-release', wait: true, parameters: [
                    string(name: 'SENTRY_SOURCE_MAP_S3_URL', value: "${env["SENTRY_SOURCE_MAP_S3_URL"]}"),
                    string(name: 'SENTRY_URL_PREFIX', value: "${env["SENTRY_URL_PREFIX"]}"),
                    string(name: 'DEPLOYMENT_UNIT', value: "${env["DEPLOYMENT_UNIT"]}")
                ]
            }
        }
    }

    post {
        success {
            slackSend (
                message: "*Success* | <${BUILD_URL}|${JOB_NAME}> \n ${DETAIL_MESSAGE}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "*Failure* | <${BUILD_URL}|${JOB_NAME}> \n ${DETAIL_MESSAGE}",
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