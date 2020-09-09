---
sidebar_label: pipelines
title: Jenkins Pipelines & Hamlet
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Jenkins integration with Hamlet offers comprehensive Product lifecycle management. This section documents best-practices and common approaches to their configuration.

Examples can be viewed [here](../examplelibrary/index) and the [Shared Groovy Scripts](../scriptlibrary/index) provide additional ready-to-use Hamlet utilties for Jenkins pipelines.

## Recommended Pipelines
Below is the recommended approach to integrating Hamlet and Jenkins. This configuration will grant comprehensive control of a Hamlet Solution.

## Properties files
Hamlet Jenkins pipelines share a number of common environment variables and valid parameter values. To re-use this configuration easily, creating a [`properties`](examplelibrary/examples/properties/properties) file is recommended.

## Jenkins Jobs
Keeping [`properties`](../../../examplelibrary/examples/properties/properties) and pipelines within your Product CMDB under the following structure allows for separation of purpose, whilst ensuring they will always be available where your repository has been cloned down. Build pipelines are not shown as they should be committed to the root of the code repository for the code they build.

```sh
./pipelines/
├── deploy
│   ├── staging
│   │   └── deploy
│   │       └── Jenkinsfile
│   └── production
│       ├── accept
│       │   └── Jenkinsfile
│       ├── deploy
│       │   └── Jenkinsfile
│       ├── prepare
│       │   └── Jenkinsfile
│       └── promote
│           └── Jenkinsfile
├── manage
│   └── environment
│       └── Jenkinsfile
└── properties
    └── abtc.properties
```

### Build Pipelines
Create build artefacts and publish them to a Registry.

Build jobs should be configgured in Jenkins as a multi-branch pipeline so as to provide feedback on new builds prior to merge.

[Examples](../examplelibrary/index#build)

### Deploy Pipelines
Retrieve build artefacts from a Registry and sequentially promote them through environments.

Deploy pipelines for non-continuous-deployment environments use the following pattern (each is a separate pipeline):

1. promote a release from the previous environment
2. prepare the necessary templates to deploy the release into the current environment
3. deploy the release into the current environment
4. accept the release as successful/tested and ready to proceed to the next

After accepting a release, the pattern would begin again by promoting the release into the next environment.

The following exceptions to this approach should be considered:
* environments intended for continous deployment should deploy directly - an example is provided.
* Production environments do not require an `accept` pipeline as there are no further environments.

[Examples](../examplelibrary/index#deploy)

### Management Pipelines
Provide a single pipeline for performing environmental-level deployments. This includes performing a specific mode of deployment (update, stop, hibernate) against one or many deployment units.

[Examples](../examplelibrary/index#manage)

### Utility Pipelines
Perform ad-hoc and Solution-specific tasks. These are 