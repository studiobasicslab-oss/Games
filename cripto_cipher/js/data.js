/**
 * CRIPTO-CIPHER: Cold War Signal Interceptor Database
 * Historical ciphers, letter frequencies, 15 SIGINT intercepts, and cryptographic algorithms.
 */

window.CRIPTO_DATA = {
    // English Standard Letter Frequencies (ETAOIN SHRDLU)
    englishFreq: {
        'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0, 'N': 6.7,
        'S': 6.3, 'H': 6.1, 'R': 6.0, 'D': 4.3, 'L': 4.0, 'C': 2.8,
        'U': 2.8, 'M': 2.4, 'W': 2.4, 'F': 2.2, 'G': 2.0, 'Y': 2.0,
        'P': 1.9, 'B': 1.5, 'V': 1.0, 'K': 0.8, 'J': 0.15, 'X': 0.15,
        'Q': 0.10, 'Z': 0.07
    },

    commonDigrams: ["TH", "HE", "IN", "ER", "AN", "RE", "ON", "AT", "EN", "ND", "TI", "ES", "OR", "TE", "OF"],
    commonTrigrams: ["THE", "AND", "ING", "ENT", "ION", "HER", "FOR", "THA", "NTH", "INT"],

    // 15 Cold War SIGINT Intercept Dossiers
    intercepts: [
        {
            id: 1,
            title: "Operation Rubicon",
            badge: "INTERCEPT #01 // CAESAR SHIFT",
            cipherType: "caesar",
            cipherTypeName: "Caesar Substitution Shift",
            shiftKey: 3,
            difficulty: "Rookie Cryptanalyst",
            origin: "Checkpoint Charlie, Berlin // VHF Radio Band",
            ciphertext: "PHHW PH DW WKH EUDQGHQEXUJ JDWH DW PLGQLJKW",
            plaintext: "MEET ME AT THE BRANDENBURG GATE AT MIDNIGHT",
            timeLimitSec: 90,
            hint: "Classic shift cipher (ROT-N). Look at 3-letter word 'WKH' $\\rightarrow$ 'THE' (shift = 3).",
            debrief: "Caesar cipher shifts each letter by a fixed key. Since there are only 25 possible shifts, it is vulnerable to exhaustive brute force or checking the shift of 'THE'."
        },
        {
            id: 2,
            title: "Submarine Wolfpack Order",
            badge: "INTERCEPT #02 // CAESAR SHIFT",
            cipherType: "caesar",
            cipherTypeName: "Caesar Substitution Shift",
            shiftKey: 7,
            difficulty: "Rookie Cryptanalyst",
            origin: "North Atlantic Hydrophone Array // 4.2 MHz",
            ciphertext: "HCLYAPCL THZZPCL ZBI THYPUR ZAYPRL VU JVUCVF NYPK",
            plaintext: "INITIATE MASSIVE SUB MARINE STRIKE ON CONVOY GRID",
            timeLimitSec: 90,
            hint: "Notice common 2-letter word 'VU' $\\rightarrow$ likely 'ON' or 'IN' (Shift = 7).",
            debrief: "Single-shift ciphers preserve the exact distribution of English letters, shifted along the alphabet axis."
        },
        {
            id: 3,
            title: "The Diplomatic Cable",
            badge: "INTERCEPT #03 // MONOALPHABETIC",
            cipherType: "monoalphabetic",
            cipherTypeName: "Monoalphabetic Substitution Cryptogram",
            difficulty: "Junior Cryptanalyst",
            origin: "Geneva Embassy Teleprinter Intercept",
            cipherMap: {
                'A': 'X', 'B': 'Y', 'C': 'Z', 'D': 'A', 'E': 'B', 'F': 'C', 'G': 'D', 'H': 'E',
                'I': 'F', 'J': 'G', 'K': 'H', 'L': 'I', 'M': 'J', 'N': 'K', 'O': 'L', 'P': 'M',
                'Q': 'N', 'R': 'O', 'S': 'P', 'T': 'Q', 'U': 'R', 'V': 'S', 'W': 'T', 'X': 'U',
                'Y': 'V', 'Z': 'W'
            },
            ciphertext: "QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD",
            plaintext: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
            timeLimitSec: 100,
            hint: "'QEB' appears twice $\\rightarrow$ represents 'THE'. 'Q'=T, 'E'=H, 'B'=E.",
            debrief: "Monoalphabetic substitution replaces each letter with a unique partner. Frequency analysis of single letters and frequent trigrams instantly cracks the code."
        },
        {
            id: 4,
            title: "KGB Dead Drop Coordinates",
            badge: "INTERCEPT #04 // MONOALPHABETIC",
            cipherType: "monoalphabetic",
            cipherTypeName: "Monoalphabetic Substitution Cryptogram",
            difficulty: "Junior Cryptanalyst",
            origin: "Vienna Shortwave Numbers Station",
            ciphertext: "ZROXGHU WUDLQ VWDWLRQ ORFNHU QLQH FRQWDLQV PLFURILOP",
            plaintext: "BOULDER TRAIN STATION LOCKER NINE CONTAINS MICROFILM",
            timeLimitSec: 110,
            hint: "Examine letter frequencies: 'R' and 'W' appear frequently, representing 'O' and 'T'.",
            debrief: "Microfilm drops were a hallmark of Cold War tradecraft. Solving high-frequency letters unmasks the remaining vowels."
        },
        {
            id: 5,
            title: "Bletchley Enigma Intercept",
            badge: "INTERCEPT #05 // VIGENERE POLYALPHABETIC",
            cipherType: "vigenere",
            cipherTypeName: "Polyalphabetic Vigenère Cipher",
            keyword: "KEY",
            difficulty: "Senior Cryptanalyst",
            origin: "Baltic Fleet Naval Encryption Stream",
            ciphertext: "RIEK VC WFI HSYPK",
            plaintext: "HALT AT THE RIVER",
            timeLimitSec: 110,
            hint: "Encrypted with recurring 3-letter keyword 'KEY'. Column-by-column modular subtraction reveals the plaintext.",
            debrief: "The Vigenère cipher was once called 'le chiffre indéchiffrable' (the unbreakable cipher) because repeating keys flatten single-letter frequency spikes."
        },
        {
            id: 6,
            title: "U-Boat Periscope Flash",
            badge: "INTERCEPT #06 // VIGENERE POLYALPHABETIC",
            cipherType: "vigenere",
            cipherTypeName: "Polyalphabetic Vigenère Cipher",
            keyword: "RADAR",
            difficulty: "Senior Cryptanalyst",
            origin: "Barents Sea Radio Direction Finder",
            ciphertext: "ZRCKV EOGIS XIC",
            plaintext: "INTERCEPT ENEMY SHIP",
            timeLimitSec: 120,
            hint: "Polyalphabetic shift with 5-letter keyword 'RADAR'.",
            debrief: "Kasiski Examination breaks Vigenère by finding repeating ciphertext trigrams to deduce the exact keyword length."
        },
        {
            id: 7,
            title: "The Red October Reroute",
            badge: "INTERCEPT #07 // ENIGMA ROTOR M3",
            cipherType: "enigma",
            cipherTypeName: "Enigma 3-Rotor Machine",
            rotorSetting: [1, 5, 12],
            difficulty: "Master Cryptanalyst",
            origin: "Murmansk Naval Headquarters // Encrypted Enigma Feed",
            ciphertext: "DVTXZ QMFYP HKLOP",
            plaintext: "COURSE SET FOR HAVANA",
            timeLimitSec: 130,
            hint: "Step the 3 mechanical rotor dials until the electric signal path illuminates the matching plaintext letters.",
            debrief: "The German Enigma machine scrambled messages through 3 stepped rotors and a plugboard (Steckerbrett), creating 158 quintillion permutations."
        },
        {
            id: 8,
            title: "Silo Launch Sequence Abort",
            badge: "INTERCEPT #08 // ATBASH CIPHER",
            cipherType: "atbash",
            cipherTypeName: "Atbash Mirror Substitution",
            difficulty: "Junior Cryptanalyst",
            origin: "Cheyenne Mountain Defense Teletype",
            ciphertext: "ZYRU GZMTVI ZYLIG OZFMXS",
            plaintext: "ABORT DANGER ABORT LAUNCH",
            timeLimitSec: 80,
            hint: "Atbash is a reverse alphabet cipher: A $\\leftrightarrow$ Z, B $\\leftrightarrow$ Y, C $\\leftrightarrow$ X.",
            debrief: "Atbash is an ancient Hebrew mirror cipher that pairs the 1st letter with the 26th, the 2nd with the 25th, etc."
        },
        {
            id: 9,
            title: "Zimmermann Western Alliance",
            badge: "INTERCEPT #09 // COLUMNAR TRANSPOSITION",
            cipherType: "transposition",
            cipherTypeName: "Rail Fence & Columnar Transposition",
            columns: 4,
            difficulty: "Senior Cryptanalyst",
            origin: "Room 40 Admiralty Intercept // Subsea Cable",
            ciphertext: "TEAE HPMS EDSR CRTE",
            plaintext: "THE SECRET MESSAGE",
            timeLimitSec: 120,
            hint: "Transposition scrambles letter positions rather than substituting identities. Re-arrange into a 4-column grid.",
            debrief: "Columnar transposition writes plaintext into a rectangular matrix row-by-row and reads it column-by-column."
        },
        {
            id: 10,
            title: "The Cambridge Five Leaks",
            badge: "INTERCEPT #10 // MONOALPHABETIC",
            cipherType: "monoalphabetic",
            cipherTypeName: "Monoalphabetic Substitution Cryptogram",
            difficulty: "Master Cryptanalyst",
            origin: "MI6 SIS Counter-Intelligence Radio Monitored",
            ciphertext: "WKH GRXEOH DJHQW KDV IOHG WR PRVFRZ",
            plaintext: "THE DOUBLE AGENT HAS FLED TO MOSCOW",
            timeLimitSec: 100,
            hint: "'WKH' $\\rightarrow$ 'THE', 'WR' $\\rightarrow$ 'TO'.",
            debrief: "Double agents passed intelligence during the Cold War using one-time pads and substitution systems."
        },
        {
            id: 11,
            title: "Cuban Missile Crisis Teletype",
            badge: "INTERCEPT #11 // VIGENERE POLYALPHABETIC",
            cipherType: "vigenere",
            cipherTypeName: "Polyalphabetic Vigenère Cipher",
            keyword: "CUBA",
            difficulty: "Chief of Station",
            origin: "Havana Military District // Encrypted Wire",
            ciphertext: "JMNUG BMNKU JMP",
            plaintext: "WARHEADS IN PLACE",
            timeLimitSec: 110,
            hint: "Vigenère cipher with 4-letter keyword 'CUBA'.",
            debrief: "The 1962 Cuban Missile Crisis highlighted the urgent need for instantaneous, secure hotline communications between Moscow and Washington."
        },
        {
            id: 12,
            title: "Project Venona Codebook",
            badge: "INTERCEPT #12 // ONE-TIME PAD RESIDUAL",
            cipherType: "monoalphabetic",
            cipherTypeName: "One-Time Pad Reused Key Cryptogram",
            difficulty: "Chief of Station",
            origin: "Arlington Hall Venona Intercept Archive",
            ciphertext: "XUDQLXP ILVVLRQ VSHFV FRPSURPLVHG",
            plaintext: "URANIUM FISSION SPECS COMPROMISED",
            timeLimitSec: 120,
            hint: "'XUDQLXP' contains repeated letters matching 'URANIUM'.",
            debrief: "Project Venona successfully cracked Soviet communications because code clerks made the critical blunder of reusing pages from one-time pads!"
        },
        {
            id: 13,
            title: "Operation Gold Berlin Tunnel",
            badge: "INTERCEPT #13 // ENIGMA ROTOR M4",
            cipherType: "enigma",
            cipherTypeName: "Enigma 4-Rotor Machine",
            rotorSetting: [3, 8, 14],
            difficulty: "Director of SIGINT",
            origin: "Alt-Glienicke Underground Wiretap",
            ciphertext: "PLMNB VCFXR TGYUJ",
            plaintext: "TUNNEL LOCATED RETREAT",
            timeLimitSec: 130,
            hint: "Tune the 3 rotor gears to align the electrical reflection path.",
            debrief: "Operation Gold was a joint CIA/MI6 tunnel under East Berlin tapping Soviet military landlines."
        },
        {
            id: 14,
            title: "The Numbers Station Finale",
            badge: "INTERCEPT #14 // MONOALPHABETIC",
            cipherType: "monoalphabetic",
            cipherTypeName: "High-Entropy Substitution Cryptogram",
            difficulty: "Director of SIGINT",
            origin: "Lincolnshire Poacher E03 Shortwave Broadcast",
            ciphertext: "HYHUB DJHQW UHWXUQ WR EDVH LPPHGLDWHOB",
            plaintext: "EVERY AGENT RETURN TO BASE IMMEDIATELY",
            timeLimitSec: 110,
            hint: "'HYHUB' has identical 1st and 3rd letters $\\rightarrow$ 'EVERY'.",
            debrief: "Shortwave numbers stations broadcast synthesized voices reading coded groups across the globe with total anonymity."
        },
        {
            id: 15,
            title: "The Red Phone Hotline Master",
            badge: "INTERCEPT #15 // RSA ASYMMETRIC CIPHER",
            cipherType: "caesar",
            cipherTypeName: "Modular Arithmetic & Asymmetric Key",
            shiftKey: 13, // ROT13
            difficulty: "National Cryptologic Director",
            origin: "Direct Communications Link (MOLINK) // White House",
            ciphertext: "CRNPR ERFGBERQ NYY FVPBZF FGNAQ QBJA",
            plaintext: "PEACE RESTORED ALL SICOMS STAND DOWN",
            timeLimitSec: 120,
            hint: "ROT-13: Symmetric shift by 13 letters ($A \\leftrightarrow N, B \\leftrightarrow O$).",
            debrief: "Modern cryptography shifted from mechanical rotors to asymmetric public-key systems (RSA, Elliptic Curves) relying on prime factorization hardness."
        }
    ]
};
