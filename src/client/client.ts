import { ProjPointType } from '@noble/curves/abstract/weierstrass';
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils';
import { bytesToNumber } from '../util/utils';
import { BlindSignature, Proof, SerializedBlindedMessage, SerializedProof } from '../types/common';
import { hashToCurve, pointFromHex } from '../common/common';
import { BlindedMessage } from '../types/client';

export function createRandomBlindedMessage(): BlindedMessage {
	return blindMessage(randomBytes(32));
}

export function blindMessage(secret: Uint8Array, r?: bigint): BlindedMessage {
	const Y = hashToCurve(secret);
	if (!r) {
		r = bytesToNumber(secp256k1.utils.randomPrivateKey());
	}
	const rG = secp256k1.ProjectivePoint.BASE.multiply(r);
	const B_ = Y.add(rG);
	return { B_, r, secret };
}

export function unblindSignature(
	C_: ProjPointType<bigint>,
	r: bigint,
	A: ProjPointType<bigint>
): ProjPointType<bigint> {
	const C = C_.subtract(A.multiply(r));
	return C;
}

export function constructProofFromPromise(
	promise: BlindSignature,
	r: bigint,
	secret: Uint8Array,
	key: ProjPointType<bigint>
): Proof {
	const A = key;
	const C = unblindSignature(promise.C_, r, A);
	const proof = {
		id: promise.id,
		amount: promise.amount,
		secret,
		C
	};
	return proof;
}

export const serializeProof = (proof: Proof): SerializedProof => {
	return {
		amount: proof.amount,
		C: proof.C.toHex(true),
		id: proof.id,
		secret: bytesToHex(proof.secret)
	};
};

export const deserializeProof = (proof: SerializedProof): Proof => {
	return {
		amount: proof.amount,
		C: pointFromHex(proof.C),
		id: proof.id,
		secret: hexToBytes(proof.secret)
	};
};
export const serializeBlindedMessage = (
	bm: BlindedMessage,
	amount: number
): SerializedBlindedMessage => {
	return {
		B_: bm.B_.toHex(true),
		amount: amount
	};
};
