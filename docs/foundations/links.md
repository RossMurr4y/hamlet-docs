---
sidebar_label: links
title: Links
---
import Admonition from 'react-admonitions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* Links create an association between components/subcomponents
* They are assigned in the solution on the desired component, and specify either that:
	a) they link to the target component/subcomponent
	b) the target component/subcomponent links to them
* the full link structure can be found at its reference data page (link)

# Defining a Link
* Links structure is common across components
* When linking to a subcomponent however, you link to the parent component and provider greater specificity by providing the subcomponent as well - the attributes for this vary based on the subcomponent name.

### Linking to a Component
```json
// example showing a typical link to a component
// ensure chosen component has a subcomponent so we can re-use example below with differnt link
```


### Linking to a Subcomponent

Linking to subcomponents is performed through additional attributes on the Link. Specifying these indicates that you are linking to the subcomponent only, not the parent.

*Linking to a Key subcomponent of a baseline component in the mgmt tier.*
<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
    ]
}>

<TabItem value='json'>

```json
{
    "Links": {
        "cf_key": {
            "Tier": "mgmt",
            "Component": "baseline",
            "Key": "oai"
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml
---
Links:
  cf_key:
    Tier: mgmt
    Component: baseline
    Key: oai
```

</TabItem>
</Tabs>

## Link Direction

Links are directional. Though an optional attribute of a link, the direction can be used to specify that a given component should be granted access to the linked component. An `Inbound` link specified on a API Gateway component for example, linking to a Lambda function would specify that the Lambda should be granted appropriate access for the API Gateway to invoke the lambda. Conversely, an `Outbound` link between these resources would imply that the API Gateway should be permitted to access the Lambda function.

A link is only required to specified on one end of the link - either the `Inbound` or `Outbound` end.

For simple linking where both ends of a link are known then defining a link on a component with only the mandatory attributes - outlined below - will indicate a one-way dependancy on the referenced component. In a situation where you may not know one side of the links up-front - such as with subcomponents - then an "Inbound" link could be used to create a link to any that do exist.


## Inbound Linking

### Example Inbound Link

*An SPA Component links to a CDN's Route subcomponent, specifying Inbound permissions. This grants the CDN permissions to access content of the SPA.*

<Tabs
    defaultValue="json"
    values={[
        {label: 'JSON', value: 'json'},
        {label: 'YAML', value: 'yaml'},
    ]
}>
<TabItem value='json'>

```json {9-13,18,22}
{
    "Tiers": {
        "web": {
            "Components" : {
                "maintenance" : {
                    "spa" : {
                        "Instances" : {},
                        "Links" : {
                            "cdn" : {
                                "Tier" : "web",
                                "Component" : "static-cdn",
                                "Route": "default",
                                "Direction" : "inbound"
                            }
                        }
                    }
                },
                "static-cdn": {                
                    "cdn": {
                        "Instances" : {},
                        "Routes": {
                            "default" : {
                                "PathPattern" : "_default",
                                "Compress": true,
                                "Origin": {}
                            }
                        }
                    }
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value='yaml'>

```yaml {11-12,14,18}
---
Tiers:
  web:
    Components:
      maintenance:
        spa:
          Instances: {}
          Links:
            cdn:
              Tier: web
              Component: static-cdn
              Route: default
              Direction: inbound
      static-cdn:
        cdn:
          Instances: {}
          Routes:
            default:
              PathPattern: _default
              Compress: true
              Origin: {}
```

</TabItem>
</Tabs>

## Outbound Link

### Example Outbound Link
```json
// example outbound link
```

## Links and Contexts

The Context Model provides components with configuration outside of their own scope (product, account, tenant configuration). By compiling this information with the component, context is determined. 

The `IncludeInContext` optional attribute on a link is used to restrict which links are included in the context. This permits environment space to be conserved where only a few attributes are necessary and prevents undesired overrides. When not specified, the context will contain all attributes regardless of whether they are missing or empty.

## Link Instance and Versions
Links always match with components in their matching Instance and Version. The `Version` link attribute can be used to override this default behaviour if necessary.

## Link Structure & Placement

The structure for each link is the same, however the object's depth - where it can be defined on any given component - will depend on the component itself. [Refer to the Component definitions for placement.](../reference/component-reference.md)

## Validating a Link

Run the following command in the hamlet container to validate your component's link configuration:

```
cot query describe occurrence \
    --tier-id <tier> \
    --component-id <component> \
    --instance-id <instance> \
    --version-id <version> \
    attributes
```