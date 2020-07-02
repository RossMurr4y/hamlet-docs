---
title: Azure Plugin Breakdowns
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
import Admonition from 'react-admonitions';


Welcome to the start of a new series of blog posts centred around the Hamlet Azure provider. In each article will showcase a new hamlet component type and how it has been implemented by the Azure provider plugin. Along the way we'll review some unique Infrastructure-as-Code challenges that hamlet addresses as well as deep dive into some of its features. 

These articles are intended for audiences just starting out with hamlet. You will need a basic understanding of Azure and ARM templates - links provided at the end of this article to bring you up to speed. The intent is for each article to build up to the next, exploring both hamlet and the Azure provider plugin in greater depth. 

<Admonition type="tip" title="Applicable to all hamlet providers!">
  These articles use the Azure plugin provider to illustrate the broader hamlet approach to opionionated "Solution-as-Code". Though the implementations will differ by provider, hamlet features that we cover are applicable to all hamlet providers.
</Admonition>

## Getting Started

Before we dive too far in to templates, today we'll cover off some Azure Resource Manager basics.

First up - lets take a look at the `template.json` file structure. The template file is the bare minimum required for an Azure Resource Manager deployment and so it is the structure that we are not just going to have hamlet reproduce for us, but populate.

## Template File

```json
// template.json
{
  "$schema": "<schema-definition-url>",
  "parameters": {  },
  "variables": {  },
  "resources": [  ],
  "outputs": {  }
}
```

<Admonition type="note" title="Abbreviated snippets">
  In order to keep examples readable, code snippets will be trimmed of non-essential content.
</Admonition>

Because hamlet will be undertaking the template generation for us, some of these template properties are handled differently or are less utilised then you may be used to.

**parameters**

Parameters provide user input for the template. This is similar to arguments or parameters that you mind find in other scripts or programming languages. Parameter values can assigned directly in the template or more commonly they are *defined* within a `template.json` file, and a corresponding `parameters.json` file in the same directory is used to pass values into the template. 

```json
// example parameter.json
{
  "$schema": "<schema-definition-url>",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "hamletioParameter" : "example"
  }
}
```
This would pass the `template.json` in the same directory a parameter called "hamletioParameter" with a value of "example".

```json
// example parameter within template.json
{
  "parameters": {
    "hamletioParameter" : {
        "type" : "string",
        "defaultValue": "https://hamlet.io"
    }
  }
}
```

Typically in ARM what this allows you to do is to seperate out secure or personal values for a template and then share the template/parameters files someone else or even re-use the template in a number of different ways, providing a new parameters file each time. In hamlet templates are generated and re-generated frequently. A product's solution is effectively one giant Parameters file, and hamlet takes what it requires from that and uses it to create the template file. In this way, most of the more simplistic use cases for Parameters - like assigning a resource property to the value of a parameter - are not required at all. Hamlet can just hard-code that value on the resource. We'll cover the more advanced uses for Parameters in a future article.

**variables**

Unlike parameters that can have default values and be passed in from another file, variables must be defined within the template. Where they shine however is that they can be used to perform ARM template functions to determine their value. Common use-cases might be to join two parameters values together to form a new value. 

```json
  {
    "variables": {
        "fancyHamletVariable": "[concat(parameters('hamletioParameter'), '/docs/reference/cmdb/schemas')]"
    }
  }
```

