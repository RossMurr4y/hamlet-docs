---
title: Azure Plugin Breakdowns pt 2
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
import Admonition from 'react-admonitions';

# Component Breakdown - s3 - Azure Provider

Today we're going to get started with one of the basics of the cloud infrastructure world - the object store `s3`.

`s3` is a standalone object storage component which can be used by other components to store data. A typical hamlet deployment will include a `baseline` component which itself involves some standard storage resources, however the standalone `s3` component is for more advanced or shared configuration options where you might not want to keep this data alongside that which is stored in your `baseline` storage resources. Perhaps you need different permissions or a more long-term storage option for archival purposes.

In Azure, the `s3` component is made up of a single `Storage Account` resource, a `Blob Service` resource assigned to it and a `Container` inside that Service. This is the bare-minimum required for blob file storage within a `Storage Account`. The final resource is a `KeyVault Secret`, which will be used to store the value of the Storage Account Key - we'll cover KeyVault and this secret a little later on.

## s3 Template File

Lets take a look at an example ARM Template that hamlet may produce for an `s3` component:

```json
// template.json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {},
  "variables": {},
  "resources": [
    {
      "name": "hamletioS3Example1a2b3c4d",
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2019-04-01",
      "properties": {
        "supportsHttpsTrafficOnly": true,
        "networkAcls": {
          "defaultAction": "Deny",
          "bypass": "AzureServices"
        },
        "accessTier": "Cool"
      },
      "identity": {
        "type": "SystemAssigned"
      },
      "location": "australiasoutheast",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2"
    },
    {
      "name": "hamletioS3Example1a2b3c4d/default",
      "type": "Microsoft.Storage/storageAccounts/blobServices",
      "apiVersion": "2019-04-01",
      "properties": {},
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d')]"
      ]
    },
    {
      "name": "hamletioS3Example1a2b3c4d/default/container-app-stage",
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2019-04-01",
      "properties": {},
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d')]",
        "[resourceId('Microsoft.Storage/storageAccounts/blobServices', 'hamletioS3Example1a2b3c4d', 'default')]"
      ]
    },
    {
      "name": "hamletioKeyVault-1a2b3c4d/app-stage-secret-ConnectionKey",
      "type": "Microsoft.KeyVault/vaults/secrets",
      "apiVersion": "2018-02-14",
      "properties": {
        "value": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d'), '2019-04-01').keys[0].value]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d')]"
      ]
    }
  ],
  "outputs": {
    "storageXappXstage": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d')]"
    },
    "storageXappXstageXname": {
      "type": "string",
      "value": "hamletioS3Example1a2b3c4d"
    },
    "storageXappXstageXpropertiesXprimaryEndpoints": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d'), '2019-04-01', 'Full').properties.primaryEndpoints]"
    },
    "storageXappXstageXpropertiesXprimaryLocation": {
      "type": "string",
      "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', 'hamletioS3Example1a2b3c4d'), '2019-04-01', 'Full').properties.primaryLocation]"
    },
    "blobXappXstage": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts/blobServices', 'hamletioS3Example1a2b3c4d', 'default')]"
    },
    "containerXappXstage": {
      "type": "string",
      "value": "[resourceId('Microsoft.Storage/storageAccounts/blobServices/containers', 'hamletioS3Example1a2b3c4d', 'default', 'container-app-stage')]"
    },
    "containerXappXstageXname": {
      "type": "string",
      "value": "hamletioS3Example1a2b3c4d/default/container-app-stage"
    },
    "secretXappXstage": {
      "type": "string",
      "value": "[resourceId('Microsoft.KeyVault/vaults/secrets', 'hamletioKeyVault-1a2b3c4d', 'app-stage-secret-ConnectionKey')]"
    },
    "secretXappXstageXname": {
      "type": "string",
      "value": "hamletioKeyVault-1a2b3c4d/app-stage-secret-ConnectionKey"
    },
    "Subscription": {
      "type": "string",
      "value": "[subscription().id]"
    },
    "ResourceGroup": {
      "type": "string",
      "value": "[resourceGroup().name]"
    },
    "Region": {
      "type": "string",
      "value": "[resourceGroup().location]"
    },
    "DeploymentUnit": {
      "type": "string",
      "value": "stage"
    },
    "DeploymentMode": {
      "type": "string",
      "value": "update"
    }
  }
}
```

