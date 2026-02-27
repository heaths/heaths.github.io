---
title: Get Azure Search Keys in ARM Templates
date: 2020-05-07 21:00:00 -07:00
excerpt_separator: <!--more-->
category: azure
tags:
- azure
- azuresdk
- arm
- search
- tip
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2bbhw322"
---

Late in 2019 I start working with a colleague on a common pattern of creating test resources using ARM templates. A [script deploys](https://github.com/Azure/azure-sdk-tools/blob/168ad3040e8df16377eb66e5a80d277494b30069/eng/common/TestResources/New-TestResources.ps1#L280-L282) the template using a common set of variables and outputs both common variables and any custom variables that tests for a service needs. The Azure Cognitive Search service, for example, needs both admin keys for read-write operations, and query keys for read-only operations.

<!--more-->

Azure Resource Manager (ARM) templates support a lot of [different functions](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-functions), including functions for various service to [list keys](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-functions-resource#list). You can use these to get the primary or secondary admin keys, or get any query keys that were created (one by default).

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceName": {
      "type": "string",
      "defaultValue": "[resourceGroup().name]"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    }
  },
  "variables": {
    "apiVersion": "2020-03-13"
  },
  "resources": [
    {
      "name": "[parameters('serviceName')]",
      "type": "Microsoft.Search/searchServices",
      "apiVersion": "[variables('apiVersion')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "free"
      },
      "properties": {
        "replicaCount": 1,
        "partitionCount": 1,
        "hostingMode": "Default",
        "publicNetworkAccess": "Enabled",
        "networkRuleSet": {
          "ipRules": []
        }
      }
    }
  ],
  "outputs": {
    "SEARCH_ADMIN_API_KEY": {
      "type": "string",
      "value": "[listAdminKeys(parameters('serviceName'), variables('apiVersion')).primaryKey]"
    },
    "SEARCH_QUERY_API_KEY": {
      "type": "string",
      "value": "[listQueryKeys(parameters('serviceName'), variables('apiVersion')).value[0].key]"
    }
  }
}
```

These functions take parameters like so:

```javascript
list(resourceIdOrName, apiVersion, functionValues);
```

* `resourceIdOrName` is a required string that is either the name of a resource created in the current ARM template, or an existing resource ID created with the [`resourceId`](https://docs.microsoft.com/azure/azure-resource-manager/templates/template-functions-resource#resourceid) function.
* `apiVersion` is a required string that is the version of the resource provider to use to look up the resource ID.
* `functionValues` is an optional object that provides named properties to whatever `list` function you call.

In the example above, we use the `serviceName` parameter in the same ARM template. To refer to existing resources, you can use the `resourceId` function:

```javascript
resourceId('Microsoft.Search/searchServices', 'my-search-service');
```

Using functions like these can output a lot of useful information from deployed resources.
