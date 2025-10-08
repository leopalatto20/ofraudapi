import * as bcrypt from 'bcrypt';

export const createHash = async (data: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(data, saltRounds);
};

export const checkHash = async (
    passwordHash: string,
    password: string
): Promise<boolean> => {
    return await bcrypt.compare(password, passwordHash);
};
