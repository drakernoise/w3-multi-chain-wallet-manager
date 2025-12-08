
const key = 'cWckYC03OmxvcX0pIWdvYSZxYmF9O2B7enIoaXwjYyhpMgVwM3RleGA4PjR2LS8hZ2YwdXcwZX1mMHcvdn9peQ==';
const cid = 'sLr5NfSwc5Lez/0sIHP4XA==';

console.log("Original Key:", key);
console.log("CID:", cid);

// Try Base64 Decode
const buff = Buffer.from(key, 'base64');
console.log("Decoded Buffer Hex:", buff.toString('hex'));
console.log("Decoded Buffer String (utf8):", buff.toString('utf8'));
console.log("Decoded Buffer String (latin1):", buff.toString('latin1'));

// Check lengths
console.log("Raw Length:", key.length);
console.log("Decoded Length:", buff.length);

// Try XOR with CID?
const cidBuff = Buffer.from(cid, 'base64');
console.log("CID Hex:", cidBuff.toString('hex'));

if (buff.length === cidBuff.length) {
    const xor = Buffer.alloc(buff.length);
    for (let i = 0; i < buff.length; i++) {
        xor[i] = buff[i] ^ cidBuff[i];
    }
    console.log("XOR (Key ^ CID):", xor.toString('utf8'));
}

// Try simple rot47 or similar?
function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}
console.log("Rot13:", rot13(key));
