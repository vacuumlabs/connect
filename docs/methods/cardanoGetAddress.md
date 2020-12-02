## Cardano: get address
Display requested address derived by given BIP32-Ed25519 path on device and return it to caller.

ES6
```javascript
const result = await TrezorConnect.cardanoGetAddress(params);
```


### Params

Has 2 modes, the single key export, and the bundle export.

#### Exporting single address
* `addressParameters` — *required* see description below
* `address` — *optional* `string` Address in Bech32/Base58 for custom validation, read `Custom UI validation` section below
* `protocolMagic` - *required* `number`  must be 764824073 for Mainnet, 42 for Testnet
* `networkId` - *required* `number` must be 1 for Mainnet, 0 for Testnet
* `showOnTrezor` — *optional* `boolean` When turned on the address is displayed on the trezor device, otherwise only the prompt is shown in the connect popup. Default is set to `true`

#### Exporting bundle of addresses
* `bundle` - *required* `Array` of Objects with single address fields

#### Address Parameters
* `addressType` - *required* `CardanoAddressType`/`number` - Type of the address you want to display, accepts both flow `CARDANO.ADDRESS_TYPE` object and typescript `CardanoAddressType` enum. Potential types are Base (0), Pointer (4), Enterprise (6), Byron (8) and Reward (14).
* `path` — *required* `string | Array<number>` BIP44 derivation path for the address, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/0/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]`) formats
* `stakingPath` — *optional* `string | Array<number>` BIP44 derivation path for the staking part of the address, either this or `stakingKeyHash` are required for base address derivation, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/2/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]`) formats
* `stakingKeyHash` - *optional* `string` Staking part of the address as hex string, either this or `stakingPath` are required for base address derivation, device cannot verify ownership of the staking key.
* `certificatePointer` - *optional* `CardanoCertificatePointer` object. Must contain `number`s `blockIndex`, `txIndex` and `certificateIndex`. Required for pointer address derivation.


#### Custom UI validation
Since trezor-connect@6.0.4 there is a possibility to handle `UI.ADDRESS_VALIDATION` event which will be triggered once the address is displayed on the device.
You can handle this event and display custom UI inside of your application.

The connect popup will not be shown if these conditions are met:
- the user gave permissions to communicate with Trezor
- device is authenticated by pin/passphrase
- application has `TrezorConnect.on(UI.ADDRESS_VALIDATION, () => {});` listener registered
- parameter `address` is set
- parameter `showOnTrezor` is set to `true` (or not set at all)
- application is requesting ONLY ONE(!) address


### Responses
Depending on which mode was used.

#### Single address
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: number, //(ex. `0` or `CardanoAddressType.Base`)
            path: Array<number>, //(ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]`)
            stakingPath?: Array<number>, //(ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]``)
            stakingKeyHash?: string, //hexadecimal notation (ex. 1bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff)
            certificatePointer?: { //must be present if addresType == CardanoAddressType.Pointer == 4
                blockIndex: number, //index of the block this pointer is pointing to
                txIndex: number, //index of the transaction within the block this pointer is pointing to
                certificatePointer: number, //index of the certificate within the transaction this pointer is pointing to
            }
        }
        serializedPath: string, //(ex `m/1852'/1815'/0'/0/0`)
        serializedStakingPath?: string, //(ex `m/1852'/1815'/0'/2/0`)
        protocolMagic: number, //764824073 or 42 depending on network
        networkId: number, //1 for mainnet, 0 for testnet
        address: string, //derived address in Bech32 or Base58 notation
    }
}
```

#### Bundle
```javascript
{
    success: true,
    payload: [
        {
            addressParameters: {
                addressType: number,
                path: Array<number>,
                stakingPath?: Array<number>,
                stakingKeyHash?: string,
                certificatePointer?: {
                    blockIndex: number,
                    txIndex: number,
                    certificatePointer: number,
                }
            }
            serializedPath: string,
            serializedStakingPath?: string,
            protocolMagic: number,
            networkId: number,
            address: string,
        },    									//first requested address
        {
            addressParameters: {
                addressType: number,
                path: Array<number>,
                stakingPath?: Array<number>,
                stakingKeyHash?: string,
                certificatePointer?: {
                    blockIndex: number,
                    txIndex: number,
                    certificatePointer: number,
                }
            }
            serializedPath: string,
            serializedStakingPath?: string,
            protocolMagic: number,
            networkId: number,
            address: string,
        },    									//second requested address
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

### Examples
Display byron address of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 8,
        path: "m/44'/1815'/0'/0/0",
    },
    protocolMagic: 764824073,
    networkId: 1,
});
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 8,
            path: [(44 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
        }
        serializedPath: "m/44'/1815'/0'/0/0", 
        protocolMagic: 764824073
        networkId: 1
        address: "Ae2tdPwUPEZ7XH2vpa1gDzioNKAWEHWU49AREQg2pD9wr3fwXHPgKbyNwkZ"
    }
}
```

Display base address of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 0,
        path: "m/1852'/1815'/0'/0/0",
        stakingPath: "m/1852'/1815'/0'/2/0",
    },
    protocolMagic: 764824073,
    networkId: 1,
});
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 0,
			stakingPath: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0],
            path: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
        }
        serializedPath: "m/1852'/1815'/0'/0/0",
        serializedStakingPath: "m/1852'/1815'/0'/2/0",
        protocolMagic: 764824073
        networkId: 1
        address: "addr1q8myrnr7rdlgqk8fdkmqyrte3gk0r6u9cvcsg9ajnq9txl85cjmpmy927v055u4fg8gkddl00etcs4f3aahh9lpmenrs8ph4vr"
    }
}
```