## At a Glance

Firstly, some things you may notice right away.
* This template has no parameters.
* There are a lot of outputs defined.

Firstly - this template is self contained and doesn't require any parameters. Our [last blog post](2020-05-20-azure-plugin-breakdowns.md) covers why this is more in-depth if you need a refresher.

Secondly, outputs are vert instrumental in how hamlet is able to operate and generate so much of a template for us without additional input, so outputs are usually pretty plentiful. But there are actually two types of outputs being defined here. 

**Output Ids**
The first are those that are specific to a resource and are identified by the camel-case-X syntax being used for the output key - `storageXappXstage`. This format is known by hamlet as the output id, and whenever a component wants to make use of a value output by a previous component it will formulate this Id, and lookup its value in the composite stack outputs (see the [last blog article](2020-05-20-azure-plugin-breakdowns.md) for a refresher on these!). 

**Default Outputs**
There are also a number of default outputs that are always present. Values such as the Subscription (or Account in other providers), Region and Resource Group are all very important to keep track of to be able to know the placement of a given component.

When maintaining your own ARM templates outputs are typically used to retrieve values that are not known until deployment time - such as the unique resource Id - by using ARM Template Functions. For those less famililar with ARM, an ARM function is written as a string, begining and ending in square-brackets: `"[subscription().id]"`. 

Some of the output values here are hard-coded however. Once again, because we want to ensure that these values are available to our other components and our outputs effectively form the known state of our deployments we want to ensure all relevant values are output - even if they are already known at generation time.

## Storage Account

### The Seed
In Azure the name of a Storage Account must be globally unique because its name also determines its Fully Qualified Domain Name (FQDN). You can see here that this has been accomplished by appending a string of unique characters to a human-readable name. This alphanumeric string is known as the "seed". This was initially generated during the `baseline` component and enables hamlet to ensure unique names as required.

## Blob Store

The Blob Store is a fairly minimal resource as it has no additional properties we've defined. It is however required in order to create a Container and since we don't create nested resources within hamlet (see previous article for the run down) we need to explicitely define it here.

If you are used to writing nested resources in ARM templates, you'll note that the naming convention has changed here. Child resources in Azure must include *all* of their parents names in their own. So `hamletioS3Example1a2b3c4d/default` tells us that `hamletioS3Example1a2b3c4d` is the parent Storage Account, and `default` is the name of the Blob store.

Because we never nest resources we must always be explicit about dependencies. The "dependsOn" property will therefore always include the parent resources.

## KeyVault Secret

When our projects `baseline` component was deployed a KeyVault was created. Now when we create an `s3` component hamlet is going to create a new Secret for us in KeyVault containing the value of the access-key portion of the Storage Account connection-string. This wont have any immediate value to the `s3` component but will become available to deployment unit's that link to it.

When a hamlet component links to another it gains access to the resources and attributes of what it has linked to. And because all output Id's are formed around a known structure, once we have access to the Resource Id, we then have access to all of its outputs as well. 

So putting this all together: by another deployment-unit linking to the `s3` component it:

a) Learns the resource id of the Secret resource: `secretXappXstage`. 
b) From that it knows how to create an Id for a Secret Name, which is also another output: `secretXappXstageXname`.
c) So that resource can evaluate all composite stack outputs to look for that output, and learn that the secret name in KeyVault is `hamletioKeyVault-1a2b3c4d/app-stage-secret-ConnectionKey` where the first part is the vault name, and the secodn is the name of our Secret resource.

<Admonition type="important" title="Output Id Conventions">
  You may have noticed that all outputs for a given resource have a common structure. That's because the default output for every resource (the resource id in Azure) will set the name for all other outputs of that resource. For example the "Secret" resource from the template above sets gives us two outputs:

  |Ouput Id               |Output Value       |
  |-----------------------|-------------------|
  |`secretXappXstage`     |Resource Identifier|
  |`secretXappXstageXname`| Resource Name     |

</Admonition>

That's it for this breakdown. In our next article we'll up the complexity by jumping into the `db` component, take a closer look at how we get the most out of Parameter files and explore how hamlet can be used to fill the gaps in a provider or framework.

## Links & References
[ARM Template Functions](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions)
