+++
title = 'Show/hide page properties tab in dynamic template pages based on template name'
date = 2025-02-17T23:49:10+06:00
draft = true
categories = ["AEM - Adobe Experience Manager"]
tags = ["AEM"]
+++

Dynamic template created from same template type use the same page component. So if we add page properties to page component it will be available for all templates created from this template type.

Assume we have two dynamic templates created from the same template type. Lets call the templates Landing Page and Content Page. Both are created from Base Page Template Type. Now if we need some page properties for both template we can define them in page component and it will be inherited to both templates.

But, what if we need some page properties only for Landing Page and not for Content Page. This can achieved this by using custom granite render condition.

## Granite Render Condition
By using granite render condition we can render page properties tab conditionally for specific template based on template name. For the Landing page, we want to make the header and footer optional. Let's add a new tab with two checkboxes in page component dialog.

```xml
<header-footer-config
        cq:showOnCreate="{Boolean}true"
        jcr:primaryType="nt:unstructured"
        jcr:title="Header/Footer Configuration"
        sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
    <items jcr:primaryType="nt:unstructured">
        <column
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/container"
                maximized="{Boolean}true">
            <items jcr:primaryType="nt:unstructured">
                <section
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Header/Footer Configuration"
                        sling:resourceType="granite/ui/components/coral/foundation/form/fieldset">
                    <items jcr:primaryType="nt:unstructured">
                        <hide-header
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                name="./hideHeader"
                                value="true"
                                text="Hide Header"
                                fieldLabel="Hide Header"/>
                        <hide-footer
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
                                name="./hideFooter"
                                value="true"
                                text="Hide Header"
                                fieldLabel="Hide Footer"/>
                    </items>
                </section>
            </items>
        </column>
    </items>
</header-footer-config>
```

## Custom Render Condition Servlet
Now lets define a custom render condition servlet to implement the render condition logic -

```java
@Component(service = { Servlet.class })
@SlingServletResourceTypes(
        resourceTypes="aem-tutorials/components/renderconditions/tab-hide",
        methods=HttpConstants.METHOD_GET
)
@ServiceDescription("A simple render condition to hide page properties based on template")
public class TabHideRenderConditionServlet extends SlingSafeMethodsServlet {
    private static final long serialVersionUID = 1L;
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String requiredTemplate = getRequiredTemplate(request);
        String currentPageTemplate = getCurrentPageTemplate(request);
        request.setAttribute(RenderCondition.class.getName(), new SimpleRenderCondition(requiredTemplate.equals(currentPageTemplate)));
    }
    protected String getRequiredTemplate(SlingHttpServletRequest request) {
        return Optional.of(request.getResource())
                .map(Resource::getValueMap)
                .map(valueMap -> valueMap.get("template", String.class))
                .orElse(null);
    }
    protected  String getCurrentPageTemplate(SlingHttpServletRequest request) {
        String currentPageResourcePath = request.getParameter("item");
        ResourceResolver resourceResolver = request.getResourceResolver();
        return Optional.ofNullable(resourceResolver.getResource(currentPageResourcePath))
                .map(resource -> resource.adaptTo(Page.class))
                .map(Page::getTemplate)
                .map(Template::getName)
                .orElse(null);
    }
}
```

Whenever the page properties of a page is opened, this servlet gets triggerd with item query parameter, which contains the page path. From the page path we derrive the page template name and checks if the template matches required template.

Now add the render condition in custom page property tab section. Define the template name for which the header-footer-config tab should be displayed.

```xml
<header-footer-config>
    ....
    <granite:rendercondition
            jcr:primarytype="nt:unstructured"
            sling:resourcetype="aem-tutorials/components/renderconditions/tab-hide"
            template="landing-page"/>
</header-footer-config>
```
Deploy all the changes and test it out. The Header/Footer Configuration tab will now only be visible for Landing Page.

Check out the complete code in this [GitHub](https://github.com/julkar-naim/aem-tutorials/commit/4220be7ac91c0e7f6f4e14433d0d343e5491bfd7) repository.