Display pointer address of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 4,
        path: "m/1852'/1815'/0'/0/0",
        certificatePointer: {
            blockIndex: 1,
            txIndex: 2,
            certificateIndex: 3,
        },
    },
    protocolMagic: 764824073,
    networkId: 1,
});
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 4,
            path: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0],
	        certificatePointer: {
	            blockIndex: 1,
	            txIndex: 2,
	            certificateIndex: 3,
	        }
        }
        serializedPath: "m/1852'/1815'/0'/0/0",
        protocolMagic: 764824073
        networkId: 1
        address: "addr1g8myrnr7rdlgqk8fdkmqyrte3gk0r6u9cvcsg9ajnq9txlqpqgpsjycjt4"
    }
}
```

Display enterprise address of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 6,
        path: "m/1852'/1815'/0'/0/0",
    },
    protocolMagic: 764824073,
    networkId: 1,
});
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 6,
            path: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
        }
        serializedPath: "m/1852'/1815'/0'/0/0",
        protocolMagic: 764824073
        networkId: 1
        address: "addr1v8myrnr7rdlgqk8fdkmqyrte3gk0r6u9cvcsg9ajnq9txlqnkllma"
    }
}
```

Display reward address of first cardano account:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 14,
        path: "m/1852'/1815'/0'/2/0",
    },
    protocolMagic: 764824073,
    networkId: 1,
});
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 14,
            path: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]
        }
        serializedPath: "m/1852'/1815'/0'/2/0",
        protocolMagic: 764824073
        networkId: 1
        address: "stake1u86vfdsajz40x862w255r5txklhhu4ug25c77mmjlsaue3cwl9vcy"
    }
}
```

Return a bundle of cardano addresses without displaying them on device:

#### Request
```javascript
TrezorConnect.cardanoGetAddress({
    bundle: [
        // byron address, account 1, address 1
        {
            addressParameters: {
                addressType: 8,
                path: "m/44'/1815'/0'/0/0",
            },
            protocolMagic: 764824073,
            networkId: 1,
            showOnTrezor: false
        },
        // base address with staking key hash, account 1, address 1
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/0",
                stakingKeyHash: '1bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff',
            },
            protocolMagic: 764824073,
            networkId: 1,
            showOnTrezor: false
        },
        // byron address, account 2, address 3, testnet
        {
            addressParameters: {
                addressType: 8,
                path: "m/44'/1815'/1'/0/2",
            },
            protocolMagic: 42,
            networkId: 0,
            showOnTrezor: false
        },
    ]
});
```
#### Response
```javascript
{
    success: true,
    payload: [
        {
	        addressParameters: {
	            addressType: 8,
	            path: [(44 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
	        }
	        serializedPath: "m/44'/1815'/0'/0/0", 
	        protocolMagic: 764824073
	        networkId: 1
	        address: "Ae2tdPwUPEZ7XH2vpa1gDzioNKAWEHWU49AREQg2pD9wr3fwXHPgKbyNwkZ"
        },
        {
	        addressParameters: {
	            addressType: 0,
				stakingKeyHash: "1bc428e4720702ebd5dab4fb175324c192dc9bb76cc5da956e3c8dff",
	            path: [(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
	        }
	        serializedPath: "m/1852'/1815'/0'/0/0",
	        protocolMagic: 764824073
	        networkId: 1
	        address: "addr1q8myrnr7rdlgqk8fdkmqyrte3gk0r6u9cvcsg9ajnq9txlqmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hls2gwn9c"
        },
        {
	        addressParameters: {
	            addressType: 8,
	            path: [(44 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 1, 0, 2]
	        }
	        serializedPath: "m/44'/1815'/1'/0/2", 
	        protocolMagic: 42
	        networkId: 0
	        address: "2657WMsDfac69nixoiqNWHDSMA8NmUQL1sem7Goy2KeLuagp1UoQ8zd8f5mywgTub"
        },
    ]
}
```

Validate address using custom UI inside of your application:

#### Request
```javascript
import TrezorConnect, { UI } from 'trezor-connect';

TrezorConnect.on(UI.ADDRESS_VALIDATION, data => {
    console.log("Handle button request", data.address, data.serializedPath);
    // here you can display custom UI inside of your app
});

const result = await TrezorConnect.cardanoGetAddress({
    addressParameters: {
        addressType: 8,
        path: "m/44'/1815'/0'/0/0",
    },
    protocolMagic: 764824073,
    networkId: 0,
    address: "Ae2tdPwUPEZ7XH2vpa1gDzioNKAWEHWU49AREQg2pD9wr3fwXHPgKbyNwkZ",
});
// dont forget to hide your custom UI after you get the result!
```
#### Response
```javascript
{
    success: true,
    payload: {
        addressParameters: {
            addressType: 8,
            path: [(44 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]
        }
        serializedPath: "m/44'/1815'/0'/0/0", 
        protocolMagic: 764824073
        networkId: 1
        address: "Ae2tdPwUPEZ7XH2vpa1gDzioNKAWEHWU49AREQg2pD9wr3fwXHPgKbyNwkZ"
    }
}
```