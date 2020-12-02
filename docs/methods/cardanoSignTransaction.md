
## Cardano: Sign transaction
Asks device to sign given transaction. User is asked to confirm all transaction
details on device.

Stake pool opration transactions are explained in separate file.

ES6
```javascript
const result = await TrezorConnect.cardanoSignTransaction(params);
```

### Params

#### Sign a transaction
* `inputs` - *required* `Array<CardanoInput>` Array of transaction inputs, for type read below
* `outputs` - *required* `Array<CardanoOutput>` Array of transaction outputs, can be Byron or Shelley outputs, for type read below
* `fee` - *required* `string` Transaction fee in Transaction fee Lovelace, in decimal notation Lovelace, in decimal notation 
* `ttl` - *required* `string` How many blocks into the future can this transaction wait before it becomes invalid
* `protocolMagic` - *required* `number` must be 764824073 for Mainnet, 42 for Testnet
* `networkId` - *required* `number` must be 1 for Mainnet, 0 for Testnet
* `certificates` - *optional* `Array<CardanoCertificate>` Array of certificates included in this transaction, for type read below
* `withdrawals` - *optional* `Array<CardanoWithdrawal>` Array of withdrawals included in this transaction, for type read below
* `metadata` - *optional* `string` Metadata for the transaction, must be a CBOR encoded `map` type.

#### CardanoInput
* `path` - *required* `string | Array<number>` BIP44 derivation path for the address, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/0/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]`) formats
* `prev_hash` - *required* `string`  Hash in hexadecimal notation of the transaction where this input is an output
* `prev_index` - *required* `number` Index of this input in the transaction outputs this input uses.

#### CardanoOutput
* `amount` - *required* `number` The amount of ADA assigned to this output in this transaction
* `address` - *optional* `string` The address where this output is going, either this or `addressParameters` must be present, used for Byron outputs
* `addressParameters` - *optional* `CardanoAddressParameters` Shelley address parameters, read below, either this or `address` must be present, used for Shelley outputs, cannot be a Reward address

#### CardanoAddressParameters
* `addressType` - *required* `CardanoAddressType`/`number` - Type of the address to use, accepts both flow `CARDANO.ADDRESS_TYPE` object and typescript `CardanoAddressType` enum. Potential types are Base (0), Pointer (4), Enterprise (6), Byron (8) and Reward (14).
* `path` — *required* `string | Array<number>` BIP44 derivation path for the address, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/0/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 0, 0]`) formats
* `stakingPath` — *optional* `string | Array<number>` BIP44 derivation path for the staking part of the address, either this or `stakingKeyHash` are required for base address derivation, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/2/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]`) formats
* `stakingKeyHash` - *optional* `string` Staking part of the address as hex string, either this or `stakingPath` are required for base address derivation, device cannot verify ownership of the staking key.
* `certificatePointer` - *optional* `CardanoCertificatePointer` object. Must contain `number`s `blockIndex`, `txIndex` and `certificateIndex`. Required for pointer address derivation.

#### CardanoCertificate
* `type` - *required* `CardanoCertificateType` enum, currently supported are StakeRegistration (0), StakeDeregistration (1) and StakeDelegation (2)
* `path` - *required* `string | Array<number>` BIP44 derivation path for the staking address included in this certificate, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/2/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]`) formats, must be a staking address (4th index must be a `2`)
* `pool` - *optional* `string` Hash of pool ID in hexadecimal notation, required for certificates that represent a pool operation (currently StakeDelegation)

#### CardanoWithdrawal
* `path` - *required* `string | Array<number>` BIP44 derivation path for the reward address this withdrawal is for, minimum length `5`, accepts both string (ex. `m/1852'/1815'/0'/2/0`) and Array (ex. `[(1852 | 0x80000000) >>> 0, (1815 | 0x80000000) >>> 0, (0 | 0x80000000) >>> 0, 2, 0]`) formats, must be a reward address (4th index must be a `2`)
* `amount` - *required* `number` The amount of ADA withdrawn to this address in Lovelace


