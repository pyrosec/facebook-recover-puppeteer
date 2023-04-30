# facebook-recover-puppeteer

Library to perform the Facebook account recovery workflow to correlate a phone number to a Facebook user and potentially E-mail

## Usage

```js

const fb = require('facebook-recover-puppeteer');

fb.lookupPhone({ phone: '3078884444' }).then((results) => {
  console.log(results); // [ 'Mike Jones', 'm****@****', '+13078884444' ]
});
```
  

## CLI Usage

```sh
npm install -g
facebook-recover init session
facebook-recover lookup-phone --phone 3078884444
```
