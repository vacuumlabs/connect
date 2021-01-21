/* @flow */
import { validateParams } from '../helpers/paramsValidator';

import type { CardanoTokenGroupType, CardanoTokenAmountType } from '../../../types/trezor/protobuf';
import type { CardanoTokenGroup, CardanoTokenAmount } from '../../../types/networks/cardano';

export const validateTokenBundle = (tokenBundle: CardanoTokenGroup[]) => {
    console.log(tokenBundle)
    tokenBundle.forEach((tokenGroup) => {
        validateParams(tokenGroup, [
            { name: 'policyId', type: 'string', obligatory: true },
            { name: 'tokenAmounts', type: 'array', obligatory: true },
        ]);

        validateTokenAmounts(tokenGroup.tokenAmounts);
    });
};

const validateTokenAmounts = (tokenAmounts: CardanoTokenAmount[]) => {
    tokenAmounts.forEach((tokenAmount) => {
        validateParams(tokenAmount, [
            { name: 'rawAssetName', type: 'string', obligatory: true },
            { name: 'amount', type: 'amount', obligatory: true },
        ]);
    });
}

export const tokenBundleToProto = (tokenBundle: CardanoTokenGroup[]): CardanoTokenGroupType[] => {
    return tokenBundle.map((tokenGroup) => {
        return {
            policy_id: tokenGroup.policyId,
            token_amounts: tokenAmountsToProto(tokenGroup.tokenAmounts)
        }
    })
};

const tokenAmountsToProto = (tokenAmounts: CardanoTokenAmount[]): CardanoTokenAmountType[] => {
    return tokenAmounts.map((tokenAmount) => {
        return {
            raw_asset_name: tokenAmount.rawAssetName,
            amount: tokenAmount.amount
        }
    })
};
