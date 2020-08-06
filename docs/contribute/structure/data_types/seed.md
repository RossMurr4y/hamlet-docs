---
sidebar_label: seed
title: Seed
---
import Admonition from 'react-admonitions';

<Admonition type="warning" title="Under Construction">
The hamlet.io documentation is currently under significant re-development. Existing content is a placeholder and will be updated very soon.
</Admonition>

* The Seed is a random string value that is generated within the `baseline` component and stored within the CMDB
	* It is typically used wherever a name is required to be globally unique
	* once it is set and cloud infrastructure deployed with it, the `Seed` should never be updated
	* It can also be used wherever a random, unique value is required by a provider
		* though random, it is not an encrypted value and should be treated accordingly