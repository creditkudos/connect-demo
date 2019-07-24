# connect-demo
A sample Node/Express app using Credit Kudos Connect.

## Setup
Before running this app you will need to have [Node.js](https://nodejs.org/en/download/) and [OpenSSL](https://www.openssl.org/source/) installed on your machine.

Once you have these installed, you will need to configure a Credit Kudos Application using your Atlas developer account. This application should be in `sandbox` mode and its `redirect_uri` **must** be set to `https://localhost:8888/callback` in order for this demo to work properly.

For more information on creating an application, visit the [Credit Kudos API docs](https://docs.creditkudos.com/#creating-api-credentials).

Once you have your application configured, complete the following steps to run the Connect demo app:

1. In the root directory, create a new file with the filename `.env`. Copy the variables from the `.env.example` into your `.env` and set the `CLIENT_ID=` and `CLIENT_SECRET=` to the corresponding values for the application that you configured on Atlas.

An example `.env`:
```
CLIENT_ID=0101010101010101010101010101010101010101010101010101010101010101
CLIENT_SECRET=1010101010101010101010101010101010101010101010101010101010101010
REDIRECT_URI=https://localhost:8888/callback
```
**Note**: `REDIRECT_URI` must be set to `https://localhost:8888/callback` in both the `.env` file and on your application created in Atlas.

2. Install JavaScript dependencies. If successful, you should now see a `/node_modules` folder in the root directory.
```shell
$ npm install
```

3. Run start script:
```shell
$ npm start
```

Since this app requires you to run HTTPS locally, this script will generate a self-signed SSL certificate. It will prompt you for information that will be used to generate the certificate. All fields **except for `Common Name`** can be left blank (by hitting the `enter` key). **`Common Name` should be set to `localhost`**.

If successful, a `server.cert` and `server.key` file and a `dist/` directory will be added to the root directory.

Output from a successful start script:
```shell
$ npm start

> connect-demo@0.0.0 start /Users/jamesball/creditkudos/connect-demo
> npm run build && npm run server


> connect-demo@0.0.0 build /Users/jamesball/creditkudos/connect-demo
> npm run build:certs && npm run build:js


> connect-demo@0.0.0 build:certs /Users/jamesball/creditkudos/connect-demo
> openssl req -nodes -new -x509 -keyout server.key -out server.cert

Generating a 2048 bit RSA private key
.+++
................................................................+++
writing new private key to 'server.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) []:
State or Province Name (full name) []:
Locality Name (eg, city) []:
Organization Name (eg, company) []:
Organizational Unit Name (eg, section) []:
Common Name (eg, fully qualified host name) []:localhost
Email Address []:

> connect-demo@0.0.0 build:js /Users/jamesball/creditkudos/connect-demo
> parcel build ./js/complete.js

✨  Built in 2.72s.

dist/complete.js.map       93.26 KB     21ms
dist/complete.js           26.11 KB    2.48s
dist/complete.css.map       3.27 KB      3ms
dist/complete.css           1.67 KB    915ms
dist/icons.d106e9c9.svg       867 B    170ms

> connect-demo@0.0.0 server /Users/jamesball/creditkudos/connect-demo
> node server.js

Credit Kudos Connect Demo app listening on port 8888
```

4. Navigate to `https://localhost:8888` in your browser.

Note: since your SSL certs are self-signed, they will not be trusted by the browser, so you may see a screen advising you that the connection is not secure. This is normal and does not pose a security risk, since the server is running entirely on your local machine. You will likely need to configure your browser settings or click a link to allow you to continue this page.
