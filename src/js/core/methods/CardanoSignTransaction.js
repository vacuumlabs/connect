/* @flow */
import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { getMiscNetwork } from '../../data/CoinInfo';
import { validatePath } from '../../utils/pathUtils';
import { transformAuxiliaryData } from './helpers/cardanoAuxiliaryData';
import { transformCertificate } from './helpers/cardanoCertificate';
import type { CertificateWithPoolOwnersAndRelays } from './helpers/cardanoCertificate';
import { transformOutput } from './helpers/cardanoOutputs';
import type { OutputWithTokens } from './helpers/cardanoOutputs';
import { legacySerializedTxToResult, toLegacyParams } from './helpers/cardanoSignTxLegacy';
import { ERRORS } from '../../constants';
import {
    Enum_CardanoCertificateType as CardanoCertificateType,
    Enum_CardanoTxAuxiliaryDataSupplementType as CardanoTxAuxiliaryDataSupplementType,
    Enum_CardanoTxWitnessType as CardanoTxWitnessType,
} from '../../types/trezor/protobuf';
import type {
    CardanoTxInput,
    CardanoTxWithdrawal,
    CardanoTxAuxiliaryData,
    CardanoTxSigningMode,
} from '../../types/trezor/protobuf';
import type { CoreMessage } from '../../types';
import type {
    CardanoAuxiliaryDataSupplement,
    CardanoSignedTxData,
    CardanoSignedTxWitness,
} from '../../types/networks/cardano';

// todo: remove when listed firmwares become mandatory for cardanoSignTransaction
const CardanoSignTransactionFeatures = Object.freeze({
    SignStakePoolRegistrationAsOwner: ['0', '2.3.5'],
    ValidityIntervalStart: ['0', '2.3.5'],
    MultiassetOutputs: ['0', '2.3.5'],
    AuxiliaryData: ['0', '2.3.7'],
    TransactionStreaming: ['0', '2.4.2'],
    AuxiliaryDataHash: ['0', '2.4.2'],
});

type Path = number[];

type InputWithPath = {
    input: CardanoTxInput,
    path?: Path,
};

export type CardanoSignTransactionParams = {
    signingMode: CardanoTxSigningMode,
    inputsWithPath: InputWithPath[],
    outputsWithTokens: OutputWithTokens[],
    fee: number,
    ttl: number,
    certificatesWithPoolOwnersAndRelays: CertificateWithPoolOwnersAndRelays[],
    withdrawals: CardanoTxWithdrawal[],
    auxiliaryData?: CardanoTxAuxiliaryData,
    validityIntervalStart: number,
    protocolMagic: number,
    networkId: number,
    witnessPaths: Path[],
};

export default class CardanoSignTransaction extends AbstractMethod {
    params: CardanoSignTransactionParams;

    constructor(message: CoreMessage) {
        super(message);
        this.requiredPermissions = ['read', 'write'];
        this.firmwareRange = getFirmwareRange(
            this.name,
            getMiscNetwork('Cardano'),
            this.firmwareRange,
        );
        this.info = 'Sign Cardano transaction';

        const { payload } = message;

        if (payload.metadata) {
            throw ERRORS.TypedError(
                'Method_InvalidParameter',
                'Metadata field has been replaced by auxiliaryData.',
            );
        }

        if (payload.auxiliaryData && payload.auxiliaryData.blob) {
            throw ERRORS.TypedError(
                'Method_InvalidParameter',
                'Auxiliary data can now only be sent as a hash.',
            );
        }

        // validate incoming parameters
        validateParams(payload, [
            { name: 'signingMode', type: 'number', obligatory: true },
            { name: 'inputs', type: 'array', obligatory: true },
            { name: 'outputs', type: 'array', obligatory: true, allowEmpty: true },
            { name: 'fee', type: 'amount', obligatory: true },
            { name: 'ttl', type: 'amount' },
            { name: 'certificates', type: 'array', allowEmpty: true },
            { name: 'withdrawals', type: 'array', allowEmpty: true },
            { name: 'validityIntervalStart', type: 'amount' },
            { name: 'protocolMagic', type: 'number', obligatory: true },
            { name: 'networkId', type: 'number', obligatory: true },
        ]);

        const inputsWithPath: InputWithPath[] = payload.inputs.map(input => {
            validateParams(input, [
                { name: 'prev_hash', type: 'string', obligatory: true },
                { name: 'prev_index', type: 'number', obligatory: true },
            ]);
            return {
                input: {
                    prev_hash: input.prev_hash,
                    prev_index: input.prev_index,
                    type: input.type,
                },
                path: input.path ? validatePath(input.path, 5) : undefined,
            };
        });

        const outputsWithTokens = payload.outputs.map(output => transformOutput(output));

        let certificatesWithPoolOwnersAndRelays: CertificateWithPoolOwnersAndRelays[] = [];
        if (payload.certificates) {
            certificatesWithPoolOwnersAndRelays = payload.certificates.map(transformCertificate);
        }

        let withdrawals: CardanoTxWithdrawal[] = [];
        if (payload.withdrawals) {
            withdrawals = payload.withdrawals.map(withdrawal => {
                validateParams(withdrawal, [
                    { name: 'path', obligatory: true },
                    { name: 'amount', type: 'amount', obligatory: true },
                ]);
                return {
                    path: validatePath(withdrawal.path, 5),
                    amount: withdrawal.amount,
                };
            });
        }

        let auxiliaryData;
        if (payload.auxiliaryData) {
            auxiliaryData = transformAuxiliaryData(payload.auxiliaryData);
        }

        this.params = {
            signingMode: payload.signingMode,
            inputsWithPath,
            outputsWithTokens,
            fee: payload.fee,
            ttl: payload.ttl,
            certificatesWithPoolOwnersAndRelays,
            withdrawals,
            auxiliaryData,
            validityIntervalStart: payload.validityIntervalStart,
            protocolMagic: payload.protocolMagic,
            networkId: payload.networkId,
            witnessPaths: this._gatherWitnessPaths(
                inputsWithPath,
                certificatesWithPoolOwnersAndRelays,
                withdrawals,
            ),
        };
    }

