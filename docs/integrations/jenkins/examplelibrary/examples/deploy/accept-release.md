---
sidebar_label: accept
title: Accept Release Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Accept a release into a specified environment, validate that acceptance and update that environment's build references within the Hamlet CMDB. This process provides the mechanism for promoting build artefacts through a pre-determined environment ordering.

## Triggers
This pipeline is intended to be called by the ['Deploy Release' pipeline](promote-release) and defines no automatic triggers.

## Parameters
This pipeline accepts a **RELEASE_IDENTIFIER** parameter for the release that is to be accepted.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Prepare
Prepare the Jenkins execution environment, validate the acceptance and update the Hamlet CMDB to reflect the acceptance.

## Post Job
After running this pipeline will notify a defined slack channel of either success or failure. 

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index)

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

    parameters {
        string(
            name: 'RELEASE_IDENTIFIER',
            defaultValue: '',
            description: 'Identifier for the release to accept'
        )
    }

    environment {
        properties_file = '.hamlet/product/<product properties file>'
        slack_channel = '<slack channel>'

        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        RELEASE_INDETIFIER = "${params["RELEASE_INDETIFIER"]}"
    }

    stages{
        stage('Setup') {
            steps {

                // Load in Properties files
                script {
                    def productProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    productProperties.each{ k, v -> env["${k}"] ="${v}" }

                }

            }
        }

        stage('Prepare') {
            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_BASE_DIR}/setContext.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/validateAcceptReleaseParameters.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }


                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/constructTree.sh -c ${RELEASE_TAG} -i ${RELEASE_TAG}
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/acceptReleaseSetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/acceptRelease.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                script {
                    currentBuild.description = "Release Id: ${env.RELEASE_IDENTIFIER}"
                }

            }
        }
    }

    post {
        success {
            slackSend (
                message: "Accept Release Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} - Release Id: ${env.RELEASE_IDENTIFIER}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "Accept Release Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} - Release Id: ${env.RELEASE_IDENTIFIER}",
                channel: "${env["slack_channel"]}",
                color: "#D20F2A"
            )
        }
    }
}
```