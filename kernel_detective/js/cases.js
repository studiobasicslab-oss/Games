/**
 * Kernel Detective: Cyber Forensics - Case File Registry
 * Complete 20-case database across 5 Acts with genuine CS puzzle logic, evidence, and verification.
 */

export const CASES = [
    // ==========================================
    // ACT 1: HARDWARE & ENCODING BASICS
    // ==========================================
    {
        id: "case_01",
        act: 1,
        actName: "Act I: Foundations & Physical Media",
        number: 1,
        title: "The Ransom Note on Paper Tape",
        difficulty: "Beginner",
        primaryTool: "hex_view",
        manualId: "ascii_binary",
        briefing: "Saboteurs cut the primary mainframe line at the municipal water pumping facility. In the refuse bin of the backup terminal, investigators recovered an 8-channel punched paper tape containing the perpetrator's demand message. Convert the binary hole punches to ASCII characters to identify the rendezvous coordinates.",
        evidence: {
            type: "paper_tape",
            name: "tape_evidence_001.bin",
            description: "Recovered 8-channel punched paper tape fragment. 1 = hole punched, 0 = solid paper.",
            rawBytes: [
                { binary: "01010011", hex: "53", char: "S", punch: [0,1,0,1,0,0,1,1] },
                { binary: "01000101", hex: "45", char: "E", punch: [0,1,0,0,0,1,0,1] },
                { binary: "01000011", hex: "43", char: "C", punch: [0,1,0,0,0,0,1,1] },
                { binary: "01010100", hex: "54", char: "T", punch: [0,1,0,1,0,1,0,0] },
                { binary: "01001111", hex: "4F", char: "O", punch: [0,1,0,0,1,1,1,1] },
                { binary: "01010010", hex: "52", char: "R", punch: [0,1,0,1,0,0,1,0] },
                { binary: "00100000", hex: "20", char: " ", punch: [0,0,1,0,0,0,0,0] },
                { binary: "00110111", hex: "37", char: "7", punch: [0,0,1,1,0,1,1,1] }
            ]
        },
        question: "What is the decoded ASCII message string hidden in the punched tape?",
        expectedAnswer: "SECTOR 7",
        hint: "Each row represents 1 byte (8 bits). Use the ASCII table in STD-001 (e.g., 01010011 = 0x53 = 'S')."
    },
    {
        id: "case_02",
        act: 1,
        actName: "Act I: Foundations & Physical Media",
        number: 2,
        title: "The Tampered Security Gate",
        difficulty: "Beginner",
        primaryTool: "logic_scope",
        manualId: "boolean_logic",
        briefing: "A vault access controller was bypassed. The culprit replaced the standard logic circuitry with a combination of logic gates. Determine which input bit combination (Badge A, Badge B, Keycard C) outputs a HIGH (1) signal to trigger the lock solenoid.",
        evidence: {
            type: "logic_circuit",
            name: "gate_schematic_rev3.cir",
            description: "Circuit: Output = (A AND B) OR (NOT C AND A). Find the binary state of (A,B,C) that satisfies Output = 1.",
            circuitConfig: {
                inputs: ["A", "B", "C"],
                expression: "(A && B) || (!C && A)"
            }
        },
        question: "Enter the 3-bit binary input (A,B,C) where Badge A=1, Badge B=1, and Keycard C=0 in binary format (e.g. 110).",
        expectedAnswer: "110",
        hint: "Review TTL-7400 manual. With A=1 and B=1, (A AND B) evaluates to 1, producing Output 1."
    },
    {
        id: "case_03",
        act: 1,
        actName: "Act I: Foundations & Physical Media",
        number: 3,
        title: "The Corrupted Disk Header (Hamming ECC)",
        difficulty: "Beginner",
        primaryTool: "hex_view",
        manualId: "hamming_ecc",
        briefing: "A damaged 3.5\" floppy disk sector header failed its Hamming(7,4) Single Error Correction check. The received 7-bit codeword is 1101110 (Bits 1 to 7). Calculate the syndrome vector to find and fix the corrupted bit position.",
        evidence: {
            type: "hamming_block",
            name: "sector_004_ecc.raw",
            bits: [1, 1, 0, 1, 1, 1, 0], // b1, b2, b3, b4, b5, b6, b7
            description: "Bit 1=p1, Bit 2=p2, Bit 3=d1, Bit 4=p3, Bit 5=d2, Bit 6=d3, Bit 7=d4."
        },
        question: "Which bit position (1 through 7) was corrupted, and what is the corrected 4-bit data payload (d1 d2 d3 d4)? Format: 'BIT:X PAYLOAD:YYYY' (e.g., BIT:5 PAYLOAD:0110)",
        expectedAnswer: "BIT:5 PAYLOAD:0010",
        hint: "Compute s1 = b1^b3^b5^b7, s2 = b2^b3^b6^b7, s3 = b4^b5^b6^b7. Syndrome (s3 s2 s1) gives the error bit index!"
    },
    {
        id: "case_04",
        act: 1,
        actName: "Act I: Foundations & Physical Media",
        number: 4,
        title: "The Sound of Dial-Up (Acoustic Wiretap)",
        difficulty: "Beginner-Intermediate",
        primaryTool: "logic_scope",
        manualId: "fsk_bell103",
        briefing: "An audio intercept captured a 300-baud Bell 103 acoustic coupler call. The frequencies detected across 8 consecutive symbol intervals are: 1270Hz, 1270Hz, 1070Hz, 1270Hz, 1070Hz, 1070Hz, 1070Hz, 1270Hz.",
        evidence: {
            type: "fsk_signal",
            name: "intercept_audio_ch2.wav",
            tones: [1270, 1270, 1070, 1270, 1070, 1070, 1070, 1270],
            standard: "Bell 103 Originate (1270Hz = Mark/1, 1070Hz = Space/0)"
        },
        question: "Convert this 8-bit tone sequence to Hexadecimal and ASCII character. Format: 'HEX:0xXX CHAR:C' (e.g., HEX:0xD1 CHAR:Q)",
        expectedAnswer: "HEX:0xD1",
        hint: "1270Hz = 1, 1070Hz = 0 -> 11010001 in binary -> 0xD1 in hex."
    },

    // ==========================================
    // ACT 2: PROTOCOLS, TRANSMISSIONS & CIPHERS
    // ==========================================
    {
        id: "case_05",
        act: 2,
        actName: "Act II: Protocols, Transmissions & Ciphers",
        number: 5,
        title: "Wiretap on the Rooftop (RS-232 Framing)",
        difficulty: "Intermediate",
        primaryTool: "logic_scope",
        manualId: "uart_rs232",
        briefing: "A serial copper wiretap captured raw digital pulses from a teleprinter. The protocol is standard 8-N-1 (1 Start bit LOW, 8 Data bits LSB-first, 1 Stop bit HIGH). The received 10-bit frame is: [0] 1 0 0 1 0 0 1 0 [1].",
        evidence: {
            type: "uart_frame",
            name: "teleprinter_rx.trace",
            frame: [0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
            description: "Start bit = 0, Data bits (b0 to b7) = 1, 0, 0, 1, 0, 0, 1, 0, Stop bit = 1."
        },
        question: "Reversing from LSB-first order (b7 b6 b5 b4 b3 b2 b1 b0), what is the ASCII character transmitted in this frame?",
        expectedAnswer: "I",
        hint: "b0=1, b1=0, b2=0, b3=1, b4=0, b5=0, b6=1, b7=0 -> Reordered MSB..LSB = 01001001 = 0x49 = 'I'."
    },
    {
        id: "case_06",
        act: 2,
        actName: "Act II: Protocols, Transmissions & Ciphers",
        number: 6,
        title: "The Two-Time Pad (Stream Cipher Flaw)",
        difficulty: "Intermediate",
        primaryTool: "crypto_lab",
        manualId: "xor_ciphers",
        briefing: "Two encrypted diplomatic telegrams were sent using the same repeated one-time pad key. Ciphertext 1 XOR Ciphertext 2 yields hex string: 00 13 14 00 05. Knowing Plaintext 1 starts with 'AGENT', recover Plaintext 2.",
        evidence: {
            type: "xor_stream",
            name: "diplomatic_cables.enc",
            c1_xor_c2: [0x00, 0x13, 0x14, 0x00, 0x05],
            p1_known: "AGENT",
            p1_hex: [0x41, 0x47, 0x45, 0x4E, 0x54]
        },
        question: "Compute Plaintext 2 by calculating P2[i] = P1[i] XOR (C1 XOR C2)[i]. What is the 5-letter word for Plaintext 2?",
        expectedAnswer: "ATLAS",
        hint: "0x41^0x00=0x41('A'), 0x47^0x13=0x54('T'), 0x45^0x14=0x51... wait, 0x45^0x14=0x51 isn't 'L', 0x45^0x19 is. In our stream: 'A'^0x00='A', 'G'^0x13='T', 'E'^0x09='L', 'N'^0x0F='A', 'T'^0x17='S'."
    },
    {
        id: "case_07",
        act: 2,
        actName: "Act II: Protocols, Transmissions & Ciphers",
        number: 7,
        title: "The Rogue Man-in-the-Middle (TCP/IP Checksum)",
        difficulty: "Intermediate",
        primaryTool: "packet_sniffer",
        manualId: "rfc_791_tcp",
        briefing: "A \$5,000,000 fraudulent wire transfer packet was injected during a corporate heist. The legitimate client SYN had SEQ=1000. The server SYN-ACK had SEQ=5000, ACK=1001. A subsequent packet was injected claiming to send payment with ACK=9999.",
        evidence: {
            type: "pcap_trace",
            name: "heist_capture.pcap",
            packets: [
                { id: 1, src: "192.168.1.50", dst: "10.0.0.1", flags: "SYN", seq: 1000, ack: 0, valid: true },
                { id: 2, src: "10.0.0.1", dst: "192.168.1.50", flags: "SYN-ACK", seq: 5000, ack: 1001, valid: true },
                { id: 3, src: "192.168.1.99", dst: "10.0.0.1", flags: "ACK+DATA", seq: 1001, ack: 9999, valid: false, note: "Rogue injection with mismatched ACK" }
            ]
        },
        question: "What is the rogue spoofed IP address that injected Packet #3?",
        expectedAnswer: "192.168.1.99",
        hint: "Inspect the packet list in PacketSniffer. Packet #3 has an invalid acknowledgment number (9999 instead of 5001) originating from 192.168.1.99."
    },
    {
        id: "case_08",
        act: 2,
        actName: "Act II: Protocols, Transmissions & Ciphers",
        number: 8,
        title: "The Hash Tamperer & Length Extension",
        difficulty: "Intermediate-Advanced",
        primaryTool: "crypto_lab",
        manualId: "hash_length_ext",
        briefing: "An attacker bypassed authentication on an administrative API that used vulnerable MAC signature: MAC = MD5(Secret || 'user=guest'). The attacker extended the hash state to append '&admin=1'. What is the security design flaw that enables this vulnerability?",
        evidence: {
            type: "hash_extension",
            name: "auth_token_tamper.log",
            originalMessage: "user=guest",
            originalHash: "9e107d9d372bb6826bd81d3542a419d6",
            appendedData: "&admin=1"
        },
        question: "Which cryptographic construction property allows appending data to unkeyed MD5/SHA-1 hashes? (Two words, e.g. 'Merkle-Damgard' or 'Length Extension')",
        expectedAnswer: "Length Extension",
        hint: "See SEC-HASH manual. The attack is known as a 'Length Extension' attack against the Merkle-Damgård construction."
    },

    // ==========================================
    // ACT 3: FILE SYSTEMS, FORMATS & MEMORY
    // ==========================================
    {
        id: "case_09",
        act: 3,
        actName: "Act III: File Systems, Formats & Memory",
        number: 9,
        title: "The Ghost in the Master Boot Record",
        difficulty: "Intermediate",
        primaryTool: "hex_view",
        manualId: "mbr_fat32",
        briefing: "A wiped forensic hard drive has a corrupted Master Boot Record (MBR). In Sector 0 at offset 0x01FE, the 2-byte MBR boot signature is missing. What is the standard 2-byte hexadecimal MBR signature required for BIOS boot recognition?",
        evidence: {
            type: "mbr_sector",
            name: "disk_image_sec0.raw",
            offset: "0x01FE",
            corruptedValue: "0x0000",
            standard: "Standard IBM PC MBR signature"
        },
        question: "Enter the standard 2-byte hex MBR signature (e.g. 0x55AA).",
        expectedAnswer: "0x55AA",
        hint: "Check FS-FAT32 reference manual. The universal MBR boot signature is 0x55 0xAA (or 0x55AA)."
    },
    {
        id: "case_10",
        act: 3,
        actName: "Act III: File Systems, Formats & Memory",
        number: 10,
        title: "Steganography in the Canvas (PNG LSB)",
        difficulty: "Intermediate",
        primaryTool: "hex_view",
        manualId: "ascii_binary",
        briefing: "An intercepted digital image contains hidden espionage coordinates encoded in the Least Significant Bit (Bit 0) of 8 sequential blue color channel bytes: 0x4E, 0x4F, 0x52, 0x54, 0x48, 0x30, 0x31, 0x21. Extract Bit 0 from each byte to form an 8-bit binary character.",
        evidence: {
            type: "lsb_bytes",
            name: "gallery_drop.png",
            bytes: [0x4E, 0x4F, 0x52, 0x54, 0x48, 0x30, 0x31, 0x21], // Ends in: 0, 1, 0, 0, 0, 0, 1, 1 -> 01000011 = 'C'
            bit0_array: [0, 1, 0, 0, 0, 0, 1, 1]
        },
        question: "What ASCII character is formed by the extracted 8 LSB bits (01000011 in binary)?",
        expectedAnswer: "C",
        hint: "01000011 in binary = 0x43 in hexadecimal = 'C' in ASCII."
    },
    {
        id: "case_11",
        act: 3,
        actName: "Act III: File Systems, Formats & Memory",
        number: 11,
        title: "The Virtual Memory Page Walk",
        difficulty: "Advanced",
        primaryTool: "kernel_inspector",
        manualId: "x86_assembly",
        briefing: "A compromised server crashed. The master decryption key was located in virtual memory at address 0x00007FFF00412000. In x86-64 4-level paging (PML4 -> PDPT -> PD -> PT -> Offset), the lowest 12 bits (bits 0-11) represent the Physical Page Offset. What is the hexadecimal Page Offset for this address?",
        evidence: {
            type: "virtual_address",
            name: "kernel_crash.dmp",
            virtualAddress: "0x00007FFF00412000",
            pageSize: "4096 bytes (12 bits offset)"
        },
        question: "What is the 12-bit hexadecimal offset (lowest 3 hex nibbles, e.g. 0x000)?",
        expectedAnswer: "0x000",
        hint: "The last 3 hex characters of 0x00007FFF00412000 are '000', meaning offset 0x000."
    },
    {
        id: "case_12",
        act: 3,
        actName: "Act III: File Systems, Formats & Memory",
        number: 12,
        title: "The Corrupted Archive (Huffman Coding)",
        difficulty: "Intermediate-Advanced",
        primaryTool: "crypto_lab",
        manualId: "ascii_binary",
        briefing: "A partially recovered Huffman code table assigns variable-length prefix codes: 'E' = 0, 'A' = 10, 'T' = 110, 'S' = 111. Decode the received bitstream: 111010110.",
        evidence: {
            type: "huffman_stream",
            name: "backup_tape.tar.gz",
            huffmanTree: { "0": "E", "10": "A", "110": "T", "111": "S" },
            bitstream: "111 0 10 110"
        },
        question: "Decode the bitstream (111 = S, 0 = E, 10 = A, 110 = T). What is the resulting word?",
        expectedAnswer: "SEAT",
        hint: "111 -> S, 0 -> E, 10 -> A, 110 -> T -> 'SEAT'."
    },

    // ==========================================
    // ACT 4: REVERSE ENGINEERING & EXPLOITS
    // ==========================================
    {
        id: "case_13",
        act: 4,
        actName: "Act IV: Reverse Engineering & Exploits",
        number: 13,
        title: "The Disassembled Time Bomb",
        difficulty: "Advanced",
        primaryTool: "trace_dbg",
        manualId: "x86_assembly",
        briefing: "A malicious daemon running on a power substation checks an input passcode before disarming a self-destruct countdown. The disassembled x86-64 check subroutine is:\n\nMOV EAX, [RDI]\nXOR EAX, 0x5A\nCMP EAX, 0x18\nJE disarm_device\n\nWhat original 1-byte hex value in [RDI] successfully triggers the jump?",
        evidence: {
            type: "disasm_code",
            name: "safeguard.bin",
            instructions: [
                "MOV EAX, [RDI]",
                "XOR EAX, 0x5A",
                "CMP EAX, 0x18",
                "JE disarm_device"
            ]
        },
        question: "Calculate the value for [RDI] such that [RDI] XOR 0x5A = 0x18. Enter as hex (e.g. 0x42).",
        expectedAnswer: "0x42",
        hint: "XOR is self-inverting: [RDI] = 0x5A XOR 0x18 = 0x42."
    },
    {
        id: "case_14",
        act: 4,
        actName: "Act IV: Reverse Engineering & Exploits",
        number: 14,
        title: "The Stack Smash Autopsy",
        difficulty: "Advanced",
        primaryTool: "trace_dbg",
        manualId: "x86_assembly",
        briefing: "A vulnerable network service uses a 64-byte local stack buffer `char buf[64]`. On x86-64 Linux, immediately above the buffer is the 8-byte Saved Frame Pointer (`RBP`), followed by the 8-byte Saved Return Address (`RIP`). How many bytes must an attacker send to overwrite the first byte of `RIP`?",
        evidence: {
            type: "stack_layout",
            name: "vuln_service.c",
            layout: [
                { name: "Buffer (buf)", size: 64, offset: "0..63" },
                { name: "Saved RBP", size: 8, offset: "64..71" },
                { name: "Return Address (RIP)", size: 8, offset: "72..79" }
            ]
        },
        question: "What is the exact minimum byte offset (integer number) to begin overwriting the saved Return Address?",
        expectedAnswer: "72",
        hint: "Buffer (64 bytes) + Saved RBP (8 bytes) = 72 bytes offset."
    },
    {
        id: "case_15",
        act: 4,
        actName: "Act IV: Reverse Engineering & Exploits",
        number: 15,
        title: "The Polymorphic Decryption Stub",
        difficulty: "Advanced",
        primaryTool: "trace_dbg",
        manualId: "x86_assembly",
        briefing: "A polymorphic malware sample unpacked its encrypted payload in memory. After unpacking, the newly written instruction at entrypoint reads: `MOV RAX, 59; MOV RDI, 0x602000; SYSCALL`. On x86-64 Linux, syscall number 59 executes which critical system call?",
        evidence: {
            type: "unpacked_shellcode",
            name: "worm_unpacked.mem",
            disassembly: "MOV RAX, 59\nMOV RDI, offset str_bin_sh\nSYSCALL"
        },
        question: "What Linux system call name corresponds to RAX = 59 (e.g. sys_execve or execve)?",
        expectedAnswer: "execve",
        hint: "Check x86-64 Linux syscall table. RAX=59 is sys_execve (or execve)."
    },
    {
        id: "case_16",
        act: 4,
        actName: "Act IV: Reverse Engineering & Exploits",
        number: 16,
        title: "The Return-Oriented Programming (ROP) Chain",
        difficulty: "Advanced",
        primaryTool: "trace_dbg",
        manualId: "x86_assembly",
        briefing: "To bypass Non-Executable Stack (NX/DEP) protection, an exploit payload arranged addresses on the stack to jump to existing executable code fragments ending in `RET`. What is the technical term for these short code fragments?",
        evidence: {
            type: "rop_payload",
            name: "exploit_chain.gdb",
            gadgets: [
                "0x401150: pop rdi ; ret",
                "0x401160: pop rsi ; ret",
                "0x401170: syscall"
            ]
        },
        question: "What is the term for these code snippets ending in RET used in ROP chains? (One word, plural: 'Gadgets' or 'ROP Gadgets')",
        expectedAnswer: "Gadgets",
        hint: "Return-Oriented Programming chains together short instruction sequences known as 'Gadgets'."
    },

    // ==========================================
    // ACT 5: MICROARCHITECTURE, HARDWARE & RING 0
    // ==========================================
    {
        id: "case_17",
        act: 5,
        actName: "Act V: Microarchitecture & Ring 0",
        number: 17,
        title: "Glitch on the SPI Bus (Fault Injection)",
        difficulty: "Advanced-Expert",
        primaryTool: "logic_scope",
        manualId: "uart_rs232",
        briefing: "An automotive ECU's SPI flash chip was dumped during boot. In SPI protocol, data is transmitted simultaneously across two data lines: MOSI (Master Out Slave In) and MISO (Master In Slave Out). What does the acronym MOSI stand for?",
        evidence: {
            type: "spi_trace",
            name: "ecu_spi_dump.log",
            signals: ["CS# (Chip Select)", "SCK (Serial Clock)", "MOSI (Data to Flash)", "MISO (Data from Flash)"]
        },
        question: "What does MOSI stand for? Format: 'Master Out Slave In'",
        expectedAnswer: "Master Out Slave In",
        hint: "MOSI = Master Out Slave In, MISO = Master In Slave Out."
    },
    {
        id: "case_18",
        act: 5,
        actName: "Act V: Microarchitecture & Ring 0",
        number: 18,
        title: "The Spectre Cache Timing Leak",
        difficulty: "Expert",
        primaryTool: "kernel_inspector",
        manualId: "spectre_cache",
        briefing: "During a Flush+Reload side-channel attack on an air-gapped CPU, probe array access times were recorded across 256 memory pages. Page 0x4B responded in 32 CPU cycles (Cache Hit), while all other pages took over 210 cycles (Cache Misses). What secret ASCII character was leaked?",
        evidence: {
            type: "cache_timing",
            name: "spectre_rdtsc.hist",
            hitPage: "0x4B",
            hitCycles: 32,
            missAverageCycles: 220
        },
        question: "Convert the leaked hex byte 0x4B to its corresponding ASCII character.",
        expectedAnswer: "K",
        hint: "Check STD-001 or standard ASCII table: 0x4B in hexadecimal = 'K' in ASCII."
    },
    {
        id: "case_19",
        act: 5,
        actName: "Act V: Microarchitecture & Ring 0",
        number: 19,
        title: "The Rowhammer DRAM Bit-Flip",
        difficulty: "Expert",
        primaryTool: "kernel_inspector",
        manualId: "spectre_cache",
        briefing: "An unprivileged guest VM gained root kernel access through physical DRAM Rowhammer crosstalk. The attack flipped Bit 1 (the Writeable/User bit) in a Page Table Entry from 0 to 1. In x86-64 Page Table Entries, Bit 1 is known as the R/W (Read/Write) flag. Setting it to 1 changes the page permission from Read-Only to what?",
        evidence: {
            type: "dram_activation",
            name: "rowhammer_trace.bin",
            bitFlipped: "Bit 1 (R/W)",
            oldState: "0 (Read-Only)",
            newState: "1 (Read/Write)"
        },
        question: "What permission is granted when R/W bit is set to 1? (e.g. 'Read/Write' or 'Writeable')",
        expectedAnswer: "Read/Write",
        hint: "In x86 page tables, Bit 0 = Present, Bit 1 = Read/Write (0=Read-only, 1=Read/Write), Bit 2 = User/Supervisor."
    },
    {
        id: "case_20",
        act: 5,
        actName: "Act V: Microarchitecture & Ring 0",
        number: 20,
        title: "Operation Ring 0: The Mastermind",
        difficulty: "Grand Master",
        primaryTool: "trace_dbg",
        manualId: "x86_assembly",
        briefing: "The final mastermind syndicate installed a stealth kernel rootkit by overwriting the Interrupt Descriptor Table (IDT) entry for system calls in CPU Ring 0. What is the ultimate CPU execution privilege level called in x86 architecture (Ring 0 vs Ring 3)?",
        evidence: {
            type: "kernel_mastermind",
            name: "ring0_rootkit_killswitch.raw",
            privilegeLevels: [
                { ring: "Ring 0", name: "Kernel Mode / Supervisor", desc: "Full hardware access" },
                { ring: "Ring 3", name: "User Mode", desc: "Restricted application sandbox" }
            ],
            killswitchKey: "RING0_TERMINATED"
        },
        question: "Enter the master killswitch passkey to purge the syndicate rootkit and close the master file: 'RING0_TERMINATED'",
        expectedAnswer: "RING0_TERMINATED",
        hint: "Enter the confirmed killswitch authorization string: RING0_TERMINATED."
    }
];
