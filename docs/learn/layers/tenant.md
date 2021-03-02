---
sidebar_label: tenant
title: The Tenant
---
import Admonition from 'react-admonitions';

A Tenant represents an organsation or entity and is the greatest scope within Hamlet. All configuration applied at this layer is going to influence all Accounts and Products within it.

Lets create one now so that we have something to look at. 

From your terminal, run the following to pull down and run the offical Hamlet Docker container and start an interactive terminal session inside of it:

```bash
docker run -it --rm hamletio/hamlet:latest
```

Your terminal window should now look like this - if not, you might need to ensure you have Docker installed and configgured correctly.

```bash
hamlet @ ~/cmdb
└─ $
```

:::note
All Hamlet CLI commands have useful help pages that can be accessed within the container:

```bash
hamlet <command> --help
```
:::

## Creating the Tenant

Create your first Hamlet Tenant. After entering the command you will be asked a series of questions to help bootstrap the Tenant structure. The default option - available by leaving the prompt blank - is displayed in square-brackets.

```bash
hamlet @ ~/cmdb
└─ $ hamlet generate cmdb tenant --prompt
Enter tenant id: acmeinc
Enter tenant name [acmeinc]:
Enter domain stem []: acme.io
Enter default region [ap-southeast-2]:
Enter audit log expiry days [2555]:
Enter audit log offline days [90]:
+-----+------------------------+----------------+
|   № | parameter              | value          |
|-----+------------------------+----------------|
|   1 | tenant id              | acmeinc        |
|   2 | tenant name            | acmeinc        |
|   3 | domain stem            | acme.io        |
|   4 | default region         | ap-southeast-2 |
|   5 | audit log expiry days  | 2555           |
|   6 | audit log offline days | 90             |
+-----+------------------------+----------------+
Is everything correct? [y/N]: y
```

That's all it takes to create your first Tenant and its minimal configuration. 

Now let's take a look at what Hamlet has created for us. 

```bash
$ tree
.
└── accounts
    └── acmeinc
        ├── domains.json
        ├── ipaddressgroups.json
        └── tenant.json
```


Notice the directory structure here - `./accounts/acmeinc`. The `tenant name` that we provided to Hamlet - *"acmeinc"* - has been used for the directory name to store our configuration in.

A Tenant alone isn't sufficient for us to perform any Hamlet activities with it yet, so instead lets take a peek at the files Hamlet generated for us:

## tenant.json

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/tenant.json
{
    "Tenant" : {
        "Id" : "acmeinc",
        "Name" : "acmeinc",
        "CertificateBehaviours" : {
            "External" : true
        }
    },
    "Account" : {
        "Region" : "ap-southeast-2",
        "Domain" : "hamlet",
        "Audit" : {
            "Offline" :  90,
            "Expiration" :  2555
        }
    },
    "Product" : {
        "Region" : "ap-southeast-2"
    }
}
```

You will recognise most of the values defined in the **tenant.json** file are responses to the CLI prompts answered earlier. 

Configuration in this file will impact each Account and Product associated with it. Because of the breadth of its scope, the default configuration created is minimal - mostly it can be considered **default values**. 

We assign the Tenant a `Name` and `Id`, along with the default region configuration for the **Account** and **Product** layers. 

Defining defaults here rather than later in those layers means that we can set a single default at the greatest scope and only provide over-riding values when necessary, reducing unnecessary duplication and ensuring that exceptions to this configuration will stand out.

The configuration also sets the default `CertificateBehaviours` to `external`, telling Hamlet that any certificates are currently being handled elsewhere and their configuration should not be accounted for. Again, just a sensible default allowing certificates to be accounted for as necessary.

## domains.json

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/domains.json
{
    "Domains" : {
        "Validation" : "acme.io",
        "acmeinc" : {
            "Stem": "acme.io"
        }
    },
    "Certificates" : {
    }
}
```

An organisation will typically own one or more domains that they have purcahsed. Tracking these domains - even when presently unused, as is the case here - will allow Accounts and Products configured at a later time to make use of them. As we provided the CLI prompt with a domain owned by our Tenant, it has configured it here, however there are no certificates that use it currently.

## ipaddressgroups.json

```bash
hamlet @ ~/cmdb
└─ $ cat ./accounts/acmeinc/ipaddressgroups.json
{
    "IPAddressGroups" : {
    }
}
```

This file simply provides us with a best-practice location to store any IPAddressGroups that would be of interest across our Tenancy. A Tenant might for instance wish to define separate groups for different offices, and ensure that any Account or Product that uses it always reflects the latest details.

With our Tenant setup and reviewed, lets create an Account that belongs to it.