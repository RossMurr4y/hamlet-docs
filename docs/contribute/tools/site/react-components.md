---
sidebar_label: react components
title: React Components
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* we have developed a few React components specific to hamlet data
* currently can be found in the hamlet-docs repo under `./src/components`
* the below documents their purpose and usage
* all currently be seen in use on hamlet.io

# Components
### HamletComponents
* Using the `HamletJsonSchema` functions below this Component reads in the publicly published JSONSchema for Hamlet component structures
* The Data is then rendered as reference data tables at [hamlet](https://hamlet.io/reference)
* This allows us to use Hamlet to define its own JSONSchema for each Component and ensure the documentation is always current

#### Props
* none

### HamletExample
* used within the `HamletComponents` React component above, the `HamletExample` component is a pre-formatted code-block with tabs that presents one or more code examples
* For each JSON code block that is provided to this component, it renders the JSON as the primary tab of a code block, with the same JSON converted to YAML as a secondary tab.
* This allows all hamlet examples to be presented in both formats easily


### HamletJsonSchema
_Exported utility functions_

#### getHamletJsonSchema
Props: type, version
* Simple function  component that can be used to switch between different schema types
* Specify the type of schema required and its version (incl. latest) and it will return its structure from source.

#### getAsyncComponents
* retrieves the required JSON schema using the above
* Filters out all the non-component schema content

#### getAttributeStructure
* Props: attributes[]
* Processes an array of attributes for a given schema and determines if each of them have children
* returns a list of the attributes now associated with a separate list of their own children
	* these will each become separate tables in the reference data

#### getComponentStructure
* Props: name, attributes, requires as { props }
* Uses the above function components to seperate out an individual Hamlet components JSONSchema into individual schemas
	* each Attribute of the component that has children is separated into its own schema
	* There is also a “root” schema for the component


#### getComponentExampleCodeblock
Props: schema
* Uses the generated and restructured component schemas from all the above functions to construct a JSON representation of the Hamlet Component as it would appear in a solution.
* Presents the JSON with human-readable notation in place of type-data.

# Links
* provide a link to JSONSchema documentation


#work/tenants/gosource/hamlet/docs/ecosystem/docs-site/react