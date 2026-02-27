---
title: Custom String formatting in .NET
date: 2004-04-28
origin: https://www.codeproject.com/Articles/6533/Custom-String-Formatting-in-NET
summary: >-
    Discusses the implementation of custom format providers for existing types
    and custom formatting for user-defined types.
categories: CodeProject
tags:
- csharp
---
## Introduction

Formatting string output is difficult to avoid in many applications, even with modern graphical user interfaces. It's inevitable that at some point you'll need to format data in a way that's easy to understand. Practically every runtime has its set of string formatting procedures and the .NET Framework is no exception. Understanding how the culture-aware and extensible string formatting works in the .NET Framework, though, can help you create better ways of formatting data.

This article is not so much about the format providers present in the .NET Framework Class Library - though they will be discussed briefly - but about how to write custom formatting routines in such a way that they can easily be used anywhere they're required. Basic string formatting will be discussed, as well as format providers in the .NET Framework, extending existing types with custom format providers, and extending your types with custom formatting.

## String Formatting Made Simple

There are countless ways to format strings in any language. It could be as simple as converting all data to strings and concatenating the strings, or using inline expressions with possible format specifiers.

Take, for example, Perl. This simple example uses a local string variable in its `print` function, as well as a real number that would use the appropriate decimal separator based on the `LC_CTYPE` environment variable.

```perl
use locale;
my $var1 = "Perl";
my $var2 = 5.6;
print("Hello, from $var1 $var2!");
```

The `print` function simply evaluates the variables in the expression and writes it to `STDOUT` (the standard output handle). The current locale changes the format very little without having to pass the variables into other functions first. These inline expressions also do not easily allow the developer to use different expressions while evaluating the same variables.

The ANSI C `printf` function solves this problem by separating the string expression from the variables to be formatted using a variable parameter list and indexed format specifiers.

```cpp
char* var1 = "ANSI C";
float var2 = 7.1;
printf("Hello, from %s %g!", var1, var2);
```

The `printf` function is also subject to the same locale environment variables as Perl. This ANSI C example shows how a separate string can be used to format the variable list of arguments. This facilitates loading different format strings, including format strings in a different language. The format specifiers additionally gives you a little more control over how the variables are evaluated, such as printing integers in hexadecimal notation, though hese format specifications are pretty inflexible.

In both examples above, string formatting is rather inflexible using the standard runtime libraries. Other solutions exist that use third party libraries or user-defined functions to format arguments before they are evaluated, but it would be nice to have an extensible formatting solution provided by the runtime without having to support third-party code or calling user-defined functions before formatting your arguments.

