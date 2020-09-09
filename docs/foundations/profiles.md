---
sidebar_label: profiles
title: Profiles Overview
---
import Admonition from 'react-admonitions';

Profiles define a set of common component configuration with filters to limit the components that may access it. Profiles can be defined at any CMDB scope and will be available to all components matching the filters across that scope.

```json
{
    "< Profile-Type >" : {
        "< Profile-Name >" : {
            "Modes" : {
                "< Deployment-Mode >" : {
                    "< Component-Type >" : {
                        // profile configuration
                    }
                }
            }
        }
    }
}
```

# Profile Scopes
Profiles can be applied at the Tenant, Account, Product, Environment, Segment and Solution scopes. Additionally, Profiles may exist within a provider's masterdata file. These will apply at the Solution level but prior to user-defined Solution level profiles.

# Profile Types
Different profile types provide control over where in the order of operations a given profile is loaded. Each of the profile types tends to align itself with the needs of a specific enterprise role.

<Admonition type="note" title="Reference Data Profile Types">
Profiles for <a href='../inputs/references#reference-data-profile-types'>Reference Data types</a> perform the same function as Deployment Profiles and are available at the same scopes, however they have unique schemas.
</Admonition>

## Deployment Profiles
Deployment Profiles offer top-down component governance where the most specific scope overrides any configuration defined at a higher scope.

## Policy Profiles
Policy Profiles offer the inverse of Deployment Profiles - higher scoped Policy Profiles overrule the lower. This enables organisations to apply Tenant or Account level Policies where they cannot be overridden by Deployment Profiles.

## Filters
Deployment and Policy profile types have two filters - Deployment Mode and Component Type. All components within the scope of that Profile will inherit their configuration.

A "*" (any) filter can be used for either filter to represent matching any mode or component type. This is not a wildcard however, and cannot be used for pattern matching.

## The Profiles Meta Parameter
Profiles are assigned to a scope though the `Profiles` metaparameter object, containing key/value pairs of the profile types and names. The metaparameter object is available to all scopes, however only the Deployment and Policy profile types are available for assignment above the Component level. To implement a Component-level profile at a higher scope, they should be associated with either a Deployment or Policy profile.

Only applicable profile types are exposed through the `Profiles` metaparameter for each component. For example a "Bootstrap" profile - which defines a set of actions required to provision a compute resource - is not applicable to non-compute components. See the [component reference docs]() for details on which profiles are available for each component type.

```json
{
    "Profiles": {
        "Alert": "<array>",
        "Baseline" : "<array>",
        "Bootstrap" : "<array>",
        "CORS" : "<array>",
        "Deployment": "<array>",
        "LogFile" : "<array>",
        "Logging" : "<array>",
        "Network" : "<array>",
        "Placement": "<array>",
        "Policy" : "<array>",
        "Processor": "<array>",
        "Security" : "<array>",
        "Test" : "<array>",
        "WAF" : "<array>"
    }
}
```

## Profile Examples

A Deployment Profile assignment at the Environment scope.
```json
{
  "Environment" : {
    "Id" : "test",
    "Name" : "test",
    "Profiles" : { 
       "Deployment" : [ "ExampleProfile" ] 
    }
  }
}
```

A Deployment Profile overriden for a specific Segment.
```json
{
  "Segment" : {
    "Id" : "default",
    "Name" : "default",
    "Profiles" : { 
       "Deployment" : [] 
    }
  }
}
```
