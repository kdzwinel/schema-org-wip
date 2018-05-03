### WIP JSON-LD audit

To run json/json-ld/schema.org validation against all examples from the `/examples` folder:

```
git clone git@github.com:kdzwinel/schema-org-wip.git
cd schema-org-wip
npm i
npm run start
```

<img src='https://i.imgur.com/gvKpyfw.png' width=450 title='example output' alt='example output' />

### Goals
primary:
- [x] json validation
- [x] json-ld validation (keywords)
- [x] schema.org types validation
- [x] schema.org keys validation
- [x] google required fields validation (only top level recommendations)

secondary:
- [ ] schema.org values validation

### Updating
1. Get CSV with schema.org types info - https://raw.githubusercontent.com/schemaorg/schemaorg/master/data/releases/3.3/schema-types.csv and save it in the `assets` folder.
2. Run `generateSchemaOrgData.js` to update `assets/schema.json`
3. Create a query with all schema types and run it agains https://search.google.com/structured-data/testing-tool
4. Get resulting json and save it in `assets/validator_output.json`
5. Run `generateGoogleRecommendations.js` to update `assets/schema_google.json`
