export const WORDS = [
  {
    word: "VOLCANO",
    category: "Natural Phenomenon",
    difficulty: "Hard",
    attributes: {
      living: "No",
      human_made: "No",
      physical: "Yes",
      dangerous: "Yes",
      associated_with_fire: "Yes",
      found_underwater: "Sometimes",
      found_outdoors: "Yes",
      edible: "No",
      smaller_than_human: "No",
      portable: "No",
    }
  },
  {
    word: "APPLE",
    category: "Food",
    difficulty: "Easy",
    attributes: {
      living: "Sometimes", // Once living
      human_made: "No",
      physical: "Yes",
      dangerous: "No",
      associated_with_fire: "No",
      found_underwater: "No",
      found_outdoors: "Yes",
      edible: "Yes",
      smaller_than_human: "Yes",
      portable: "Yes",
    }
  },
  {
    word: "LIGHTHOUSE",
    category: "Structure",
    difficulty: "Medium",
    attributes: {
      living: "No",
      human_made: "Yes",
      physical: "Yes",
      dangerous: "No",
      associated_with_fire: "Sometimes", // Light source
      found_underwater: "No",
      found_outdoors: "Yes",
      edible: "No",
      smaller_than_human: "No",
      portable: "No",
    }
  }
];

export const PREDEFINED_QUESTIONS = [
  { id: 'q_living', text: 'Is it living?', attribute: 'living' },
  { id: 'q_human_made', text: 'Is it human-made?', attribute: 'human_made' },
  { id: 'q_physical', text: 'Is it a physical object/entity?', attribute: 'physical' },
  { id: 'q_dangerous', text: 'Is it dangerous?', attribute: 'dangerous' },
  { id: 'q_fire', text: 'Is it associated with fire or heat?', attribute: 'associated_with_fire' },
  { id: 'q_underwater', text: 'Can it be found underwater?', attribute: 'found_underwater' },
  { id: 'q_outdoors', text: 'Is it normally found outdoors?', attribute: 'found_outdoors' },
  { id: 'q_edible', text: 'Is it edible?', attribute: 'edible' },
  { id: 'q_smaller', text: 'Is it smaller than a human?', attribute: 'smaller_than_human' },
  { id: 'q_portable', text: 'Is it portable?', attribute: 'portable' },
];
