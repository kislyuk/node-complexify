node-complexify
===============

node.js port of [jquery.complexify.js](https://github.com/danpalmer/jquery.complexify.js/)

## Installing
```
npm install node-complexify
```

## Usage
As a module:
```javascript
var complexify = require('node-complexify');

complexify.evalPasswordComplexity("MadHatter", function(err, result) {
  console.log(result.complexity);
  console.log(result.valid);
});
```

As an executable:
```
complexify "MadHatter" || echo "Password not complex enough"
```
