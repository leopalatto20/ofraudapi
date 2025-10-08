import { createHash, randomBytes } from 'crypto';

export const sha256 = (data: string) => {
    return createHash('sha256').update(data).digest('hex');
};

export const genSalt = (length = 16) => {
    return randomBytes(length).toString('hex');
};
