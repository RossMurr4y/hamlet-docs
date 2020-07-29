---
title: Hamlet Network Component
author: rossmurr4y
author_url: https://github.com/rossmurr4y
---
import Admonition from 'react-admonitions';

So far in [our blog series](2020-05-20-azure-plugin-breakdowns.md) we’ve covered off the basics that show you how Hamlet is used to create ARM templates.  Today we’re going to go even further and show you how Hamlet is able to take an existing provider and extend its capabilities into orchestration. We’re also going to take a look at how Hamlet addresses some of the more frustrating parts of cloud deployments - obscure naming conventions across resources.

## Network Component
Diving right in to what is often one of the most complex parts of cloud infrastructure design - the network component. Deciding precisely how you want to slice up your network into subnets and what their CIDR ranges should be, ensuring components that should be able to communicate can do so whilst restricting others is a big job. Hamlet however is able to determine your needs from your Solution. In fact if you already have a project with a basic `solution.json` and a `network`  component defined, then you’ve already got your network planned out! Take the following example:

```json
// basic solution.json file with:
- 3 tiers and a network deployment-unit with min. config
	- Two accessible to the public
	- One private only
- An SPA in the publicly accessible tier
- A DB in a private tier.
```

The above example `solution.json` file defines 3 tiers that will be used to house our basic application, and a `network` component we’ve called `vnet`. 

Hamlet breaks this down as follows:

A `network` deployment-unit exists
> 3 tiers in our Solution, each with a single-availability zone (more on this in a moment) - total subnets is therefor 3 x 1 = 3. Divide our network CIDR’s range into 3 equal ranges.

Two of our subnets are publicly accessible
> Create all applicable firewall and security group rules required to ensure this.

The other subnet is private 
> Create firewall and security group rules required to prevent public access to this subnets.

A component in the private subnet is linked to a component in one of the public subnets
> Evaluate the linked component and determine the configuration required for communication with that linked deployment-unit. Add firewall/security group rules to allow communication across subnets between those two components.

<Admonition type="note" title="Subnets and Availability Zones">

`Availability Zones`  (AZ’s) are a common concept across cloud providers. They are defined as unique physical locations within a given region. A cloud provider will typically build multiple AZ’s to enable deployment to a single region whilst still preventing putting customer data all in a single data centre. In the event of a natural disaster in a given region, the data for that region can be spread out across multiple data centres so there is far less chance for impacting customers.

Though it’s common across cloud providers, the implementation of AZ’s differ. On resources that offer AZ’s for AWS, the consumer is asked to define how many AZ’s they would like to distribute their data across with a slight premium for the privilege of the increased reliability. In Azure, some services are offered in the same way as AWS (which they call “Zonal services”) and others are automatically backed up across multiple zones for you and require no additional configuration (known as Zone-redundant services”). So for the above example, we don’t require different availability zones and subsequently use less subnets. For the same implementation in AWS however, we might opt to define additional AZ’s in the solution which would in turn result in more subnets - thankfully Hamlet will do all that for you.

</Admonition>

## Introducing Sub-Components
Sub-components are exactly what they sound like. Whilst a component represents a solution-level, provider independent architectural concept such as a “database” or a “network” without getting down into the details about what a “network” might look like in any specific instance”. So a sub-component is a similarly generic but smaller part of that component that may or may-not be present - or it may exist several times. 

As an example, a `network` component may have one or many routing requirements for the subnets within. It's `routetable` subcomponent can be used to define each separate routing approach.

The example used later in this article shows the placement of a subcomponent within a solution, within the scope of its parent component.

## Network ACL & IP Address Groups

### Network ACL

For the `network` component, a `networkacl` sub-component represents high-level access control of the network, based on 4-tuple rules. 

For those less familiar with 4 tuples they consist of:
	* Source Port
	* Source IP address
	* Destination Port
	* Destination IP address