    _gatherWitnessPaths(
        inputsWithPath: InputWithPath[],
        certificatesWithPoolOwnersAndRelays: CertificateWithPoolOwnersAndRelays[],
        withdrawals: CardanoTxWithdrawal[],
    ): Path[] {
        const witnessPaths = new Map<string, Path>();
        function _insert(path: Path) {
            const pathKey = JSON.stringify(path);
            witnessPaths.set(pathKey, path);
        }

        inputsWithPath.forEach(({ path }) => {
            if (path) _insert(path);
        });

        certificatesWithPoolOwnersAndRelays.forEach(({ certificate, poolOwners }) => {
            if (
                certificate.path &&
                (certificate.type === CardanoCertificateType.STAKE_DELEGATION ||
                    certificate.type === CardanoCertificateType.STAKE_DEREGISTRATION)
            ) {
                _insert(certificate.path);
            }
            poolOwners.forEach(poolOwner => {
                if (poolOwner.staking_key_path) {
                    _insert(poolOwner.staking_key_path);
                }
            });
        });

        withdrawals.forEach(({ path }) => _insert(path));

        return Array.from(witnessPaths.values());
    }

    _isFeatureSupported(feature: $Keys<typeof CardanoSignTransactionFeatures>) {
        return this.device.atLeast(CardanoSignTransactionFeatures[feature]);
    }

    _ensureFeatureIsSupported(feature: $Keys<typeof CardanoSignTransactionFeatures>) {
        if (!this._isFeatureSupported(feature)) {
            throw ERRORS.TypedError(
                'Method_InvalidParameter',
                `Feature ${feature} not supported by device firmware`,
            );
        }
    }

    _ensureFirmwareSupportsParams() {
        const { params } = this;

        params.certificatesWithPoolOwnersAndRelays.forEach(({ certificate }) => {
            if (certificate.type === CardanoCertificateType.STAKE_POOL_REGISTRATION) {
                this._ensureFeatureIsSupported('SignStakePoolRegistrationAsOwner');
            }
        });

        if (params.validityIntervalStart != null) {
            this._ensureFeatureIsSupported('ValidityIntervalStart');
        }

        params.outputsWithTokens.forEach(output => {
            if (output.tokenBundle && output.tokenBundle.length > 0) {
                this._ensureFeatureIsSupported('MultiassetOutputs');
            }
        });

        if (params.auxiliaryData) {
            this._ensureFeatureIsSupported('AuxiliaryData');
        }

        if (params.auxiliaryData && params.auxiliaryData.hash) {
            this._ensureFeatureIsSupported('AuxiliaryDataHash');
        }
    }

