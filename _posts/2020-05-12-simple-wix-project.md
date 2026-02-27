---
title: Simple WiX Project
date: 2020-05-12 22:45:00 -07:00
excerpt_separator: <!--more-->
category: setup
tags:
- setup
- wix
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2banlt2y"
---

Globally-unique identifiers (GUIDs) are often the brunt of jokes. Windows Installer packages (.msi files) are full of them, from the required ProductCode, to highly-recommended UpgradeCode, package codes, and required component GUIDs. Authoring an MSI doesn't require you create and manage so many GUIDs, however. In fact, [Windows Installer XML](https://wixtoolset.org) (WiX) has in the last few years made great strides in making sure you don't have to, and recommends you don't.

<!--more-->

Component GUIDs can be especially tricky. They should be unique for unique key paths and based on composition. I [wrote a blog post](https://devblogs.microsoft.com/setup/about-shared-components/) over a decade ago about what happens when components have the same GUID - shared components - whether you intended it or not. Whether it was authoring mistakes, or a user was allowed to change the installation directory to overwrite existing components even for a different product, they can cause all sorts of problems.

The best thing you can do as a package author is not to author them. WiX will create durable GUIDs based on the key path; though, only adding to the component composition is up to you. The best thing is most often to keep one resource per component - especially for files.

In [my sample project](https://github.com/heaths/WixSampleApp), I slightly modify a new "Setup Project for WiX v3" to add a file component referencing a `ProjectReference`'s output, and another registry component with a couple of registry values which requires attributing one as the `KeyPath` - the best `KeyPath` being one that tends to change with each new version of a product.

```xml
<ComponentGroup Id="ProductComponents" Directory="INSTALLFOLDER">
    <Component>
        <File Source="$(var.SampleApp.TargetPath)" />
    </Component>
    <Component>
        <RegistryKey Root="HKLM" Key="Software\[Manufacturer]\[ProductName]">
            <RegistryValue Name="InstallDir" Type="string" Value="[INSTALLFOLDER]" />
            <RegistryValue Name="Version" Type="string" Value="[ProductVersion]" KeyPath="yes" />
        </RegistryKey>
    </Component>
</ComponentGroup>
```

The project [README](https://github.com/heaths/WixSampleApp/blob/master/README.md) provides more detailed instructions of how this project was modified and how to build it - including prerequisites. This blog post is to point out that only a single GUID is authored: the `UpgradeCode`. Even if you don't intend to upgrade your product, servicing is inevitable so be prepared to support at least major upgrades, which are far easier to author and test, and more reliable - if not larger - for customers to install. My [old but still-relevant posts](https://devblogs.microsoft.com/setup/tag/serviceability/) provide more details and issues with different types of servicing packages - the vast majority of which are with patches (.msp files).