By assigning a Network ACL sub-component to a `network` component we can easily define the security of our entire network. They act as a last line of defence for network security, we apply fine grained rules in security groups which are managed with links in hamlet. Network ACL's are useful for deny-lists if you have known bad IP addresses or want to lock your whole network away from particular sources.

### IP Address Groups

Before we take a look at what this may look like in a Hamlet solution, Hamlet adds one more feature to our toolkit - IP Address Groups.

The `_` at the start of the group name identifies hamlet inbuilt IP address groups. They perform specific lookups on various parts of your deployed hamlet. For instance “_localnet” can be used in place of the CIDR range of the network of a given component, “_global” really does mean global access, and “_tier” can be used to reference a given subnet across Availability Zones (in relation to the component that it is defined on). This is considerably easier to maintain and far easier to understand.

You can also define your own IP address groups for common IP address ranges, say to limit access from your proxy servers. You can define this group across your whole hamlet deployment and reference it in your solutions.

## Route Tables
The `network` component has a second sub-component - this time around its for defining specific routes for your network.

The `routetable`  sub-component provides a list of Gateways and conditions that can be used to forward traffic outside of the virtual network. Multiple `routetable` sub-components can be added to a network to allow subnets to use accept different routing rules. The `routetable` component itself doesn't actually have any routes in it. Instead, the gateways that link to it provide the routes to the `routetable`. This allows the gateway to really control how routing behaves and makes the gateways easy to plug-and-play with network access.

A `routetable` is linked to a given subnet via the configuration of its tier. The example in the next section shows what this looks like in practice.

So, lets take a look at what a `network` component with a `networkacl` sub-component and some rules looks like in a Hamlet solution.

```json
{	
	"IPAddressGroups" : {
		"exampleIPAddressGroup" : {
			"Description" : "An IP range in CIDR notation",
			"CIDR" : "a.b.c.d/28",
			"IsOpen" : true
		}
	},
    "Tiers" : {
        "mgmt" : {
            "Components" : {
                "network": {
                    "MultiAZ": false,
                    "network": {
                        "Instances" : {
                            "default" : {
                                "DeploymentUnits" : [ "examplenetwork" ]
                            }
                        },
                        "RouteTables": {
                            "internal": {},
                            "external": {
                                "Public": true
                            }
                        },
                        "NetworkACLs": {
                            "open": {
                                "Rules": {
                                    "deny-external": {
                                        "Priority": 200,
                                        "Action": "deny",
                                        "Source": {
                                            "IPAddressGroups": [
                                                "_global"
                                            ]
                                        },
                                        "Destination": {
                                            "IPAddressGroups": [
                                                "_localnet"
                                            ],
                                            "Port": "any"
                                        },
                                        "ReturnTraffic": false
                                    },
                                    "allow-adminnetwork": {
                                        "Priority": 100,
                                        "Action": "allow",
                                        "Source": {
                                            "IPAddressGroups": [
                                                "_exampleIPAddressGroup"
                                            ]
                                        },
                                        "Destination": {
                                            "IPAddressGroups": [
                                                "_global"
                                            ],
                                            "Port": "any"
                                        },
                                        "ReturnTraffic": false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```
Defined by the above example:
* An IPAddressGroup called "exampleIPAddressGroup"
* A tier called "mgmt" - for admin components
* a `network` component with a single deployment-unit
  * containing subcomponents for:
    * the `routetable`s "internal" and "external"
	* the `networkacl` definition containing:
	  * a rule that allows traffic from our IPAddressGroup
	  * a rule that blocks all other outside traffic

By defining our product into commonly understood network level tiers ("mgmt" tier shown above) and Availability Zones, Hamlet is able to determine our subnet requirements. Defining a `networkacl` on it then lets us concisely restrict access however we choose and finally we can then control traffic in, out and around our network by linking future gateways to the `routetable`s, "internal" and "external". 

Not bad for just a few lines of JSON!