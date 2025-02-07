+++
title = 'Break Law of Demeter Gracefully In Java'
date = 2025-02-07T12:31:46+06:00
draft = false
tags = ["OOP", "design-patterns"]
categories = ["Design Patterns"]
+++

## What is Law of Demeter
The Law of Demeter (LoD), or Principle of Least Knowledge, is a design guideline in object-oriented programming that promotes loose coupling. It states that an object should only interact with its immediate collaborators, avoiding method chains (e.g., **obj.getA().getB().getC()**). Following LoD improves encapsulation, maintainability, and modularity. Read more about [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter).

Let's be honest, often times we have to break the Law of Demeter. In this article, we will discuss how to break the Law of Demeter gracefully in Java.


In AEM code, we often need to get the specific resource in sling models, services or servlets. If we have **SlingHttpServletRequest** object, we can get our desired resource as follows

```java
Resource resource = request.getResourceResolver()
                           .getResource("/content/myproject/en/home");
```
Here we can not respect **LoD** because there is no other way to get the resource without getting **ResourceResolver** object first. Also **request.ResourceResolver()** method call can potentially throw a **NullPointerException**. 

## Violate LoD Gracefully

To break the Law of Demeter gracefully, we can use the **Optional** in **Java**. **Optional** not only lets us violate LoD but also helps us to handle **NullPointerException** elegantly. 

```java
Optional<Resource> resource = Optional.ofNullable(request.getResourceResolver()
                                      .getResource("/content/myproject/en/home"));
```

## Conclusion
By using **Optional** not only we can break LoD gracefully but also handle NullPointerException elegantly. It is a good practice to use **Optional** when we are not sure about the object's state. 
