## Updating assets

http://schema.org/docs/jsonldcontext.json
https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.3/schema-properties.csv

### Create a SDTT query

http://schema.org/docs/full.html

```js
Array
  .from(document.querySelector('#thing_tree').querySelectorAll('a[href^="/"]'))
  .map(a => a.innerText.trim())
  .map(type => { return JSON.stringify({'@context': 'http://schema.org/', '@type': type}, null, 2)})
  .join(`,
`);
```

+

```js
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction"
  }
},
{
  "@context": "http://schema.org",
  "@type": "MusicAlbum",
  "potentialAction": {
    "@type": "ListenAction"
  }
}
```

### Run the query

https://search.google.com/structured-data/testing-tool

```html
<script type="application/ld+json">
[QUERY_GOES_HERE]
</script>
```