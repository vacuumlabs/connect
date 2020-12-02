## Cardano: get public key
Retrieve a BIP32-Ed25519 extended public derived by given BIP32-Ed25519 path.

ES6
```javascript
const result = await TrezorConnect.cardanoGetPublicKey(params);
```


### Params

Has 2 modes, the single key export, and the bundle export.

#### Exporting single public key
* `path` — *required* `string | Array<number>` BIP44 derivation path for the public key, minimum length `3`, accepts both string (ex. `m/1852'/1815'/0'`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0]`) formats
* `showOnTrezor` — *optional* `boolean` When turned on the public key is displayed on the trezor device, otherwise only the prompt is shown in the connect popup. Default is set to `false`

#### Exporting bundle of public keys
* `bundle` - *required* `Array` Array of Objects with `path` and (optionally)`showOnTrezor` fields. Expected format `[{singleKey},{singleKey},...]`


### Responses
Depending on which mode was used.

#### Single key
```javascript
{
    success: true,
    payload: {
        path: Array<number>, //(ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0]`)
        serializedPath: string, //(ex. `m/1852'/1815'/0'`)
        publicKey: string, //extended public key in hexadecimal string notation
        node: HDPubNode //explained further down
    }
}
```

#### Bundle
```javascript
{
    success: true,
    payload: [
        { path: Array<number>, serializedPath: string, publicKey: string, node: HDPubNode}, // first requested account 
        { path: Array<number>, serializedPath: string, publicKey: string, node: HDPubNode}, // second requested account
        .
        .
        .
    ]
}
```

#### Error case
```javascript
{
    success: false,
    payload: {
        error: string // error message
    }
}
```

#### HDPubNode type
```javascript
type HDPubNode:{
	depth:integer, //depth of the node also length of the path
	fingerprint: integer, //hash of the parent public key
	child_num: integer, //internal child index
	chain_code: bytestring, //second half of the extended public key in hexadecimal string notation
	public_key: bytestring  //first half of the extended public key in hexadecimal string notation
}
```

### Examples
Display root public key of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetPublicKey({
    path: "m/1852'/1815'/0'",
    showOnTrezor: true
});
```
#### Response
```javascript
{
	success: true,
	payload: {
		path: [2147485500, 2147485463, 2147483648],
		serializedPath: "m/1852'/1815'/0'",
		publicKey: "e8909e6fe860908da9cb888471477eabead3e3a7d4cb3595504721cfc2d5ed76a0f0fc08e81cab2b35236be57395ec817c5670399beeffaa5436ca98a3e4636e",
	    node: {//HDPubNode
	    	depth: 3,
	    	fingerprint: 1044245359,
	    	child_num: 2147483648,
	        chain_code: "a0f0fc08e81cab2b35236be57395ec817c5670399beeffaa5436ca98a3e4636e".
	        public_key: "e8909e6fe860908da9cb888471477eabead3e3a7d4cb3595504721cfc2d5ed76"
	    }
	}
}

```

Return a bundle of cardano public keys without displaying them on device:

#### Request
```javascript
TrezorConnect.cardanoGetPublicKey({
    bundle: [
        { path: "m/44'/1815'/0'", showOnTrezor: false }, // account 1
        { path: "m/44'/1815'/1'", showOnTrezor: false }, // account 2
    ]
});
```

### Response
```javascript
{
	success: true,
	payload: [
		{
			path: [2147485500, 2147485463, 2147483648],
			serializedPath: "m/1852'/1815'/0'",
			publicKey: "e8909e6fe860908da9cb888471477eabead3e3a7d4cb3595504721cfc2d5ed76a0f0fc08e81cab2b35236be57395ec817c5670399beeffaa5436ca98a3e4636e",
		    node: {//HDPubNode
		    	depth: 3,
		    	fingerprint: 1044245359,
		    	child_num: 2147483648,
		        chain_code: "a0f0fc08e81cab2b35236be57395ec817c5670399beeffaa5436ca98a3e4636e".
		        public_key: "e8909e6fe860908da9cb888471477eabead3e3a7d4cb3595504721cfc2d5ed76"
		    }
		},
		{
			path: [2147485500, 2147485463, 2147483649],
			serializedPath: "m/1852'/1815'/1'",
			publicKey: "ca15b03d9679c9ee7539f22f728b04bcff56003d6594cf332cf1025236b5d03930111c90dddb5a505651cfba6c3ac819cca5a32605041cc930a40e727f808a3d",
		    node: {//HDPubNode
		    	depth: 3,
		    	fingerprint: 1044245359,
		    	child_num: 2147483649,
		        chain_code: "30111c90dddb5a505651cfba6c3ac819cca5a32605041cc930a40e727f808a3d".
		        public_key: "ca15b03d9679c9ee7539f22f728b04bcff56003d6594cf332cf1025236b5d039"
			}
		}
	]
}

```