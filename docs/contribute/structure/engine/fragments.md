---
sidebar_label: fragments
title: Fragments
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* fragments provide a mechanism for solution designers to interact with the current context model (link to context) during engine runtime of a template pass
* kept within the solution
* they compile at engine runtime into a single routine (link to routine def)
	* the routine initiates the applicable “fragment” from the compiled list based on:
		*  the current engine template pass
		* the value of the  `Fragment` attribute (if available) of the current deployment-unit 
			* Not all Components offer a `Fragment` attribute,
				* check the reference data for specific component attributes (link)

# Fragment Routine Structure
## Fragment Assignment
```json
// example strucure of a deployment-unit assigned an example fragment called "_exampleFragment"
```


## Fragment File
* Must be defined in a solution (link), within the applicable environment and segment
* Naming convention is `fragment_<name-assigned>.ftl`
	* this is a freemarker filetype
* must contain free marker using the square-bracket syntax (link)
* must **not** initiate the free marker file as would usually be the case
	* do not start the file with `[#FTL]`
* must instead begin with a freemarker `[#case ...]` directive
	* the directives statement must match the assignment name in the solution
* must end in a `[#break]`  free marker directive

#### Example Path
`<exampleProduct>/config/solutionsv2/shared/default/fragment_exampleFragment.ftl`

#### Example Content

```
[#case "_exampleFragment"]

  [@Settings [{ "example" : "setting" }] /]

  [#break]
```

#work/tenants/gosource/hamlet/docs/engine/legacy