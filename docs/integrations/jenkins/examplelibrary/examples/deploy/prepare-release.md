---
sidebar_label: prepare
title: Prepare Release Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Creates the templates required for a release and associates the provided Release Identifier with the builds in the current environment. This Release Identifier will then represent this collection of builds to promote through the environments.

## Triggers
This pipeline is intended to be called by the ['Promote Release' pipeline](promote-release) and defines no automatic triggers.

## Parameters
This pipeline accepts a **RELEASE_IDENTIFIER** parameter for the unique Release to be prepared. The **DEPLOYMENT_UNITS** parameter can be provided, however by default it will read its values from an array defined at the top of the file.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Prepare
Prepare the Jenkins execution environment, verify build references can be found (as defined by their build format) in registry, generate application-level deployment-unit templates and update them in the Hamlet CMDB.

### Post Job
After running, this pipeline will notify a defined slack channel of either success or failure. 

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index)

## Example
```groovy
#!groovy
def releaseUnits = [
    '<Your unit list as an array>!'
]

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
        text(
            name: 'DEPLOYMENT_UNITS',
            defaultValue: "${ releaseUnits.join("\n") }",
            description: 'Units to be updated as part of the release preparation. For those units where code references are to be updated, append the detail after the affected unit',
        )


        string(
            name: 'RELEASE_IDENTIFIER',
            defaultValue: '',
            description: 'Identifier for the release. If not provided, the current build number will be used'
        )
    }

    environment {
        properties_file = '.hamlet/product/<product properties pipeline>'
        slack_channel = '<slack channel>'

        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        DEPLOYMENT_UNITS = "${params["DEPLOYMENT_UNITS"]}"
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
                    ${AUTOMATION_BASE_DIR}/setContext.sh -r selective
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
                    ${AUTOMATION_DIR}/prepareReleaseSetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/prepareRelease.sh
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
                message: "Prepare Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS}",
                channel: "${env["slack_channel"]}",
                color: "#50C878"
            )
        }

        failure {
            slackSend (
                message: "Prepare Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS}",
                channel: "${env["slack_channel"]}",
                color: "#D20F2A"
            )
        }
    }
}
```