This would resolve to `https://hamlet.io/docs/refrence/cmdb/schemas` using the ARM Function [`concat`](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions-array#concat) to join strings.

In hamlet, we don't use variables very often because hamlet will typically perform the required logic. Instead, hamlet will generally use variables in combination with ARM functions that only occur at run-time. We'll be covering those in more detail in a future post as well. For now though, this is why you may not see very many variables used in hamlet-produced ARM templates.

**resources**

Azure Resource Manager unsurprisingly is primarily focused around deploying Azure Resources - so it makes sense that this is where all the magic happens. Resources are a representation of a specific, manageable item within Azure. Resource definitions here are the desired state of the resource and its properties.

Resources themselves all conform to the same top-level schema, (below) however their available property configurations vary drastically. To know the full configuration available to any given resource, consult the Azure Resource Manager documentation (link at the bottom of this post).

```json
{
    "condition": "<true-to-deploy-this-resource>",
    "type": "<resource-provider-namespace/resource-type-name>",
    "apiVersion": "<api-version-of-resource>",
    "name": "<name-of-the-resource>",
    "comments": "<your-reference-notes>",
    "location": "<location-of-resource>",
    "dependsOn": [
        "<array-of-related-resource-names>"
    ],
    "sku": {
        "name": "<sku-name>",
        "tier": "<sku-tier>",
        "size": "<sku-size>",
        "family": "<sku-family>",
        "capacity": <sku-capacity>
    },
    "properties": {  ...  },
    "resources": [
        "<array-of-child-resources>"
    ]
}
```

In hamlet, there are a few minor changes to the way resources are defined from how you would create the file if manually authoring and maintaining it. 

1. Sub-resources are always defined as their own resource, rather than nested within its parent.

```json
// sub resource defined as an independant resource
{
  "name": "storageaccount12345/default",
  "type": "Microsoft.Storage/storageAccounts/blobServices",
  "apiVersion": "2019-04-01",
  "properties": {},
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts', 'storageaccount12345')]"
  ]
},
{
  "name": "storageaccount12345/default/container123",
  "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
  "apiVersion": "2019-04-01",
  "properties": {},
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts', 'storageaccount12345')]",
    "[resourceId('Microsoft.Storage/storageAccounts/blobServices', 'storageaccount12345', 'default')]"
  ]
}

// nested resource
{
  "name": "storageaccount12345/default",
  "type": "Microsoft.Storage/storageAccounts/blobServices",
  "apiVersion": "2019-04-01",
  "properties": {},
  "resources" : [
    {
      "name": "container123",
      "type": "containers",
      "apiVersion": "2019-04-01",
      "properties": {...}
    }
  ],
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts', 'storageaccount12345')]"
  ]
}
```
This is done for consistency in resource names, and consistency in creating resource references. It's also far easier for hamlet developers to design smaller functions to generate the output of concise structures that are all used, rather than having to support some of the more monstrously-nested resources that ARM templates have to offer (see some of the networking ARM templates for reference.) and have a good portion of that structure unused.

2. As a solution changes over time, hamlet will add and remove resources from any generated templates accordingly. Because of this, many of the quality-of-life features of template authorship - such as looping over a resource a number of times to create N copies of it - are unnecessary. Such a loop would normally enable a template author to ensure consistency across many resources and save time when maintaining those resources, however hamlet does this all for us so features would only serve to complicate the template. This does mean that hamlet generated templates are longer in length but also far simpler to read.

**outputs**

Hamlet uses template outputs far more than you may be used to, but in a far more complex manner. To explain the how and the why, lets break down the outputs step-by-step.

1. Upon successful ARM deployment, the output section of the ARM `template.json` is processed (standard ARM deployment behaviour - nothing new here).
2. The results of the output processing is captured and saved into a new file - `stack.json`. The name "stack" is borrowed from AWS conventions, and represents the current deployed state of a resource.
3. The next time a new template generation occurs (for *any* deployment-unit, not just that same one), part of the generation process is to create a composite of all the output sections across all `stack.json` files. This composite file is then used for every subsequent template generation to extract the necessary values. Effectively its a library of values on the current state of deployed resources. Because it's a direct reflection of the current state, this is also used to determine if a resource is actually deployed or not. Every resource must have at least one output - typically its the unique identifier of the resource (in Azure this is the result of a `[resourceId()]` function) in order for it to be considered deployed.

<Admonition type="important" title="Applicable to everyone!">
  Steps 2 and 3 of the above process is applicable to every provider. The composite stack files include information about which provider generated that output. Then during template generation each output is transformed into a single common structure that hamlet can read and use. In this way you could have templates from multiple providers in the same repository and pass values between them without any additional effort.
</Admonition>

That should give you a good understanding of some of the basics as to how and why ARM Templates look and feel a little different when generated through hamlet. Hopefully you can see the beginings of the power behind hamlet. In our next articles we'll start to dive into components to take a closer look at the design and features behind them.

## Links & References
[ARM Templates reference](https://docs.microsoft.com/en-us/azure/templates/)
[ARM Resource Schema](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-syntax#resources)