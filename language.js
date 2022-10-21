const ADD = "ADD";
const DIV = "DIV";
const SUB = "SUB";
const MUL = "MUL";
const PUSH = "PUSH";
const STOP = "STOP";
const LT = "LT";
const GT = "GT";
const EQ = "EQ";
const AND = "AND";
const OR = "OR";
const JUMP = "JUMP";
const JUMPI = "JUMPI";
class Machine {
  constructor() {
    this.state = {
      programCounter: 0,
      stack: [],
      code: [],
      executionCount: 0,
    };
  }

  jump() {
    const destination = this.state.stack.pop();
    if (destination < 0 || destination > this.state.code.length) {
      throw new Error(`Invalid destination: ${destination}`);
    }
    this.state.programCounter = destination;
    this.state.programCounter--;
  }

  runInstructions(code) {
    this.state.code = code; //[PUSH,2,PUSH,3,ADD,STOP]
    while (this.state.programCounter < this.state.code.length) {
      console.log(this.state.programCounter, this.state.code.length);
      this.state.executionCount++;
      if (this.state.executionCount > 10000) {
        throw new Error("Infinite Loop Detected");
      }
      const opcode = this.state.code[this.state.programCounter];
      try {
        switch (opcode) {
          case STOP:
            throw new Error("Instruction Successful");
          case PUSH:
            this.state.programCounter++;
            if (this.state.programCounter === this.state.code.length) {
              throw new Error(`This PUSH instruction is not valid`);
            }
            const value = this.state.code[this.state.programCounter];
            this.state.stack.push(value);
            break;
          case ADD:
          case SUB:
          case DIV:
          case MUL:
          case LT:
          case GT:
          case EQ:
          case AND:
          case OR:
            const a = this.state.stack.pop();
            const b = this.state.stack.pop();
            let result;
            if (opcode === ADD) result = a + b;
            if (opcode === SUB) result = a - b;
            if (opcode === MUL) result = a * b;
            if (opcode === DIV) result = a / b;
            if (opcode === LT) result = a < b ? 1 : 0;
            if (opcode === GT) result = a > b ? 1 : 0;
            if (opcode === EQ) result = a === b ? 1 : 0;
            if (opcode === AND) result = a && b;
            if (opcode === OR) result = a || b;
            this.state.stack.push(result);
            break;
          case JUMP:
            this.jump();
            break;
          case JUMPI:
            const condition = this.state.stack.pop();
            if (condition === 1) {
              this.jump();
            }
            break;
          default:
            break;
        }
      } catch (e) {
        if (e.message === "Instruction Successful") {
          return this.state.stack[this.state.stack.length - 1];
        }
        throw e;
      }
      this.state.programCounter++;
    }
  }
}
//let code = [PUSH, 2, PUSH, 2, EQ, STOP];
let instruction = new Machine();
// let result = instruction.runInstructions(code);
// console.log(result);

// code = [PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, "Hi", STOP];
// instruction = new Machine();
// result = instruction.runInstructions(code);
// console.log(result);

// code = [PUSH, 8, PUSH, 1, JUMPI, PUSH, 0, JUMP, PUSH, "Hi I am JUMPI", STOP];
// instruction = new Machine();
// result = instruction.runInstructions(code);
// console.log(result);

// code = [PUSH, 111, JUMP, PUSH, 0, JUMP, PUSH, "Hi", STOP];
// try {
//   instruction = new Machine();
//   instruction.runInstructions(code);
// } catch (e) {
//   console.log(`Invalid destination error`, e.message);
// }

code = [PUSH, 0, PUSH];
try {
  instruction = new Machine();
  instruction.runInstructions(code);
} catch (e) {
  console.log(`Invalid PUSH`, e.message, instruction.state.programCounter);
}

// code = [PUSH, 0, JUMP, STOP];
// try {
//   instruction = new Machine();
//   instruction.runInstructions(code);
// } catch (e) {
//   console.log(`Loop Issue`, e.message);
// }
