import re

with open('js/seed_puzzles.js', 'r') as f:
    content = f.read()

# Define the new switch logic
new_logic = """
      if (['crossword', 'mini_crossword', 'cryptic_crossword'].includes(type)) {
        const cw = crosswords[(week - 1) % crosswords.length];
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: "crossword", stars: 4, intro: "A challenging crossword variant.", gridSize: 5, perfectGrid: JSON.stringify(cw) });
      } else if (['sudoku', 'killer_sudoku', 'wordoku', 'magic_square'].includes(type)) {
        const { grid, solution } = scrambleSudoku(baseSudokuGrid, baseSudokuSol);
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: "sudoku", stars: 5, intro: "A true test of logic.", grid: JSON.stringify(grid), solution: JSON.stringify(solution) });
      } else if (['math', 'number_sequence', 'missing_number', 'calcudoku'].includes(type)) {
        const math = generateMath(week);
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Solve the mathematical problem.", question: math.q, correctAnswer: math.a, explanation: math.exp });
      } else if (['trivia', 'knights_knaves', 'who_is_lying', 'age_puzzle', 'truth_lie', 'odd_one_out', 'family_relationship', 'odd_word_out'].includes(type)) {
        const t = triviaQuestions[(week + index) % triviaQuestions.length];
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "A deduction or trivia challenge.", question: t.q, options: [{id:'a',text:t.opts[0]}, {id:'b',text:t.opts[1]}, {id:'c',text:t.opts[2]}, {id:'d',text:t.opts[3]}], correctOptionId: t.ans, explanation: t.explanation });
      } else if (['cipher', 'anagram', 'cryptogram', 'word_scramble', 'missing_letters', 'word_association', 'sequence', 'hidden_words', 'synonym_chain', 'antonym_chain', 'compound_word', 'rebus', 'before_after', 'homophone', 'morse_code'].includes(type)) {
        if (type === 'word_association') {
            const wa = wordAssociations[(week - 1) % wordAssociations.length];
            puzzles.push({ ...pzl, name: "WORD ASSOCIATION", type: type, stars: 2, intro: "What word connects these?", question: wa.q, correctAnswer: wa.a, explanation: wa.exp });
        } else if (type === 'anagram' || type === 'word_scramble') {
            puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 2, intro: "Unscramble the word.", question: "LISTEN", correctAnswer: "SILENT", explanation: "LISTEN rearranges to SILENT." });
        } else {
            const shift = (week % 5) + 2;
            puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "Decode or solve the pattern.", question: `Shifted text or pattern ${shift}`, correctAnswer: "ANSWER", explanation: `The answer is ANSWER.` });
        }
      } else if (['mystery', 'who_stole_it', 'case_file', 'escape_room', 'alibi_puzzle', 'mystery_clues'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Read the clues and solve the case.", story: "A valuable item was stolen.", clues: JSON.stringify(["Suspect A was seen at 9 PM.", "Suspect B has no alibi."]), options: JSON.stringify([{id:'a',text:"Suspect A"}, {id:'b',text:"Suspect B"}]), correctOptionId: 'b', explanation: "Suspect B had the motive and no alibi." });
      } else if (['logic', 'zebra', 'einstein', 'who_owns_the_cat', 'deduction_grid'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 5, intro: "Use the clues to fill the grid.", categories: JSON.stringify(["House", "Pet"]), items: JSON.stringify([["Red", "Blue"], ["Dog", "Cat"]]), clues: JSON.stringify(["The red house has a dog."]), solution: JSON.stringify({"Red":"Dog", "Blue":"Cat"}), explanation: "Deduction leads to this arrangement." });
      } else if (['timeline', 'ordering', 'scheduling', 'matching', 'who_sits_where'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 3, intro: "Sort the items logically.", question: "Drag and drop to reorder.", items: [{id:'c',text:"Event 3"}, {id:'a',text:"Event 1"}, {id:'d',text:"Event 4"}, {id:'b',text:"Event 2"}], solutionOrder: ['a', 'b', 'c', 'd'], explanation: "Logical sequence 1 to 4." });
      } else if (['minesweeper', 'lights_out', 'nonogram', 'picross', 'hitori', 'nurikabe'].includes(type)) {
        puzzles.push({ ...pzl, name: type.replace('_', ' ').toUpperCase(), type: type, stars: 4, intro: "Grid logic puzzle.", rows: 3, cols: 3, solutionGrid: [[1, 0, 1], [0, 1, 0], [1, 0, 1]], explanation: "An X pattern." });
      }
"""

start_idx = content.find("if (type === 'crossword') {")
end_idx = content.find("    });", start_idx)

new_content = content[:start_idx] + new_logic.strip() + "\n" + content[end_idx:]

with open('js/seed_puzzles.js', 'w') as f:
    f.write(new_content)
