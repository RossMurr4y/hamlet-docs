---
sidebar_label: index
title: Jenkins Shared Library
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>


The Hamlet [jenkins-shared-libary](https://github.com/hamlet-io/jenkins-shared-library) repository maintains various groovy-scripts for quickly integrating Hamlet into Jenkins Pipelines.


## Common Scripts

| Script | Description                                                                                                     |
|--------|-----------------------------------------------------------------------------------------------------------------|
| [cmdbSetup]() | |
| [getS3BucketName]() | |
| [manageEnvironment]() | |
| [productSetup]() | |
| [setContext]() | |
| [setReleaseName]() | |
| [updateBuildDescription]() | |

## Specific Use-Case Scripts

| Script | Description                                                                                                     |
|--------|-----------------------------------------------------------------------------------------------------------------|
| [buildDataSet]() ||
| [getDeploymentUnitBuildBlueprint]() | |
| [wakeEcsCluster]() | |
| [getDataBaseDetails]() | |

## Notifications and Alerting

| Script | Description |
|--------|-------------|
| [sendSlackInputPrompt]() | |
| [sendSlackMessage]() | |