import { NETWORK_IDS, PROTOCOL_MAGICS } from '../../src/js/constants/cardano';
import {
    Enum_CardanoAddressType as CardanoAddressType,
    Enum_CardanoCertificateType as CardanoCertificateType,
    Enum_CardanoTxSigningMode as CardanoTxSigningMode,
} from '../../src/js/types/trezor/protobuf';

// vectors from https://github.com/trezor/trezor-firmware/tree/master/python/trezorlib/tests/device_tests/test_msg_cardano_sign_transaction.py

const SAMPLE_INPUTS = {
    byron_input: {
        path: "m/44'/1815'/0'/0/1",
        prev_hash: '1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc',
        prev_index: 0,
    },
    shelley_input: {
        path: "m/1852'/1815'/0'/0/0",
        prev_hash: '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7',
        prev_index: 0,
    },
    external_input: {
        path: undefined,
        prev_hash: '3b40265111d8bb3c3c608d95b3a0bf83461ace32d79336579a1939b3aad1c0b7',
        prev_index: 0,
    },
};

const SAMPLE_OUTPUTS = {
    simple_byron_output: {
        address: 'Ae2tdPwUPEZCanmBz5g2GEwFqKTKpNJcGYPKfDxoNeKZ8bRHr8366kseiK2',
        amount: '3003112',
    },
    byron_change_output: {
        addressParameters: {
            addressType: CardanoAddressType.BYRON,
            path: "m/44'/1815'/0'/0/1",
        },
        amount: '1000000',
    },
    simple_shelley_output: {
        address:
            'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
        amount: '1',
    },
    base_address_with_script_output: {
        address:
            'addr1z90z7zqwhya6mpk5q929ur897g3pp9kkgalpreny8y304r2dcrtx0sf3dluyu4erzr3xtmdnzvcyfzekkuteu2xagx0qeva0pr',
        amount: '7120787',
    },
    base_address_change_output: {
        addressParameters: {
            addressType: CardanoAddressType.BASE,
            path: "m/1852'/1815'/0'/0/0",
            stakingPath: "m/1852'/1815'/0'/2/0",
        },
        amount: '7120787',
    },
    base_address_change_output_numbers: {
        addressParameters: {
            addressType: CardanoAddressType.BASE,
            path: [0x80000000 + 1852, 0x80000000 + 1815, 0x80000000, 0, 0],
            stakingPath: [0x80000000 + 1852, 0x80000000 + 1815, 0x80000000, 2, 0],
        },
        amount: '7120787',
    },
    staking_key_hash_output: {
        addressParameters: {
            addressType: CardanoAddressType.BASE,
            path: "m/1852'/1815'/0'/0/0",
            stakingKeyHash: '32c728d3861e164cab28cb8f006448139c8f1740ffb8e7aa9e5232dc',
        },
        amount: '7120787',
    },
    pointer_address_output: {
        addressParameters: {
            addressType: CardanoAddressType.POINTER,
            path: "m/1852'/1815'/0'/0/0",
            certificatePointer: {
                blockIndex: 1,
                txIndex: 2,
                certificateIndex: 3,
            },
        },
        amount: '7120787',
    },
    enterprise_address_output: {
        addressParameters: {
            addressType: CardanoAddressType.ENTERPRISE,
            path: "m/1852'/1815'/0'/0/0",
        },
        amount: '7120787',
    },
    testnet_output: {
        address: '2657WMsDfac7BteXkJq5Jzdog4h47fPbkwUM49isuWbYAr2cFRHa3rURP236h9PBe',
        amount: '3003112',
    },
    shelley_testnet_output: {
        address: 'addr_test1vr9s8py7y68e3x66sscs0wkhlg5ssfrfs65084jrlrqcfqqtmut0e',
        amount: '1',
    },
    token_output: {
        address:
            'addr1q84sh2j72ux0l03fxndjnhctdg7hcppsaejafsa84vh7lwgmcs5wgus8qt4atk45lvt4xfxpjtwfhdmvchdf2m3u3hlsd5tq5r',
        amount: '2000000',
        tokenBundle: [
            {
                policyId: '95a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39',
                tokenAmounts: [
                    {
                        assetNameBytes: '74652474436f696e',
                        amount: '7878754',
                    },
                ],
            },
            {
                policyId: '96a292ffee938be03e9bae5657982a74e9014eb4960108c9e23a5b39',
                tokenAmounts: [
                    {
                        assetNameBytes: '74652474436f696e',
                        amount: '7878754',
                    },
                    {
                        assetNameBytes: '75652474436f696e',
                        amount: '1234',
                    },
                ],
            },
        ],
    },
};

