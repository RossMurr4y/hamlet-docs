---
sidebar_label: docker to aws ecr
title: Docker and AWS ECR
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Parameters

**DOCKER_IMAGE**
Expects a container image name in the format `<Docker repo>:<docker tag>`, which will be deconstructed and assigned to overwrite the default Docker environment variables **DOCKER_REPO**, **DOCKER_TAG**, **REMOTE_DOCKER_REPO** and **REMOTE_DOCKER_TAG**. 

Alternatively these could be presented as individual Parameters.

## Stages

### Setup
Overwrite default Docker environment variables with those specified as Parameters.

### Pull Image
Perform the Hamlet "Manage Docker" action, pulling the selected container image from Dockerhub to the local registry.

## Example
```groovy
#!groovy

def dockerImages = [
    '<Docker repo>:<docker tag>'
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
        choice(
            choice name: 'DOCKER_IMAGE',
            choices: dockerImages,
            description:'The docker image to pull'
        )
    }

    environment {
        properties_file = '.hamlet/product/<product properties location>'

        ACCOUNT = '<Account Id>'
        // Required to align with current AWS ecs image
        DOCKER_API_VERSION = '1.39'
    }


    stages{

        stage('Setup') {
            steps {
                script {
                    env["DOCKER_REPO"] = params["DOCKER_IMAGE"].split(':')[0]
                    env["DOCKER_TAG"] = params["DOCKER_IMAGE"].split(':')[1]
                    env["REMOTE_DOCKER_REPO"] = params["DOCKER_IMAGE"].split(':')[0]
                    env["REMOTE_DOCKER_TAG"] = params["DOCKER_IMAGE"].split(':')[1]
                }
            }
        }

        stage('Pull Image') {
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
                    ${AUTOMATION_DIR}/manageDocker.sh -p -u dockerhub
                '''
            }
        }
    }
}
```