---
sidebar_label: single-unit
title: Basic Build Pipeline
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A single-unit build pipeline.  This is best used with the multibranch pipeline or a pipeline stored within the application code.

An alternate application of this pipeline would be to create separate build pipelines within the same repository. These could then be configured within the Jenkins Job to trigger simultaneously on all commits to the repository.

## Build Units

This pipeline contains an example for building a single deployment unit and triggering a deployment if successful.

# Post Job
On success, this job will trigger a ['Continuous Deploy'](../deploy/continuous-deploy) pipeline into the first environment.

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

    environment {
        properties_file = '.hamlet/product/<product properties file>'
        slack_channel = '<slack channel>'
        product_cmdb = '<cmdb repo Url>'

        PRODUCT_INFRASTRUCTURE_REFERENCE = 'master'
        PRODUCT_CONFIG_REFERENCE = 'master'

        ENVIRONMENT = '<ENVIRONMENT>'
        SEGMENT = '<SEGMENT>'
        AUTODEPLOY = 'true'

        DEPLOYMENT_UNITS = 'lambda-v1'
        BUILD_PATH = 'lambda'
        BUILD_TASKS = 'build'
        IMAGE_FORMAT = 'lambda'
        GENERATION_CONTEXT_DEFINED = ''
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

        stage('API Lambda') {

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