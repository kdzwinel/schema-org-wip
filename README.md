### WIP JSON-LD audit

To run json/json-ld/schema.org validation against all examples from the `/examples` folder:

```
git clone git@github.com:kdzwinel/schema-org-wip.git
cd schema-org-wip
npm i
npm run start
```

main goals:
- [x] json validation
- [x] json-ld validation (keywords)
- [x] schema.org types validation
- [x] schema.org keys validation
- [ ] google required fields validation (https://developers.google.com/search/docs/data-types/article)

stretch goals:
- [ ] schema.org values validation
