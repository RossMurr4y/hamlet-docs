---
sidebar_label: continuous deploy
title: Continuous Deploy Release Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Updates build reference(s) in the Hamlet CMDB and initiates a deployment.

## Triggers
This pipeline is intended to be called by the ['Build' pipeline](../build/single) for Continuous Deployment into the first environment. 

If deployment across [Segments](../../../../../../foundations/terminology#segment) is required, an additional parameter could be created in the 'Build' pipeline to supply the Segment value alongside the other parameters.

## Parameters
The 'Build' job supplies the required parameters for this pipeline.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Update Build Refs
Stores the hash value of the "Git Commit" in the current Environment/Segment/DeploymentUnit's `build.json` within the Hamlet CMDB.

### Deploy
Creates and deploys all application-level component templates from the list of Deployment Units supplied by the 'Build' pipeline. Tags the CMDB repository with the deployment reference and commits the generated application templates back to the CMDB.

### Post Job
After running, this pipeline will notify a defined slack channel of either success or failure.

## Scripts
This example uses groovy scripts from the [jenkins-shared-library](../../../scriptlibrary/index).

## Example
```groovy
#!groovy

pipeline {
    agent {
        label '<Hamlet label>'
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
        skipDefaultCheckout()
    }

    parameters {
        string(
            name: 'DEPLOYMENT_UNITS',
            defaultValue: '',
            description: 'The git commit to use for the deployment update'
        )
        string(
            name: 'GIT_COMMIT',
            defaultValue: '',
            description: 'The git commit to use for the deployment update'
        )
        string(
            name: 'IMAGE_FORMATS',
            defaultValue: '',
            description: 'The image format of the deployment units'
        )
        booleanParam(
            name: 'TREAT_RUN_ID_DIFFERENCES_AS_SIGNIFICANT',
            defaultValue: false
        )
    }

    environment {
        properties_file = '.hamlet/product/<PRODUCT PROPERTIES FILE LOCATION>'
        slack_channel = '#<slack channel>'

        PRODUCT_INFRASTRUCTURE_REFERENCE = 'master'
        PRODUCT_CONFIG_REFERENCE = 'master'

        MODE = 'update'
        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        AUTODEPLOY = 'true'
    }

    stages {
        stage('Setup Context') {
            steps {

                // Product Setup
                dir('.hamlet/product') {
                    checkout scm
                }

                // Load in Properties files
                script {
                    def productProperties = readProperties interpolate: true, file: "${env.properties_file}";
                    productProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                script {
                    currentBuild.description = "DeploymentUnits: ${params.DEPLOYMENT_UNITS} - CodeCommit: ${params.GIT_COMMIT}"
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

        stage('Update Build Refs') {
            when{
                allOf {
                    not {
                        equals expected: '', actual: "${params.DEPLOYMENT_UNITS}"
                    }
                    not {
                        equals expected: '', actual: "${params.GIT_COMMIT}"
                    }
                    not {
                        equals expected: '', actual: "${params.IMAGE_FORMATS}"
                    }
                }
            }

            environment {
                GIT_COMMIT = "${params.GIT_COMMIT}"
            }

            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/validateUpdateBuildReferencesParameters.sh
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
            }
        }

        stage('Deploy') {
            when {
                not {
                    equals expected: '', actual: "${params.DEPLOYMENT_UNITS}"
                }
            }

            steps {
                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/deploySetup.sh
                '''

                script {
                    def contextProperties = readProperties interpolate: true, file: "${WORKSPACE}/context.properties";
                    contextProperties.each{ k, v -> env["${k}"] ="${v}" }
                }

                sh '''#!/bin/bash
                    ${AUTOMATION_DIR}/deploy.sh
                '''
            }

            post {
                success {
                    slackSend (
                        message: "Deploy Completed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS} - Commit: ${params.GIT_COMMIT}",
                        channel: "${env["slack_channel"]}",
                        color: "#50C878"
                    )
                }

                failure {
                    slackSend (
                        message: "Deploy Failed - ${BUILD_DISPLAY_NAME} (<${BUILD_URL}|Open>)\n Environment: ${env.ENVIRONMENT} - Segment: ${env.SEGMENT} \n DeploymentUnits: ${params.DEPLOYMENT_UNITS} - Commit: ${params.GIT_COMMIT}",
                        channel: "${env["slack_channel"]}",
                        color: "#D20F2A"
                    )
                }
            }
        }
    }

}
```