    async _sign_tx(): Promise<CardanoSignedTxData> {
        const typedCall = this.device.getCommands().typedCall.bind(this.device.getCommands());

        const hasAuxiliaryData = !!this.params.auxiliaryData;

        const signTxInitMessage = {
            signing_mode: this.params.signingMode,
            protocol_magic: this.params.protocolMagic,
            network_id: this.params.networkId,
            inputs_count: this.params.inputsWithPath.length,
            outputs_count: this.params.outputsWithTokens.length,
            fee: this.params.fee,
            ttl: this.params.ttl,
            certificates_count: this.params.certificatesWithPoolOwnersAndRelays.length,
            withdrawals_count: this.params.withdrawals.length,
            has_auxiliary_data: hasAuxiliaryData,
            validity_interval_start: this.params.validityIntervalStart,
            witnesses_count: this.params.witnessPaths.length,
        };

        // init
        await typedCall('CardanoSignTxInit', 'CardanoTxItemAck', signTxInitMessage);
        // inputs
        // eslint-disable-next-line no-restricted-syntax
        for (const { input } of this.params.inputsWithPath) {
            await typedCall('CardanoTxInput', 'CardanoTxItemAck', input);
        }
        // outputs and tokens
        // eslint-disable-next-line no-restricted-syntax
        for (const { output, tokenBundle } of this.params.outputsWithTokens) {
            await typedCall('CardanoTxOutput', 'CardanoTxItemAck', output);
            if (tokenBundle) {
                // eslint-disable-next-line no-restricted-syntax
                for (const assetGroup of tokenBundle) {
                    await typedCall('CardanoAssetGroup', 'CardanoTxItemAck', {
                        policy_id: assetGroup.policyId,
                        tokens_count: assetGroup.tokens.length,
                    });
                    // eslint-disable-next-line no-restricted-syntax
                    for (const token of assetGroup.tokens) {
                        await typedCall('CardanoToken', 'CardanoTxItemAck', token);
                    }
                }
            }
        }
        // certificates, owners and relays
        // eslint-disable-next-line no-restricted-syntax
        for (const { certificate, poolOwners, poolRelays } of this.params
            .certificatesWithPoolOwnersAndRelays) {
            await typedCall('CardanoTxCertificate', 'CardanoTxItemAck', certificate);
            // eslint-disable-next-line no-restricted-syntax
            for (const poolOwner of poolOwners) {
                await typedCall('CardanoPoolOwner', 'CardanoTxItemAck', poolOwner);
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const poolRelay of poolRelays) {
                await typedCall('CardanoPoolRelayParameters', 'CardanoTxItemAck', poolRelay);
            }
        }
        // withdrawals
        // eslint-disable-next-line no-restricted-syntax
        for (const withdrawal of this.params.withdrawals) {
            await typedCall('CardanoTxWithdrawal', 'CardanoTxItemAck', withdrawal);
        }
        // auxiliary data
        let auxiliaryDataSupplement: CardanoAuxiliaryDataSupplement;
        if (hasAuxiliaryData) {
            const { type, message } = await typedCall(
                'CardanoTxAuxiliaryData',
                'CardanoTxAuxiliaryDataSupplement|CardanoTxItemAck',
                this.params.auxiliaryData,
            );
            if (type === 'CardanoTxAuxiliaryDataSupplement') {
                auxiliaryDataSupplement = {
                    type: CardanoTxAuxiliaryDataSupplementType[message.type],
                    auxiliaryDataHash: message.auxiliary_data_hash,
                    catalystSignature: message.catalyst_signature,
                };
            }
        }
        // witnesses
        const witnesses: CardanoSignedTxWitness[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const path of this.params.witnessPaths) {
            const { message } = await typedCall(
                'CardanoTxWitnessRequest',
                'CardanoTxWitnessResponse',
                path,
            );
            witnesses.push({
                type: CardanoTxWitnessType[message.type],
                pubKey: message.pub_key,
                signature: message.signature,
                chainCode: message.chain_code,
            });
        }
        // tx hash
        const { message: txBodyHashMessage } = await typedCall(
            'CardanoTxHostAck',
            'CardanoTxBodyHash',
        );
        // finish
        await typedCall('CardanoTxHostAck', 'CardanoSignTxFinished');

        return { hash: txBodyHashMessage.tx_hash, witnesses, auxiliaryDataSupplement };
    }

    async _sign_tx_legacy(): Promise<CardanoSignedTxData> {
        const typedCall = this.device.getCommands().typedCall.bind(this.device.getCommands());

        const legacyParams = toLegacyParams(this.params);

        let serializedTx = '';

        let { type, message } = await typedCall(
            'CardanoSignTx',
            'CardanoSignedTx|CardanoSignedTxChunk',
            legacyParams,
        );
        while (type === 'CardanoSignedTxChunk') {
            serializedTx += message.signed_tx_chunk;
            ({ type, message } = await typedCall(
                'CardanoSignedTxChunkAck',
                'CardanoSignedTx|CardanoSignedTxChunk',
            ));
        }

        // this is required for backwards compatibility for FW <= 2.3.6 when the tx was not sent in chunks yet
        if (message.serialized_tx) {
            serializedTx += message.serialized_tx;
        }

        return legacySerializedTxToResult(message.tx_hash, serializedTx);
    }

    run(): Promise<CardanoSignedTxData> {
        this._ensureFirmwareSupportsParams();

        if (!this._isFeatureSupported('TransactionStreaming')) {
            return this._sign_tx_legacy();
        }

        return this._sign_tx();
    }
}
