---
sidebar_label: run task
title: Hamlet RunTask
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Execute an [`ECS Task`](../../../../../components/ecs#task-subcomponent), passing it unique execution configuration.

## Parameters

**ENVIRONMENT**
Add the selected [`environment(s)`](../../../../../foundations/terminology#environment) to the deployment scope.

**TASK_INSTANCE**
A comma-separated list of the Task [Instances](../../../../../foundations/terminology#instance) to execute.

**MANAGE_PY_TASK**
Specific to this example, this Parameter is passed to the Hamlet Executor's "Run Task" script and will become the value of the environment variable passed to the Task. This Parameter would be customised on a per-Task basis.

## Stages

### Setup
Loads environment variables from the Hamlet [`properties`](../properties/properties) file.

### Run Provider Task
Performs the Hamlet "Run Task" action against all Task Instances in the filtered pipeline scope.

## Example
The example below passes the argument `migrate --no-input` to a Django [`ECS Task`](../../../../../components/ecs#task-subcomponent). By replacing the handling of **MANAGE_PY_TASK** with another, this pattern will suit any Task.

```groovy
#!groovy

pipeline {
    agent {
        label '<agent label>'
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
        checkoutToSubdirectory '.hamlet/product/'
    }

    parameters {
        extendedChoice(
            name: 'ENVIRONMENT',
            description: 'Environment to run the task in',
            multiSelectDelimiter: ',',
            value: '< comma separated list of envs>',
            defaultValue: '<default env>',
            quoteValue: false,
            saveJSONParameterToFile: false,
            type: 'PT_SINGLE_SELECT',
            visibleItemCount: 10
        )

        extendedChoice(
            name: 'TASK_INSTANCE',
            description: 'Provider task instance to run',
            multiSelectDelimiter: ',',
            value: '<comma separated list of task instances>',
            defaultValue: '',
            quoteValue: false,
            saveJSONParameterToFile: false,
            type: 'PT_SINGLE_SELECT',
            visibleItemCount: 10
        )

        string(
            name: 'MANAGE_PY_TASK',
            description: '',
            defaultValue: 'migrate --no-input'
        )

    }

    environment {
        properties_file = '.hamlet/product/<product properties location>'

        SEGMENT = '<task segment>'
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

        stage('Run Provider Task') {
            environment {
                TASK_INSTANCE = "${params["TASK_INSTANCE"]}"
                MANAGE_PY_TASK = "${params["MANAGE_PY_TASK"]}"
            }

            steps {
                script {
                    currentBuild.description = "Environment: ${env["ENVIRONMENT"]} - Instance: ${env["TASK_INSTANCE"]}"
                }

                sh '''#!/bin/bash
                ${GENERATION_DIR}/runTask.sh \
                    -t "<ECS Host Tier Name>" -i "<ECS Host Component Id>" \
                    -w "<ECS Task Component Id>" -x "${TASK_INSTANCE}" -y "" -c "<ECS Task Container Id>" \
                    -e "<Environment Var to overide>" -v "${MANAGE_PY_TASK}"
                '''
            }
        }
    }

}
```