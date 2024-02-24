import { ProjPointType } from '@noble/curves/abstract/weierstrass';

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type MintKeys = { [k: string]: Uint8Array };

export type SerializedMintKeys = {
	[k: string]: string;
};

export type Keyset = {
	id: string;
	unit: string;
	active: boolean;
};

export type BlindSignature = {
	C_: ProjPointType<bigint>;
	amount: number;
	id: string;
};

export type SerializedBlindSignature = {
	C_: string;
	amount: number;
	id: string;
};

export type Proof = {
	C: ProjPointType<bigint>;
	secret: Uint8Array;
	amount: number;
	id: string;
	witness?: Witness;
};

export type SerializedProof = {
	C: string;
	secret: string;
	amount: number;
	id: string;
};

export type SerializedBlindedMessage = {
	B_: string;
	amount: number;
	witness?: Witness;
};

export type Secret = [WellKnownSecret, SecretData];

export type WellKnownSecret = 'P2PK';

export type SecretData = {
	nonce: string;
	data: string;
	tags?: Array<Array<string>>;
};

export type Witness = {
	signatures: Array<string>;
};

export type Tags = {
	[k: string]: string;
};

export type SigFlag = 'SIG_INPUTS' | 'SIG_ALL';