In the .NET Framework, there are several ways to format inline string expressions, including [`String.Format`](https://learn.microsoft.com/dotnet/api/system.string.format), [`StringBuilder.AppendFormat`](https://learn.microsoft.com/dotnet/api/system.text.stringbuilder.appendformat), and [`TextWriter.Write`](https://learn.microsoft.com/dotnet/api/system.io.textwriter.write) (and [`WriteLine`](https://learn.microsoft.com/dotnet/api/system.io.textwriter.writeline)), which the [`Console`](https://learn.microsoft.com/dotnet/api/system.console) class inherits. These methods not only allow you to load different string expressions to format, but allow you to control the format of a variable list of arguments using a variety of format specifiers provided in the Framework Class Library (FCL) as well as custom format specifiers, which will be covered later. The following example uses the `CultureInfo` from `Thread.CurrentCulture` to format relevant variables.

```csharp
string var1 = ".NET";
float var2 = 1.1;
string.Format("Hello, from {0} {1}!", var1, var2);
```

Also notice that the format specifiers are also indexed, meaning that you can evaluate parameters regardless of the order in the variable parameter list. You could even re-use the same variable repeatedly in an expression. This also looks much nicer and is more extensible - such that string format expressions could be loaded from a resource - than another common approach that was mentioned earlier in this article:

```csharp
string var1 = ".NET";
float var2 = 1.1;
string s = "Hello, from " + var1 + " " + var2.ToString() + "!";
```

I'm sure you'll agree that the string format expression is much easier to read and change at runtime. The true power of formatting strings in .NET doesn't stop there, however. Additional format specifications can be used to control the output of numeric types in endless ways.

## Format Specifiers in .NET

When using methods like `String.Format,` indexed placeholders are evaluated and formatted using format specifications in the string format expression. This is known as Composite Formatting[^]. Each format specifier can take the form of `{index[,alignment][:formatString]}`. These format strings can be just about anything and can define additional options for a specific format. You can also pad and align the formatted output string to fit a certain number of spaces or tabs.

These format specifiers are passed by the `StringBuilder` internally to implementations of `IFormattable`, or `ICustomFormatter` when an `IFormatProvider` is passed as the first argument (for methods in the FCL). This will be covered shortly.

## Format Providers in the Framework Class Library

Format providers - as the name implies - provide formatting capabilities to types. The two format providers in the FCL are the [`DateTimeFormatInfo`](https://learn.microsoft.com/dotnet/api/system.globalization.datetimeformatinfo) and [`NumberFormatInfo`](https://learn.microsoft.com/dotnet/api/system.globalization.numberformatinfo) classes. Both implement the IFormatProvider interface, which is an interface that must be supported for format providers when used with the string formatting methods described earlier. This defines a contract by which all format providers must abide so that a common implementation can be established. This interface will be covered in greater detail later.

When formatting numeric types and the `DateTime` structure, if no `IFormatProvider` implementation is provided, the two format provider classes above are used automatically to provide formatting for the related types. A simple example using a `DateTime` follows.

```csharp
DateTime now = DateTime.Now;
string.Format("Short date:         {0:d}", now);
string.Format("Long date:          {0:D}", now);
string.Format("Sortable date/time: {0:s}", now);
string.Format("Custom date:        {0:ddd, MMM dd, yyyy}", now);
```

Using format specifiers, you could also load the string format expression from an embedded resource file using the [`ResourceManager`](https://learn.microsoft.com/dotnet/api/system.resources.resourcemanager). While the current `CultureInfo` is used to format the actual dates, times, and numbers (or a specific culture's `DateTimeFormatInfo` or `NumberFormatInfo` is passed as the `IFormatProvider` parameter), you could use this approach to load localized strings - including strings that use a right-to-left reading order.

For instance, if you want to format a date using another culture's formatting information without changing the executing thread's `CurrentCulture`, you could simply get the `DateTimeFormatInfo` for that culture:

```csharp
CultureInfo culture = new CultureInfo("de-DE");
DateTime dt = DateTime.Now;
string.Format(culture.DateTimeFormat, "Gro�datum:          {0:D}", now);
```

The date would use the German culture information for dates and times to format the value, including localized day and month names and the order of the various elements of the string.

To further extend this as mentioned previously, you could get the string format expression from an embedded resource. For simplicity, the `Thread.CurrentUICulture` is assumed to be set appropriately.

```csharp
ResourceManager resources = new ResourceManager("Strings.resources",
  GetType().Assembly);
string format = resources.GetString("CommonFormat");
DateTime dt = DateTime.Now;
string.Format(format, now);
```

The value keyed as "CommonFormat" would contain the string format expression, like "Long date: {0:D}". These are commonly stored in ResX files, which is beyond the scope of this article.

## Extending Existing Types with Custom Format Providers

Numeric types and the `DateTime` structure already have associated format providers that provide a lot of different formats. The `DateTimeFormatInfo` even lets you use custom format specifiers. But what if you want to format any type and either can't extend the type or don't want to just for the same of formatting?

You can implement the `ICustomFormatter` interface and expose the implementation through a custom `IFormatProvider`, which you can pass as the first parameter to methods like `String.Format`. Two custom format providers are included with the sample project for this article: a custom `NumberFormatInfo` class which can convert numbers to any radix (from the .NET Framework SDK, included because its very handy) and to Roman numerals up to 3,999,999; and a `StringFormatInfo` class which can convert strings to Morse Code (includes support for current characters, including "@" which was just added early in 2004). In both samples, both the `ICustomFormatter` and `IFormatProvider` interfaces are implemented to make things easy, and there's absolutely no reason why you couldn't do the same in production code. The declaration of the `StringFormatInfo` class follows.

```csharp
public sealed class StringFormatInfo : IFormatProvider, ICustomFormatter
{
}
```

As you can see, the class implements `IFormatProvider` so that we can simply pass it into call like `String.Format`:

```csharp
StringFormatInfo fmtinfo = new StringFormatInfo();
string.Format(fmtinfo, @"The morse code for ""{0}"":\n{0:m}", "Hello, world");
```

[`IFormatProvider`](https://learn.microsoft.com/dotnet/api/system.iformatprovider) declares a single method, [`GetFormat(Type)`](https://learn.microsoft.com/dotnet/api/system.iformatprovider.getformat). To implement this method, see if the argument is of type `ICustomFormatter`, not your class type. This has to do with the internal implementation of formatting methods.

```csharp
public object GetFormat(Type formatType)
{
  if (typeof(ICustomFormatter).Equals(formatType)) return this;
  return null;
}
```

[`ICustomFormatter`](https://learn.microsoft.com/dotnet/api/system.icustomformatter) also declares a single method, [`Format(String, Object, IFormatProvider)`](https://learn.microsoft.com/dotnet/api/system.icustomformatter.format). This is where the real work is done. You should first make sure that a object to be formatted is not null (`Nothing` in Visual Basic), unless you want to handle null values specially with your custom format provider. Then check the format string - the first parameter declared in the method. You can choose whether or not to compare the strings in a case-sensitive manner. The `DateTimeFormatInfo` provided in the FCL, for example, differentiates between "d" and "D", and several other characters. For the `StringFormatInfo` example, a case-insensitive comparison is performed.

```csharp
public string Format(string format, object arg, IFormatProvider formatProvider)
{
  if (arg == null) throw new ArgumentNullException("arg");
 
  if (format != null && arg is string)
  {
    string s = format.Trim().ToLower();
    if (s.StartsWith("m"))
      return FormatMorseCode(arg as string, format);
  }
 
  if (arg is IFormattable)
    return ((IFormattable)arg).ToString(format, formatProvider);
  else return arg.ToString();
}
```

In this example, I simply trim the format and convert it to lower case. I could've just as easily used `String.Compare`, but if you supported multiple format specifiers you don't want the overhead of a case-insensitive string comparison in each condition. After that, I check if the format specifiers starts with an "m". If so, I pass certain arguments to my `FormatMorseCode` method, for which you can see the implementation in the sample project.

One important thing to remember is that if you don't handle the object type or the format specifier is not valid for your `IFormatProvider` implementation, you should handle the object appropriately by determining if it supports the `IFormattable` interface (which I'll cover shortly); if it does, call the `IFormattable.ToString(String, IFormatProvider)` method; otherwise, just call `ToString` which is declared by the `Object` class and is thus inherited by every class, some of which override the default implementation which simply prints the fully-qualified type of the object.

Format providers may also define properties that control the formatting in specific ways. The `DateTimeFormatInfo`, for example, defines many properties to get and set the `Calendar` to use, the localized names of days, and much more. The sample `StringFormatInfo` provides a `LineWidth` property which helps ensure that dots and dashes are kept together for for clarity. If you were to separate your `IFormatProvider` and `ICustomFormatter` implementations, you should typically define these properties on your `IFormatProvider` implementation since it is passed to the `ICustomFormatter` implementation, as well as the `IFormattable` implementation which I'll discuss shortly. In this case, make sure you are dealing with the right type and get the properties you need by casting to your type. When possible, exposing these properties as format specifier options may also be advantageous, though you probably shouldn't make it too complicated and simply expose what would be easy to represent and parse.

Custom format providers give you the ability to use a simple class or classes that provide custom format specifiers and options to pre-existing types. This is quite a bit of unnecessary work, though, when you define your own types.

## Extending Your Types with Custom Formatting

When defining your own class and structure types, you can provide custom formatting easily enough through any means you want. If you want to support the standard formatting routines in .NET, however, you must implement `IFormattable`. You could also simply decide to override the `ToString()` method inherited from the Object class if you want to display a custom string for a type and don't need to support more than one type. Point is one example with only overrides `ToString()` and returns a string in the form of "{X=X, Y=Y}".

[`IFormattable`](https://learn.microsoft.com/dotnet/api/system.iformattable) declares just one method again, [`ToString(String, IFormatProvider)`](https://learn.microsoft.com/dotnet/api/system.iformattable). There again is the `IFormatProvider` interface, which is another good reason to define format properties on your `IFormatProvider` implementation. You could always check for different types you support, then cast them and get the properties you need to help control the format of your output. In this simple example, I do just that:

```csharp
char c = divisor;
// ...

if (formatProvider is NumberFormatInfo)
  if (((NumberFormatInfo)formatProvider).UseDiacritic)
    c = diacritic;
```

Implementing `IFormattable.ToString` is pretty easy, but you should also consider overloading `ToString` to provide a single parameter for each of type. These can simply call the implementation method, which uses the format specifier and optionally information from the `IFormatProvider` argument to format your type as a string.

```csharp
public override string ToString()
{
  return ToString("g", null); // Always support "g" as default format.

}
 
public string ToString(string format)
{
  return ToString(format, null);
}
 
public string ToString(IFormatProvider formatProvider)
{
  return ToString(null, formatProvider);
}
 
public string ToString(string format, IFormatProvider formatProvider)
{
  if (format == null) format = "g"; // Set default format, which is always "g".

  // Continue formatting by checking format specifiers and options.

}
```

See the `Rational` struct example - a mostly full-featured fractional number structure - for more details of how `IFormattable.ToString` is implemented in the sample project. It isn't much different from examples above for custom format providers for existing types.

## Summary

Formatting strings using the .NET Framework is a very flexible system when you implement the right interfaces. You can provide both custom formatters for existing types and implement custom formatting in your own types. The sample project for this article demonstrates both way of providing custom formatting and includes a simple test application to try out the different combinations.

Using custom format providers and formatters can help streamline your code so that you can load custom format expressions from different sources like databases or resource files, and provide custom formatting options for indexed arguments, even reusing the same arguments throughout the format expression. With a little extra code, you should have no problem providing just about any string format when your application requires it.