### Responses

#### Success case
```javascript
{
    success: true,
    payload: {
        hash: string, //blake2b hash of the transaction body, used to index this transaction in the blockchain
        serializedTx: string, //cbor encoded signed transaction in hexadecimal notation
    }
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

### Internal validation details

A single transaction can include one or more things to do, it can have zero or more payment outputs, zero or one change output, zero or more certificates attached and zero or more staking reward withdrawals.

Every transaction must inlcude at least one input.

Caller is responsible for ensuring inputs contain enough ADA to cover all payments and operational fees, device doesn't check this.


### Example
```javascript
TrezorConnect.cardanoSignTransaction({
    inputs: [
        {
            path: "m/44'/1815'/0'/0/1",
            prev_hash: "1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc",
            prev_index: 0,
        }
    ],
    outputs: [
        {
            address: "Ae2tdPwUPEZCanmBz5g2GEwFqKTKpNJcGYPKfDxoNeKZ8bRHr8366kseiK2",
            amount: "3003112",
        },
        {
            addressParameters: {
                addressType: 0,
                path: "m/1852'/1815'/0'/0/0",
                stakingPath: "m/1852'/1815'/0'/2/0",
            },
            amount: "7120787",
        }
    ],
    fee: "42",
    ttl: "10",
    certificates: [
        {
            type: 0,
            path: "m/1852'/1815'/0'/2/0",
        },
        {
            type: 1,
            path: "m/1852'/1815'/0'/2/0",
        },
        {
            type: 2,
            path: "m/1852'/1815'/0'/2/0",
            pool: "f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973",
        },
    ],
    withdrawals: [
        {
            path: "m/1852'/1815'/0'/2/0",
            amount: "1000",
        }
    ],
    metadata: "a200a11864a118c843aa00ff01a119012c590100aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    protocolMagic: 764824073,
    networkId: 1,
});
```

### Result
```javascript
{
    success: true,
    payload: {
        hash: "0xd8ad05ec1ba2fc81e27e3a92ee77ee8e84aea2bec9a0a511715cfa01d19d1e28",
        serializedTx: "0x83a700818258201af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc00018282582b82d818582183581c9e1c71de652ec8b85fec296f0685ca3988781c94a2e1a5d89d92f45fa0001a0d0c25611a002dd2e882583901f641cc7e1b7e8058e96db6020d798a2cf1eb85c3310417b2980ab37cf4c4b61d90aaf31f4a72a941d166b7ef7e57885531ef6f72fc3bccc71a006ca79302182a030a048382008200581cf4c4b61d90aaf31f4a72a941d166b7ef7e57885531ef6f72fc3bccc782018200581cf4c4b61d90aaf31f4a72a941d166b7ef7e57885531ef6f72fc3bccc783028200581cf4c4b61d90aaf31f4a72a941d166b7ef7e57885531ef6f72fc3bccc7581cf61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb497305a1581de1f4c4b61d90aaf31f4a72a941d166b7ef7e57885531ef6f72fc3bccc71903e8075820ea4c91860dd5ec5449f8f985d227946ff39086b17f10b5afb93d12ee87050b6aa20081825820e2d03cf7c065e1afb13ebdbcc8f543ccb15ccfa83c377937b02c77fbc90bb4b85840fce94bc5a042e8170fb03bf8b4666edb2f2e975024cc8cc69ee74b97bc2876e0ded3d247a0c0c52f35b04edff680abb2776f8211d673114231f860957df2d5060281845820bd169ebf0b22744a5001474027c443fc046557a7b643f0face03fded3b99a916584041b2b476d237e50f0d54fd3c2ec8802f3c7c1c3f61b6b0ecb24580faa2b04efdc7ebda4060639bef8a16905a49d90d0d1cc345e041505f2d9cdd2bf4fc37790658200aa9e642dcac112c2a40d9a295346e7514cfc9f954b9e6af7a0a1c7c790d963c41a0a200a11864a118c843aa00ff01a119012c590100aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
}
```