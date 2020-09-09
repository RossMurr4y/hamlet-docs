---
sidebar_label: promote
title: Promote Release Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Promote a Release Identifier from the prior environment into the environment specified on this pipeline. All build configuration from the previous environment is "promoted" into this one.

## Triggers
This pipeline is intended to be triggered only when a build has passed testing. The example expects a manual trigger, although can be easily modified to incorporate other release gates.

## Parameters
This pipeline accepts a **RELEASE_IDENTIFIER** which it will verify exists in the Hamlet CMDB against the environment prior to one defined in this pipeline.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Prepare
Promotes build references from their prior environment, verifies the promotion to this pipeline's environment and commits the changes to the Hamlet CMDB.

### Post Job
After running, this pipeline will notify a defined slack channel of either success or failure.

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index).

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
            description: 'Identifier for the release. If not provided, the current build number will be used'
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
                    ${AUTOMATION_BASE_DIR}/setContext.sh -r promotion
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/promoteRelease.sh
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

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/confirmBuilds.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/updateBuildReferences.sh
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
                message: "Promote Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "Promote Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT}",
                channel: "${env["slack_channel"]}",
                color: "#D20F2A"
            )
        }
    }
}
```