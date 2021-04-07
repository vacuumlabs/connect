/* @flow */
import { addressParametersToProto, validateAddressParameters } from './cardanoAddressParameters';
import { validateParams } from './paramsValidator';
import { validatePath } from '../../../utils/pathUtils';

import type {
    CardanoTxAuxiliaryDataType,
    CardanoTxMetadataType,
    CardanoCatalystRegistrationParametersType,
} from '../../../types/trezor/protobuf';
import type {
    CardanoAuxiliaryData,
    CardanoMetadata,
    CardanoCatalystRegistrationParameters,
} from '../../../types/networks/cardano';

const transformCatalystRegistrationParameters = (
    catalystRegistrationParameters: CardanoCatalystRegistrationParameters,
): CardanoCatalystRegistrationParametersType => {
    validateParams(catalystRegistrationParameters, [
        { name: 'votingPublicKey', type: 'string', obligatory: true },
        { name: 'stakingPath', obligatory: true },
        { name: 'nonce', type: 'number', obligatory: true },
    ]);
    validateAddressParameters(catalystRegistrationParameters.rewardAddressParameters);

    return {
        voting_public_key: catalystRegistrationParameters.votingPublicKey,
        staking_path: validatePath(catalystRegistrationParameters.stakingPath, 3),
        reward_address_parameters: addressParametersToProto(
            catalystRegistrationParameters.rewardAddressParameters,
        ),
        nonce: catalystRegistrationParameters.nonce,
    };
};

const transformMetadata = (metadata: CardanoMetadata): CardanoTxMetadataType => {
    validateParams(metadata, [{ name: 'type', type: 'number', obligatory: true }]);

    let catalystRegistrationParameters;
    if (metadata.catalystRegistrationParameters) {
        catalystRegistrationParameters = transformCatalystRegistrationParameters(
            metadata.catalystRegistrationParameters,
        );
    }

    return {
        type: metadata.type,
        catalyst_registration_parameters: catalystRegistrationParameters,
    };
};

export const transformAuxiliaryData = (
    auxiliaryData: CardanoAuxiliaryData,
): CardanoTxAuxiliaryDataType => {
    validateParams(auxiliaryData, [
        {
            name: 'type',
            type: 'number',
            obligatory: true,
        },
        {
            name: 'blob',
            type: 'string',
        },
    ]);

    let metadata;
    if (auxiliaryData.metadata) {
        metadata = transformMetadata(auxiliaryData.metadata);
    }

    return {
        type: auxiliaryData.type,
        blob: auxiliaryData.blob,
        metadata,
    };
};