const SAMPLE_CERTIFICATES = {
    stake_registration: {
        type: CardanoCertificateType.STAKE_REGISTRATION,
        path: "m/1852'/1815'/0'/2/0",
    },
    stake_deregistration: {
        type: CardanoCertificateType.STAKE_DEREGISTRATION,
        path: "m/1852'/1815'/0'/2/0",
    },
    stake_delegation: {
        type: CardanoCertificateType.STAKE_DELEGATION,
        path: "m/1852'/1815'/0'/2/0",
        pool: 'f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973',
    },
    stake_pool_registration: {
        type: CardanoCertificateType.STAKE_POOL_REGISTRATION,
        poolParameters: {
            poolId: 'f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973',
            vrfKeyHash: '198890ad6c92e80fbdab554dda02da9fb49d001bbd96181f3e07f7a6ab0d0640',
            pledge: '500000000',
            cost: '340000000',
            margin: {
                numerator: '1',
                denominator: '2',
            },
            rewardAccount: 'stake1uya87zwnmax0v6nnn8ptqkl6ydx4522kpsc3l3wmf3yswygwx45el',
            owners: [
                {
                    stakingKeyPath: "m/1852'/1815'/0'/2/0",
                    stakingKeyHash: undefined,
                },
                {
                    stakingKeyHash: '3a7f09d3df4cf66a7399c2b05bfa234d5a29560c311fc5db4c490711',
                },
            ],
            relays: [
                {
                    type: 0,
                    ipv4Address: '192.168.0.1',
                    ipv6Address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
                    port: 1234,
                },
                {
                    type: 0,
                    ipv6Address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
                    ipv4Address: null,
                    port: 1234,
                },
                {
                    type: 0,
                    ipv4Address: '192.168.0.1',
                    port: 1234,
                },
                {
                    type: 1,
                    hostName: 'www.test.test',
                    port: 1234,
                },
                {
                    type: 2,
                    hostName: 'www.test2.test',
                },
            ],
            metadata: {
                url: 'https://www.test.test',
                hash: '914c57c1f12bbf4a82b12d977d4f274674856a11ed4b9b95bd70f5d41c5064a6',
            },
        },
    },
    stake_pool_registration_no_metadata: {
        type: CardanoCertificateType.STAKE_POOL_REGISTRATION,
        poolParameters: {
            poolId: 'f61c42cbf7c8c53af3f520508212ad3e72f674f957fe23ff0acb4973',
            vrfKeyHash: '198890ad6c92e80fbdab554dda02da9fb49d001bbd96181f3e07f7a6ab0d0640',
            pledge: '500000000',
            cost: '340000000',
            margin: {
                numerator: '1',
                denominator: '2',
            },
            rewardAccount: 'stake1uya87zwnmax0v6nnn8ptqkl6ydx4522kpsc3l3wmf3yswygwx45el',
            owners: [
                {
                    stakingKeyPath: "m/1852'/1815'/0'/2/0",
                },
            ],
            relays: [],
            metadata: null,
        },
    },
};

const SAMPLE_WITHDRAWAL = {
    path: "m/1852'/1815'/0'/2/0",
    amount: '1000',
};

const FEE = '42';
const TTL = '10';
const VALIDITY_INTERVAL_START = '47';

