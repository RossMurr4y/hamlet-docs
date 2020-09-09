---
sidebar_label: properties files
title: Properties Files
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

For Jenkins to perform Hamlet tasks such as template generation and cloud deployments, each pipeline will require a number of common environment variables. To re-use this configuration they are stored within a file known as a`properties` or `<product>.properties` file.

Within pipelines, this file is loaded in, injecting each key/value pair as environment variables wihin the pipeline. Whilst not every variable is used in each pipeline, it provides a single place for storing this information and prevents repetition.

## Creating a Properties File

Storing your `properties` file inside of your Product CMDB is recommended.

```
./product_cmdb
└── pipelines
		└── deploy
		└── manage
		└── properties
			└── product.properties
```

## Configuration Template

```bash
## Tenant settings
GIT_EMAIL_DEFAULT=<git-email>
GITHUB_ORG=<github-org>

## Account details
ACCOUNT_CONFIG_REPO=accounts-cmdb
ACCOUNTS=<account-name>

# these variables are prefixed with the ACCOUNT
# different accounts require unique sets of these vars
<account-name>_ACCOUNT_PROVIDER=aws
<account-name>_AWS_ACCOUNT_ID=<account-id>

# Product Properties
PRODUCT_CONFIG_REPO=<product>-cmdb
PRODUCT_INFRASTRUCTURE_REPO=<product-name>-cmdb
PRODUCT=<product-name>

# Solution Properties
# all lists are comma-seperated values
ENVIRONMENT_LIST=<env-name>,<env-2-name>
SEGMENT_LIST=<seg-name>,<seg-2-name>

SEGMENT_UNITS=baseline,vpc,igw,nat,<deployment-unit>
SOLUTION_UNITS=<deployment-unit>
APPLICATION_UNITS=<deployment-unit>
```

## Example
```bash
## Tenant settings
GIT_EMAIL_DEFAULT=alm@exampleemail.com
GITHUB_ORG=hamlet-io

## Account details
ACCOUNT_CONFIG_REPO=accounts-cmdb
ACCOUNTS=example01

# these variables are prefixed with the ACCOUNT
# different accounts require unique sets of these vars
EXAMPLE01_ACCOUNT_PROVIDER=aws
EXAMPLE01_AWS_ACCOUNT_ID=1234567890
EXAMPLE01_DOCKER_DNS=1234567890.dkr.ecr.narnia-north-1.amazonaws.com
EXAMPLE01_LAMBDA_DNS=account-registry-123example-seed321
EXAMPLE01_LAMBDA_REGION=narnia-north-1
EXAMPLE01_OPENAPI_DNS=account-registry-123example-seed321
EXAMPLE01_OPENAPI_REGION=narnia-north-1

# Product Properties
PRODUCT_CONFIG_REPO=wholesalebagpipes-cmdb
PRODUCT_INFRASTRUCTURE_REPO=wholesalebagpipes-cmdb
PRODUCT=wholesalebagpipes

# Solution Properties
# all lists are comma-seperated values
ENVIRONMENT_LIST=dev,test,stage,prod
SEGMENT_LIST=default

SEGMENT_UNITS=baseline,vpc,igw,nat
SOLUTION_UNITS=
APPLICATION_UNITS=orders-api-v1,orders-api-v1-implementer,bagpipes-app
```