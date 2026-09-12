export const levels = [
  {
    id: 1,
    title: "Level 1: Registers & Movement",
    description: "Move the value from register R1 into register R2.",
    initialState: {
      registers: {
        R1: 42,
        R2: 0,
        R3: 0,
        R4: 0
      },
      memory: {} // Not used in level 1
    },
    goal: {
      type: "match_register",
      register: "R2",
      value: 42,
      maxCycles: 10
    }
  },
  {
    id: 2,
    title: "Level 2: Basic Arithmetic",
    description: "Add the values of R1 and R2, and store the result in R3.",
    initialState: {
      registers: {
        R1: 15,
        R2: 27,
        R3: 0,
        R4: 0
      },
      memory: {}
    },
    goal: {
      type: "match_register",
      register: "R3",
      value: 42,
      maxCycles: 20
    }
  }
];
