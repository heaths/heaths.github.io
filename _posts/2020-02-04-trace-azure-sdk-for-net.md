---
title: Tracing Azure SDK for .NET
date: 2020-02-04 03:18:00 -08:00
excerpt_separator: <!--more-->
categories: azure
tags:
- azure
- azuresdk
- csharp
- tip
atUri: "at://did:plc:tg3tb5wukiml4xmxml6qm637/site.standard.document/3mfdr2bdfew2x"
---

The new Azure SDK [has a lot of new features](https://aka.ms/azsdkvalueprop)
that make it worth migrating from Microsoft.Azure.* to Azure.* packages.
Logging is greatly improved and is consistent across client libraries. All
clients will log request and response information automatically when
AppInsights or OpenTelemetry is configured.

<!--more-->

You can also enable logging manually using either ETW applications like
*logman.exe*, or standard tracing tools like `dotnet trace` as shown in the
example below.

## Setting up

You need to set up your environment for `dotnet trace`. If you need to install
the dotnet SDK, see <https://dot.net>. Once you have dotnet installed, run
the following to install dotnet-trace:

```shell
dotnet tool install -g dotnet-trace
```

You can test your installation by running the following:

```shell
dotnet trace --help
```

If that doesn't work, try restarting your terminal.

Now you need to create a simple console project:

1. Run the following commands to create the project:
   ```shell
   dotnet new console -o sample
   cd sample
   dotnet add package Azure.Security.KeyVault.Secrets
   dotnet add package Azure.Identity
   ```
2. Replace the contents of *Program.cs* with the following:
   ```csharp
   using System;
   using System.Diagnostics;
   using System.Threading.Tasks;
   using Azure.Identity;
   using Azure.Security.KeyVault.Secrets;
   namespace logger
   {
       class Program
       {
           static async Task Main(string[] args)
           {
               var url = args.Length > 0 ? args[0]
                   : Environment.GetEnvironmentVariable("AZURE_KEYVAULT_URL")
                   ?? throw new InvalidOperationException("Azure Key Vault URL required.");

               using (var p = Process.GetCurrentProcess())
               {
                   Console.WriteLine("Run the following command and press Enter to continue:");
                   Console.Write("dotnet trace collect -p {0} --providers Azure-Core", p.Id);
                   Console.ReadLine();
               }

               var credential = new DefaultAzureCredential();
               var options = new SecretClientOptions
               {
                   Diagnostics =
                   {
                       // Set to true to log content. Default is false.
                       IsLoggingContentEnabled = true,
                   },
               };

               var client = new SecretClient(new Uri(url), credential, options);

               KeyVaultSecret secret = await client.SetSecretAsync("test-secret", "secret-value");
               Console.WriteLine(secret.Value);
           }
       }
   }
   ```
3. Make sure it builds by running:
   ```shell
   dotnet build
   ```

## Tracing network calls

Because we've now built a console application you'll need two terminals.

1. In one terminal, run:
   ```shell
   dotnet run -- <Key Vault URL>
   ```
   Unless you already have Azure credential environment variables defined, you should be
   prompted to authenticate using your browser and possibly a device code.
2. In the other terminal, copy, paste, and run the command output, e.g.:
   ```shell
   dotnet trace collect -p 1234 --providers Azure-Core
   ```
3. Back in the first terminal, press **Enter**.

This will, by default, write to *trace.nettrace* in the current directory.
You can use tools like [PerfView](https://github.com/microsoft/perfview/releases/latest)
to view trace information, including content if you set `IsLoggingContentEnabled`
to `true` as shown in the example above.

## More tracing

Some other clients may trace additional details. While Azure SDK is working
on improving documentation, you can browse source code for interesting client
libraries in [GitHub](https://github.com/Azure/azure-sdk-for-net). Newer
client libraries (a.k.a. "track 2") can be found in _sdk/**/Azure.*_ directories.
