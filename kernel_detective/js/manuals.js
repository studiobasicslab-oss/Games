/**
 * Kernel Detective: Cyber Forensics - Technical Reference Manuals & RFC Archive
 * Authentic in-game documentation teaching genuine computing concepts.
 */

export const MANUALS = {
    "ascii_binary": {
        title: "STD-001: ASCII Encoding & Binary Notation",
        category: "Encoding Standards",
        badge: "STD-001",
        content: `
# STD-001: 7-Bit / 8-Bit ASCII Encoding Specification

### 1. Overview
In digital teleprinters and punch tape mechanisms, each character is represented as an 8-bit byte. 
The standard US-ASCII character set maps decimal values 0–127 (hex 0x00–0x7F) to alphanumeric characters.

### 2. Binary to ASCII Translation Table
- \`0x41\` = \`01000001\` = **A**
- \`0x42\` = \`01000010\` = **B**
- \`0x43\` = \`01000011\` = **C**
- \`0x44\` = \`01000100\` = **D**
- \`0x45\` = \`01000101\` = **E**
- \`0x46\` = \`01000110\` = **F**
- \`0x47\` = \`01000111\` = **G**
- \`0x48\` = \`01001000\` = **H**
- \`0x49\` = \`01001001\` = **I**
- \`0x4A\` = \`01001010\` = **J**
- \`0x4B\` = \`01001011\` = **K**
- \`0x4C\` = \`01001100\` = **L**
- \`0x4D\` = \`01001101\` = **M**
- \`0x4E\` = \`01001110\` = **N**
- \`0x4F\` = \`01001111\` = **O**
- \`0x50\` = \`01010000\` = **P**
- \`0x51\` = \`01010001\` = **Q**
- \`0x52\` = \`01010010\` = **R**
- \`0x53\` = \`01010011\` = **S**
- \`0x54\` = \`01010100\` = **T**
- \`0x55\` = \`01010101\` = **U**
- \`0x56\` = \`01010110\` = **V**
- \`0x57\` = \`01010111\` = **W**
- \`0x58\` = \`01011000\` = **X**
- \`0x59\` = \`01011001\` = **Y**
- \`0x5A\` = \`01011010\` = **Z**
- \`0x20\` = \`00100000\` = **[SPACE]**
- \`0x30\`-\`0x39\` = \`00110000\`-\`00111001\` = **'0' through '9'**

### 3. Reading Punched Paper Tape
- Tape channel 8 is the Most Significant Bit (MSB, 128s place).
- A smaller central sprocket hole functions as the clock sync track (not a data bit).
- Hole present = Binary **1** | Solid paper = Binary **0**.
        `
    },
    "boolean_logic": {
        title: "TTL-7400: Standard Logic Gates & Truth Tables",
        category: "Digital Electronics",
        badge: "TTL-7400",
        content: `
# TTL Logic Gates Handbook & Truth Tables

### 1. Fundamental Gate Operations
- **AND Gate (\`A & B\` / \`A ∧ B\`):** Outputs 1 only if BOTH inputs are 1.
  - \`0 & 0 = 0\`, \`0 & 1 = 0\`, \`1 & 0 = 0\`, \`1 & 1 = 1\`
- **OR Gate (\`A | B\` / \`A ∨ B\`):** Outputs 1 if AT LEAST ONE input is 1.
  - \`0 | 0 = 0\`, \`0 | 1 = 1\`, \`1 | 0 = 1\`, \`1 | 1 = 1\`
- **NOT Gate (\`~A\` / \`¬A\`):** Inverts the input signal.
  - \`~0 = 1\`, \`~1 = 0\`
- **XOR Gate (\`A ^ B\` / \`A ⊕ B\`):** Outputs 1 if inputs are DIFFERENT (exclusive OR).
  - \`0 ^ 0 = 0\`, \`0 ^ 1 = 1\`, \`1 ^ 0 = 1\`, \`1 ^ 1 = 0\`
- **NAND Gate (\`~(A & B)\`):** Inverted AND gate. Universal gate.
- **NOR Gate (\`~(A | B)\`):** Inverted OR gate. Universal gate.

### 2. Boolean Reduction Rules
- De Morgan's Law: \`~(A & B) = ~A | ~B\` and \`~(A | B) = ~A & ~B\`
- XOR Identity: \`A ^ A = 0\`, \`A ^ 0 = A\`
        `
    },
    "hamming_ecc": {
        title: "ECC-74: Hamming(7,4) Error-Correction Specification",
        category: "Information Theory",
        badge: "ECC-74",
        content: `
# Hamming(7,4) Single Error Correction (SEC) Standard

### 1. Structure
A 7-bit codeword transmits 4 data bits ($d_1, d_2, d_3, d_4$) protected by 3 parity bits ($p_1, p_2, p_3$).
Bit positions 1, 2, 4 are parity bits (powers of 2); bit positions 3, 5, 6, 7 are data bits:

| Bit Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Role | $p_1$ | $p_2$ | $d_1$ | $p_3$ | $d_2$ | $d_3$ | $d_4$ |

### 2. Parity Check Equations (Even Parity)
- $s_1 = b_1 \oplus b_3 \oplus b_5 \oplus b_7$
- $s_2 = b_2 \oplus b_3 \oplus b_6 \oplus b_7$
- $s_3 = b_4 \oplus b_5 \oplus b_6 \oplus b_7$

### 3. Syndrome Decoding
Calculate Syndrome Vector $S = (s_3, s_2, s_1)$ in binary:
- If $S = 000_2$ (0 decimal): No error detected.
- If $S = k$ (where $k > 0$): Bit at position $k$ is corrupted! Invert bit $k$ to repair the payload.
        `
    },
    "fsk_bell103": {
        title: "BELL-103: Frequency Shift Keying (FSK) Standard",
        category: "Telecommunications",
        badge: "BELL-103",
        content: `
# Bell 103 / V.21 Acoustic Demodulation

### 1. Frequency Allocations
Bell 103 transmits full-duplex 300-baud data using continuous audio tones:
- **Originate Mode:**
  - Mark (Binary 1): **1270 Hz**
  - Space (Binary 0): **1070 Hz**
- **Answer Mode:**
  - Mark (Binary 1): **2225 Hz**
  - Space (Binary 0): **2025 Hz**

### 2. Baud Rate & Symbol Timing
At 300 baud, each bit duration is $T = 1 / 300 \approx 3.33\text{ ms}$.
        `
    },
    "uart_rs232": {
        title: "EIA-232 / UART Asynchronous Framing Specification",
        category: "Serial Protocols",
        badge: "EIA-232",
        content: `
# RS-232 / UART Serial Data Framing

### 1. Frame Structure (Idle $\rightarrow$ Start $\rightarrow$ Data $\rightarrow$ Parity $\rightarrow$ Stop)
1. **Idle State:** Line is HIGH (Logic 1 / Mark).
2. **Start Bit:** Line drops LOW (Logic 0 / Space) for 1 bit-period.
3. **Data Bits (5 to 8 bits):** Transmitted Least Significant Bit (LSB) first ($b_0 \rightarrow b_7$).
4. **Parity Bit (Optional):** Even, Odd, or None.
5. **Stop Bit(s):** Line returns HIGH (Logic 1) for 1 or 2 bit-periods.

### 2. Common Baud Rates
- 300, 1200, 2400, 9600, 19200, 38400, 115200 bps.
- Bit period $T = 1 / \text{Baud Rate}$.
        `
    },
    "xor_ciphers": {
        title: "CRYPTO-XOR: Stream Ciphers & Keystream Reuse",
        category: "Cryptanalysis",
        badge: "CRYPTO-XOR",
        content: `
# Cryptanalysis of XOR Stream Ciphers

### 1. Fundamental XOR Inversion Property
- $C = P \oplus K$
- $P = C \oplus K$

### 2. The Two-Time Pad Flaw (Keystream Reuse)
If two plaintexts $P_1$ and $P_2$ are encrypted with the same keystream $K$:
$C_1 \oplus C_2 = (P_1 \oplus K) \oplus (P_2 \oplus K) = P_1 \oplus P_2$

The keystream cancels out completely!

### 3. Crib Dragging Technique
When an ASCII letter is XORed with an ASCII space (\`0x20\`), its case flips ($A \leftrightarrow a$).
By sliding a known guess word ("crib") across $C_1 \oplus C_2$, when the guess is aligned with genuine text in $P_1$, the corresponding valid plaintext of $P_2$ immediately appears in the output.
        `
    },
    "rfc_791_tcp": {
        title: "RFC 791 / RFC 793: IP Header Checksum & TCP Handshake",
        category: "Network Standards",
        badge: "RFC-791",
        content: `
# RFC 791 IPv4 & RFC 793 TCP Transmission Protocols

### 1. IPv4 Header Checksum Algorithm
1. Break the 20-byte IP header into 16-bit 2-byte words (set the Checksum field itself to \`0x0000\`).
2. Sum all 16-bit words using standard addition.
3. Add any carry bits from the high 16 bits back into the low 16 bits (One's Complement Sum).
4. Invert all bits (\`~Sum\`). This is the RFC 791 Checksum.

### 2. TCP 3-Way Handshake
1. **Client $\rightarrow$ Server:** \`SYN\` (Initial Sequence Number $SEQ = X$).
2. **Server $\rightarrow$ Client:** \`SYN-ACK\` ($SEQ = Y$, $ACK = X + 1$).
3. **Client $\rightarrow$ Server:** \`ACK\` ($SEQ = X + 1$, $ACK = Y + 1$).
        `
    },
    "hash_length_ext": {
        title: "SEC-HASH: Merkle-Damgård & Length Extension Attacks",
        category: "Cryptography",
        badge: "SEC-HASH",
        content: `
# Merkle-Damgård Construction & MAC Forgery

### 1. Vulnerability in Naive Secret Prefixes
When constructing a message authentication code via $MAC = H(\text{secret} \parallel \text{message})$ using MD5, SHA-1, or SHA-256:
Because these algorithms process data in iterative 512-bit blocks and output the final internal state registers, an attacker who knows $H(M)$ can instantiate the hash state with $H(M)$ and continue hashing appended data without knowing the \`secret\`!

### 2. Forgery Formula
$H(\text{secret} \parallel M \parallel \text{Padding} \parallel M') = \text{HashStep}(H(\text{secret} \parallel M), M')$
        `
    },
    "mbr_fat32": {
        title: "FS-FAT32: Master Boot Record & Cluster Allocation",
        category: "Storage Architecture",
        badge: "FS-FAT32",
        content: `
# MBR Partition Tables & FAT32 File Forensics

### 1. Master Boot Record (Sector 0 / Offset 0x0000)
- Bytes 0–445: Bootstrap Code
- Bytes 446–509: 4 Primary Partition Table Entries (16 bytes each)
  - Offset +0: Bootable Flag (\`0x80\` = Active, \`0x00\` = Inactive)
  - Offset +4: Partition Type (\`0x0B\` / \`0x0C\` = FAT32, \`0x83\` = Linux)
  - Offset +8: LBA Start Sector (32-bit Little Endian)
  - Offset +12: Total Sector Count (32-bit Little Endian)
- Bytes 510–511: MBR Boot Signature (\`0x55AA\`)

### 2. FAT32 Cluster Chaining
Each entry in the File Allocation Table points to the next cluster of the file:
- Value \`0x00000000\` = Free Cluster
- Value \`0x02\`–\`0x0FFFFFEF\` = Next Cluster Number
- Value \`0x0FFFFFF8\`–\`0x0FFFFFFF\` = End of File (EOF)
        `
    },
    "x86_assembly": {
        title: "X86-64: Intel Architecture Instruction Set & Calling Conventions",
        category: "Assembly & Reversing",
        badge: "X86-64",
        content: `
# x86-64 Instruction Reference & Registers

### 1. General-Purpose Registers
- \`RAX\`: Accumulator (Function Return Value)
- \`RDI\`, \`RSI\`, \`RDX\`, \`RCX\`, \`R8\`, \`R9\`: 1st through 6th function arguments (System V AMD64 ABI)
- \`RSP\`: Stack Pointer (top of current stack frame)
- \`RBP\`: Base Pointer (frame anchor)
- \`RIP\`: Instruction Pointer (program counter)

### 2. Core Instructions
- \`MOV dst, src\`: Copy value from src to dst.
- \`CMP a, b\`: Compute \`a - b\` and set FLAGS (Zero Flag ZF = 1 if equal).
- \`TEST a, b\`: Compute bitwise \`a & b\` and set Zero Flag.
- \`JE / JZ label\`: Jump if Equal (ZF = 1).
- \`JNE / JNZ label\`: Jump if Not Equal (ZF = 0).
- \`XOR dst, src\`: Bitwise XOR. \`XOR RAX, RAX\` zeroes the register.
- \`CALL label\`: Push RIP+next to stack, jump to label.
- \`RET\`: Pop saved RIP from stack and jump to it.
        `
    },
    "spectre_cache": {
        title: "MICRO-SPEC: Cache Timing & Speculative Side-Channels",
        category: "Microarchitecture",
        badge: "MICRO-SPEC",
        content: `
# Flush+Reload & Speculative Cache Side-Channels

### 1. CPU Memory Hierarchy Latency
- **L1 / L2 Cache Hit:** ~1 to 5 CPU clock cycles
- **L3 LLC Cache Hit:** ~15 to 40 CPU clock cycles
- **Main DRAM Cache Miss:** ~150 to 300+ CPU clock cycles

### 2. Flush+Reload Attack Principle
1. **Flush:** Attacker uses \`clflush\` to evict a shared 256-page probe array from cache.
2. **Speculate:** Victim CPU speculatively evaluates a bounds-check branch and accesses \`ProbeArray[SecretByte * 4096]\`. Even if the branch prediction is later rolled back by the CPU, the cache state remains altered!
3. **Reload / Measure:** Attacker measures access latency (\`rdtsc\`) across all 256 pages:
   - The single page that responds in $< 40$ cycles reveals the value of \`SecretByte\`!
        `
    }
};