export default {
    method: 'cardanoSignTransaction',
    setup: {
        mnemonic: 'mnemonic_all',
    },
    tests: [
        {
            description: 'signMainnetNoChange',
            params: {
                inputs: [SAMPLE_INPUTS.byron_input],
                outputs: [SAMPLE_OUTPUTS.simple_byron_output],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '73e09bdebf98a9e0f17f86a2d11e0f14f4f8dae77cdf26ff1678e821f20c8db6',
                witnesses: [
                    {
                        type: 0,
                        pubKey: '89053545a6c254b0d9b1464e48d2b5fcf91d4e25c128afb1fcfc61d0843338ea',
                        signature:
                            'da07ac5246e3f20ebd1276476a4ae34a019dd4b264ffc22eea3c28cb0f1a6bb1c7764adeecf56bcb0bc6196fd1dbe080f3a7ef5b49f56980fe5b2881a4fdfa00',
                        chainCode:
                            '26308151516f3b0e02bb1638142747863c520273ce9bd3e5cd91e1d46fe2a635',
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signMainnetChange',
            params: {
                inputs: [SAMPLE_INPUTS.byron_input],
                outputs: [SAMPLE_OUTPUTS.simple_byron_output, SAMPLE_OUTPUTS.byron_change_output],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '81b14b7e62972127eb33c0b1198de6430540ad3a98eec621a3194f2baac43a43',
                witnesses: [
                    {
                        type: 0,
                        pubKey: '89053545a6c254b0d9b1464e48d2b5fcf91d4e25c128afb1fcfc61d0843338ea',
                        signature:
                            'd909b16038c4fd772a177038242e6793be39c735430b03ee924ed18026bd28d06920b5846247945f1204276e4b759aa5ac05a4a73b49ce705ab0e5e54a3a170e',
                        chainCode:
                            '26308151516f3b0e02bb1638142747863c520273ce9bd3e5cd91e1d46fe2a635',
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signMainnetBaseAddress',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [
                    SAMPLE_OUTPUTS.simple_shelley_output,
                    SAMPLE_OUTPUTS.base_address_change_output,
                ],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '16fe72bb198be423677577e6326f1f648ec5fc11263b072006382d8125a6edda',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '6a78f07836dcf4a303448d2b16b217265a9226be3984a69a04dba5d04f4dbb2a47b5e1cbb345f474c0b9634a2f37b921ab26e6a65d5dfd015dacb4455fb8430a',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signMainnetBaseHashAddress',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [
                    SAMPLE_OUTPUTS.simple_shelley_output,
                    SAMPLE_OUTPUTS.staking_key_hash_output,
                ],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: 'd1610bb89bece22ed3158738bc1fbb31c6af0685053e2993361e3380f49afad9',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '622f22d03bc9651ddc5eb2f5dc709ac4240a64d2b78c70355dd62106543c407d56e8134c4df7884ba67c8a1b5c706fc021df5c4d0ff37385c30572e73c727d00',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signMainnetPointerAddress',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [
                    SAMPLE_OUTPUTS.simple_shelley_output,
                    SAMPLE_OUTPUTS.pointer_address_output,
                ],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '40535fa8f88515f1da008d3cdf544cf9dbf1675c3cb0adb13b74b9293f1b7096',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            'dbbf050cc13d0696b1884113613318a275e6f0f8c7cb3e7828c4f2f3c158b2622a5d65ea247f1eed758a0f6242a52060c319d6f37c8460f5d14be24456cd0b08',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signMainnetEnterpriseAddress',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [
                    SAMPLE_OUTPUTS.simple_shelley_output,
                    SAMPLE_OUTPUTS.enterprise_address_output,
                ],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: 'd3570557b197604109481a80aeb66cd2cfabc57f802ad593bacc12eb658e5d72',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            'c5996650c438c4493b2c8a94229621bb9b151b8d61d75fb868c305e917031e9a1654f35023f7dbf5d1839ab9d57b153c7f79c2666af51ecf363780397956e00a',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signStakeRegistration',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                certificates: [SAMPLE_CERTIFICATES.stake_registration],
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '1a3a295908afd8b2afc368071272d6964be6ee0af062bb765aea65ca454dc0c9',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            'a938b16bd81aea8d3aaf11e4d460dad1f36d34bf34ad066d0f5ce5d4137654145d998c3482aa823ff1acf021c6e2cd2774fff00361cbb9e72b98632307ee4000',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signStakeRegistrationNoOutputs',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [],
                fee: FEE,
                ttl: TTL,
                certificates: [SAMPLE_CERTIFICATES.stake_registration],
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '03535791d04fc1b4457fada025f1c1f7778b5c2d7fa580bbac8abd53b85d3255',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '47e6e902e81bbba5596cfabaa4f9a70f36b367e28ee81181771ccd32d38b19c1d8ae9b0afb2a79057b87f8de7862e8d2317d86246909aaa66e54445d47aa990b',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },

        {
            description: 'signStakeRegistrationAndDelegation',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                certificates: [
                    SAMPLE_CERTIFICATES.stake_registration,
                    SAMPLE_CERTIFICATES.stake_delegation,
                ],
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '439764b5f7e08839881536a3191faeaf111e75d9f00f83b102c5c1c6fa9fcaf9',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '5ebe8eff752f07e8448f55304fdf3665ac68162099dcacd81886b73affe67fb6df401f8a5fa60ddb6d5fb65b93235e6a234182a40c001e3cf7634f82afd5fe0a',
                        chainCode: null,
                    },
                    {
                        type: 1,
                        pubKey: 'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                        signature:
                            '0dbdf36f92bc5199526ffb8b83b33a9eeda0ed3e46fb4025a104346801afb9cf45fa1a5482e54c769f4102e67af46205457d7ae05a889fc342acb0cdc23ecd03',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
            legacyResults: [
                {
                    // witness are ordered differently
                    rules: ['<2.3.7'],
                    payload: {
                        hash: '439764b5f7e08839881536a3191faeaf111e75d9f00f83b102c5c1c6fa9fcaf9',
                        witnesses: [
                            {
                                type: 1,
                                pubKey:
                                    'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                                signature:
                                    '0dbdf36f92bc5199526ffb8b83b33a9eeda0ed3e46fb4025a104346801afb9cf45fa1a5482e54c769f4102e67af46205457d7ae05a889fc342acb0cdc23ecd03',
                                chainCode: null,
                            },
                            {
                                type: 1,
                                pubKey:
                                    '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                                signature:
                                    '5ebe8eff752f07e8448f55304fdf3665ac68162099dcacd81886b73affe67fb6df401f8a5fa60ddb6d5fb65b93235e6a234182a40c001e3cf7634f82afd5fe0a',
                                chainCode: null,
                            },
                        ],
                        auxiliaryDataSupplement: undefined,
                    },
                },
            ],
        },

        {
            description: 'signStakeDeregistration',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                certificates: [SAMPLE_CERTIFICATES.stake_deregistration],
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '3aca1784d151dc75bdbb80fae71bda3f4b26af3f5fd71bd5e9e9bbcdd2b64ad1',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            'e563a8012e16affd801564e8410ca7b2c96f76f8ecb878e35c098a823c40be7f59dc12cb44a9b678210d4e8f18ab215133eef7ca9ece94b4683d3db0fd37e105',
                        chainCode: null,
                    },
                    {
                        type: 1,
                        pubKey: 'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                        signature:
                            '84f321d313da67f80f7fab2e4f3996d3dbe3186659e6f98315e372dbe88c55d56f637ccc7534890c3601ddd31ba885dc86ba0074c230869f20099b7dd5eeaf00',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
            legacyResults: [
                {
                    // witness are ordered differently
                    rules: ['<2.3.7'],
                    payload: {
                        hash: '3aca1784d151dc75bdbb80fae71bda3f4b26af3f5fd71bd5e9e9bbcdd2b64ad1',
                        witnesses: [
                            {
                                type: 1,
                                pubKey:
                                    'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                                signature:
                                    '84f321d313da67f80f7fab2e4f3996d3dbe3186659e6f98315e372dbe88c55d56f637ccc7534890c3601ddd31ba885dc86ba0074c230869f20099b7dd5eeaf00',
                                chainCode: null,
                            },
                            {
                                type: 1,
                                pubKey:
                                    '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                                signature:
                                    'e563a8012e16affd801564e8410ca7b2c96f76f8ecb878e35c098a823c40be7f59dc12cb44a9b678210d4e8f18ab215133eef7ca9ece94b4683d3db0fd37e105',
                                chainCode: null,
                            },
                        ],
                        auxiliaryDataSupplement: undefined,
                    },
                },
            ],
        },

        {
            description: 'signStakeDeregistrationAndWithdrawal',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                certificates: [SAMPLE_CERTIFICATES.stake_deregistration],
                withdrawals: [SAMPLE_WITHDRAWAL],
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '22c67f12e6f6aa0f2f09fd27d472b19c7208ccd7c3af4b09604fd5d462c1de2b',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '7efa634e42fa844cad5f60bf005d645817cc674f30eaab0da398b99034850780b40ab5a1028da033330a0f82b01648ec92cff8ca85a072594efb298016f38d0d',
                        chainCode: null,
                    },
                    {
                        type: 1,
                        pubKey: 'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                        signature:
                            '0202826a8b9688cf978000e7d1591582c65b149bb9f55dc883ae1acf85432618ca32be8a06fef37e69df503a294e7093006f63ababf9fcea639390226934020a',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
            legacyResults: [
                {
                    // witness are ordered differently
                    rules: ['<2.3.7'],
                    payload: {
                        hash: '22c67f12e6f6aa0f2f09fd27d472b19c7208ccd7c3af4b09604fd5d462c1de2b',
                        witnesses: [
                            {
                                type: 1,
                                pubKey:
                                    'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                                signature:
                                    '0202826a8b9688cf978000e7d1591582c65b149bb9f55dc883ae1acf85432618ca32be8a06fef37e69df503a294e7093006f63ababf9fcea639390226934020a',
                                chainCode: null,
                            },
                            {
                                type: 1,
                                pubKey:
                                    '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                                signature:
                                    '7efa634e42fa844cad5f60bf005d645817cc674f30eaab0da398b99034850780b40ab5a1028da033330a0f82b01648ec92cff8ca85a072594efb298016f38d0d',
                                chainCode: null,
                            },
                        ],
                        auxiliaryDataSupplement: undefined,
                    },
                },
            ],
        },

        {
            description: 'signMetadata',
            setup: {
                firmware: [['2.0.0', '2.3.6']],
            },
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                metadata:
                    'a200a11864a118c843aa00ff01a119012c590100aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: false,
        },

        {
            description: 'signAuxiliaryData with blob instead of hash',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                auxiliaryData: {
                    blob:
                        'a200a11864a118c843aa00ff01a119012c590100aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                },
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: false,
        },

        {
            description: 'signAuxiliaryData',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                auxiliaryData: {
                    hash: 'ea4c91860dd5ec5449f8f985d227946ff39086b17f10b5afb93d12ee87050b6a',
                },
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '1875f1d59a53f1cb4c43949867d72bcfd857fa3b64feb88f41b78ddaa1a21cbf',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            'b2015772a91043aeb04b98111744a098afdade0db5e30206538d7f2814965a5800d45240137f4d0dc81845a71e67cda38beaf816a520d73c4decbf7cbf0f6d08',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
            legacyResults: [
                {
                    // older FW doesn't support auxiliary data hash or auxiliary data at all
                    rules: ['<2.4.2'],
                    payload: false,
                },
            ],
        },

        {
            description: 'signCatalystVotingRegistration',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                auxiliaryData: {
                    catalystRegistrationParameters: {
                        votingPublicKey:
                            '1af8fa0b754ff99253d983894e63a2b09cbb56c833ba18c3384210163f63dcfc',
                        stakingPath: "m/1852'/1815'/0'/2/0",
                        rewardAddressParameters: {
                            addressType: 0,
                            path: "m/1852'/1815'/0'/0/0",
                            stakingPath: "m/1852'/1815'/0'/2/0",
                        },
                        nonce: '22634813',
                    },
                },
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '839a587109358e0aa81b8fb3d5fa74665fac303425ec544a4db7f6ba4e882dff',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '187ecd899e01390272a8d8289088199b3453945fa076819b5b5df60c325c10315477cc801044dfb553e780a300d79627ef5c09e64c6f953cc33bbc59152c9002',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: {
                    type: 1,
                    auxiliaryDataHash:
                        'a943e9166f1bb6d767b175384d3bd7d23645170df36fc1861fbf344135d8e120',
                    catalystSignature:
                        '74f27d877bbb4a5fc4f7c56869905c11f70bad0af3de24b23afaa1d024e750930f434ecc4b73e5d1723c2cb8548e8bf6098ac876487b3a6ed0891cb76994d409',
                },
            },
            legacyResults: [
                {
                    // older FW doesn't support auxiliary data
                    rules: ['<2.3.7'],
                    payload: false,
                },
            ],
        },

        {
            description: 'signTestnet',
            params: {
                inputs: [SAMPLE_INPUTS.byron_input],
                outputs: [
                    SAMPLE_OUTPUTS.testnet_output,
                    SAMPLE_OUTPUTS.shelley_testnet_output,
                    SAMPLE_OUTPUTS.byron_change_output,
                ],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.testnet,
                networkId: NETWORK_IDS.testnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: '47cf79f20c6c62edb4162b3b232a57afc1bd0b57c7fd8389555276408a004776',
                witnesses: [
                    {
                        type: 0,
                        pubKey: '89053545a6c254b0d9b1464e48d2b5fcf91d4e25c128afb1fcfc61d0843338ea',
                        signature:
                            'cc11adf81cb3c3b75a438325f8577666f5cbb4d5d6b73fa6dbbcf5ab36897df34eecacdb54c3bc3ce7fc594ebb2c7aa4db4700f4290facad9b611a035af8710a',
                        chainCode:
                            '26308151516f3b0e02bb1638142747863c520273ce9bd3e5cd91e1d46fe2a635',
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },
        {
            description: 'signStakePoolRegistration',
            params: {
                inputs: [SAMPLE_INPUTS.external_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                certificates: [SAMPLE_CERTIFICATES.stake_pool_registration],
                signingMode: CardanoTxSigningMode.POOL_REGISTRATION_AS_OWNER,
            },
            result: {
                hash: 'e3b9a5657bf62609465a930c8359d774c73944973cfc5a104a0f0ed1e1e8db21',
                witnesses: [
                    {
                        type: 1,
                        pubKey: 'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                        signature:
                            '06305b52f76d2d2da6925c02036a9a28456976009f8c6432513f273110d09ea26db79c696cec322b010e5cbb7d90a6b473b157e65df846a1487062569a5f5a04',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },
        {
            description: 'signStakePoolRegistrationNoMetadata',
            params: {
                inputs: [SAMPLE_INPUTS.external_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                ttl: TTL,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                certificates: [SAMPLE_CERTIFICATES.stake_pool_registration_no_metadata],
                signingMode: CardanoTxSigningMode.POOL_REGISTRATION_AS_OWNER,
            },
            result: {
                hash: '504f9214142996e0b7e315103b25d88a4afa3d01dd5be22376921b52b01483c3',
                witnesses: [
                    {
                        type: 1,
                        pubKey: 'bc65be1b0b9d7531778a1317c2aa6de936963c3f9ac7d5ee9e9eda25e0c97c5e',
                        signature:
                            'aa2099208399fcc27c18d7ef0c7e873f9e22f0935b7e912cddd34b33b8cafd541a878dc01c042ce490e4c9bad3c62c2f59acaa009d336c9ff875c5f153d34900',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },
        {
            description: 'signMaryWithValidityIntervalStart',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.simple_shelley_output],
                fee: FEE,
                validityIntervalStart: VALIDITY_INTERVAL_START,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: 'ab331c5a1b098763e20cd85aecb65e2364ceb4b35db56e1fb3c36c8d508c9cec',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '476b84a2d93c0b1f3f9cc29248ad1e7c11ccd7e2dd69b33e753cb12f52fe57630a1dcc75284a2d863fbbe47df29c0662b62f0498519b77e797b115095095f60f',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },
        {
            description: 'signMaryTokenSending',
            params: {
                inputs: [SAMPLE_INPUTS.shelley_input],
                outputs: [SAMPLE_OUTPUTS.token_output],
                fee: FEE,
                protocolMagic: PROTOCOL_MAGICS.mainnet,
                networkId: NETWORK_IDS.mainnet,
                signingMode: CardanoTxSigningMode.ORDINARY_TRANSACTION,
            },
            result: {
                hash: 'b6cbcb21d6622b81c37a721e37a704524fa4dc10a0b4afc2288c676e8a6ac288',
                witnesses: [
                    {
                        type: 1,
                        pubKey: '5d010cf16fdeff40955633d6c565f3844a288a24967cf6b76acbeb271b4f13c1',
                        signature:
                            '613cf030d3edd562ae1d003e615baa03e41f96f4a470cf854d9588c8da3bcbe09228c064e42eaf101fc4c82fcae1d93cedf160e5465d4f1fd47dd6dacc1cf403',
                        chainCode: null,
                    },
                ],
                auxiliaryDataSupplement: undefined,
            },
        },
    ],
};
