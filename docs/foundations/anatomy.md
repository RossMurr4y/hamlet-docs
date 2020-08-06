---
sidebar_label: anatomy
title: CMDB Anatomy
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

The CMDB repository is used to outline the supporting infrastructure and services required for the deployment of an application. The structure of the repository is important for the generation and automation of the infrastructure.

The CMDB is broken up into two components, the product CMDB which describes the resources for a specific product and the Account CMDB which describes the organisations account and high level environmental configuration. `hamlet` combines these two data sources to build and provision product environments.

## Product CMDB

<Tabs
    defaultValue="cmdbroot"
    values={[
        {label: 'Overview', value: 'cmdbroot'},
        {label: 'Hosting', value: 'hosting'},
        {label: 'Application', value: 'application'},
        {label: 'Provisioning', value: 'provisioning'},
    ]
}>
<TabItem value='cmdbroot'>

```text
config/
|
|- <product>/
|  |- <solution>/
|    |- solution.json
|    |- *.ftl
|    |- <segment>/
|       |- segment.json
|- appsettings/
|   |- <segment>/
|     |- <application>-v<version>/
|        |- build.json
|        |- appsettings.json
infrastructure/
|- <cloud provider>/
|    |- <segment>/
|        |- <template type>/
|            |- *-template.json
|            |- *-stack.json
|            |- *-epilogue.sh
|            |- *-prologue.sh
|- credentials/
|    |- <segment>/
|        |- <application>/
|            |- credential.json
|            |- asFile/
|                |- <credential files (certificates,keys etc)>
```

</TabItem>
<TabItem value='hosting'>

````text {6,7,10}
config/
|
|- <product>/ ________________________ #
|
|  |- <solution>/ ____________________ #
|    |- solution.json ________________ # describes the resources required to host the product
|    |- *.ftl ________________________ # custom resource templates used to generate solution specific resources
|
|    |- <segment>/ ___________________ # an instance of the solution
|       |- segment.json ______________ # describes the environment the solution should be deployed to
````



</TabItem>
<TabItem value='application'>

````text
config/
|
|- appsettings/ ______________________ # application specific settings
|
|   |- <segment>/ ____________________ # segment specific settings
|
|     |- <application>-v<version>/ ___ # Application based settings
|
|        |- build.json _______________ # Code repository commit id and build tooling
|        |- appsettings.json _________ # application specific overrides
````

</TabItem>
<TabItem value='provisioning'>

````text
infrastructure/ ______________________ # the provisioned infrastructure for the solution
|
|- <cloud provider>/ _________________ # the cloud provider of the infrastructure
|
|    |- <segment>/ ___________________ # the segment level infrastructure
|
|        |- <template type>/ _________ # the provisioning process for the segment
|
|            |- *-template.json ______ # the declarative template used for provisioning
|            |- *-stack.json _________ # the output from the declarative template
|            |- *-epilogue.sh ________ # a script run before the template is run
|            |- *-prologue.sh ________ # a script run after the template has run
|
|- credentials/
|
|    |- <segment>/ ___________________ # segment level credentials
|
|        |- <application>/ ___________ # application level credentials
|            |- credential.json ______ # credential details
|
|            |- asFile/ ______________ # allows for file based credentials
|                |- <credential files (certificates,keys etc)>
````

</TabItem>
</Tabs>

## Accounts CMDB

The accounts CMDB is a separate repository to the product level CMDB as it can be shared across multiple domains/applications. Accounts can be grouped into subdirectories in order to classify them.

<Tabs
    defaultValue="accounts"
    values={[
        {label: 'Accounts', value: 'accounts'},
    ]
}>
<TabItem value='accounts'>

````text
<tenant>/ ____________________________ # the organisation details over all
|    |- domains.json _________________ # DNS zone details used for service naming and resolution
|    |- tenant.json __________________ # default settings for the organisation
|    |- ipaddressgroups_<name>.json __ # IP address collections used for access control
|    |- countrygroups.json ___________ # country collections used for access control
|
<account>/ ___________________________ # a cloud provider account
|
|    |- config/ ______________________ # account level configuration details
|        |- account.json _____________ # account specific details
|
|        |- appsettings/
|            |- appsettings.json _____ # account level application settings
|
|    |- infrastructure/
|
|        |- credentials/
|            |- credentials.json _____ # account level credentials
````

</TabItem>
</Tabs>