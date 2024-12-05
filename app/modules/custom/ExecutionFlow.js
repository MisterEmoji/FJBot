const actionType = {
  entry: 0,
  math: 1,
  exit: 2,
  loop: 3,
  if: 4,
  set: 5,
  calc: 6,
};

const calcType = {
  add: "+",
  sub: "-",
  mul: "*",
  div: "/",
  mod: "%",
  pow: "**",
};

const tStruct = [
  {
    action: actionType.entry,
    variablesCount: 2,
  },
  {
    action: actionType.set,
    variableIndex: 1,
    value: 10,
  },
  {
    action: actionType.if,
    expression: "$1 == 0",
    offset: [1, 2],
  },
  {
    action: actionType.calc,
    calcType: calcType.add,
    returnTo: 0,
    arguments: ["$1", 2],
    offset: [2],
  },
  {
    action: actionType.calc,
    calcType: calcType.sub,
    returnTo: 0,
    arguments: ["$1", 2],
  },
];

const varPattern = /\$(\d{1,})/g;

class ExecutionFlow {
  data = [];
  #currentIndex = 0;
  #currentNode = null;
  #variables = null;

  /**
   * Constructor for ExecutionFlow.
   * @param {Object[]} data an array of instructions, each with a valid 'action' property.
   * @param {boolean} [initToZero=true] whether to initialize the variables to 0.
   * @throws if the first data item is not an entry point.
   */
  constructor(data, initToZero = true) {
    this.data = data;
    this.#currentNode = this.data[this.#currentIndex];

    if (this.#currentNode?.action !== actionType.entry) {
      throw new Error("First data item must be an entry point.");
    }

    this.#variables = Array(this.#currentNode.variablesCount);
    if (initToZero) this.#variables.fill(0);

    this.pointNextNode();
  }

  #resolveArguments(node) {
    return node.arguments.map((arg) => {
      if (typeof arg === "string" && arg[0] === "$") {
        return this.#variables[arg.slice(1)];
      } else {
        return arg;
      }
    });
  }

  pointNextNode(nodesToSkip = 1) {
    this.#currentIndex += nodesToSkip;

    if (this.#currentIndex >= this.data.length) this.#currentNode = null;
    else this.#currentNode = this.data[this.#currentIndex];
  }

  #TokenizeExpr(expr) {
    return expr.split("()=&|!").map((t) => t.trim());
  }

  #resolveExprToBoolHelper(tokens) {
    let mods = "";
    let ops = "";

    let i = 0;

    for (const token in tokens) {
      if (token in "(!") {
        mods += token;
      } else {
        ops = token;
        break;
      }
      i++;
    }

    const right = this.#resolveExprToBoolHelper(tokens.slice(i));
  }

  #resolveExprToBool(expression) {
    const tokens = this.#TokenizeExpr(
      expression.replaceAll(varPattern, (match) => {
        return this.#variables[match.slice(1)];
      })
    );

    const values = tokens.map((t) => {
      if (!(t in "!()=&|")) {
        // return this.#resolveExprToBoolHelper(tokens.slice(i));+
      } else {
        return t;
      }
    });
  }

  #applyCalcOperator(a, op, b) {
    switch (op) {
      case calcType.add:
        return a + b;
      case calcType.sub:
        return a - b;
      case calcType.mul:
        return a * b;
      case calcType.div:
        return a / b;
      case calcType.mod:
        return a % b;
      case calcType.pow:
        return a ** b;
    }
  }

  /**
   * Execute the instructions of this execution flow.
   * @throws if there are more than one entry points.
   */
  process() {
    console.log(this.#variables);
    let nodesToSkip = 1;
    let offsetIndex = 0;
    while (this.#currentNode) {
      offsetIndex = 0;

      switch (this.#currentNode.action) {
        case actionType.entry:
          throw new Error("There must be only one entry point.");

        // case actionType.exit:
        // return;

        case actionType.set:
          this.#variables[this.#currentNode.variableIndex] =
            this.#currentNode.value;
          break;

        case actionType.math: {
          const args = this.#resolveArguments(this.#currentNode);
          this.#variables[this.#currentNode.returnTo] = Math[
            this.#currentNode.function
          ](...args);
          break;
        }

        case actionType.if: {
          if (this.#resolveExprToBool(this.#currentNode.expression)) {
            offsetIndex = 0;
          } else {
            offsetIndex = 1;
          }
          break;
        }

        case actionType.calc: {
          const [a, b] = this.#resolveArguments(this.#currentNode);

          this.#variables[this.#currentNode.returnTo] = this.#applyCalcOperator(
            a,
            this.#currentNode.calcType,
            b
          );
          break;
        }
      }
      nodesToSkip = this.#currentNode?.offset?.[offsetIndex] ?? 1;

      this.pointNextNode(nodesToSkip);
    }
    console.log(this.#variables);
  }
}

module.exports = ExecutionFlow;

new ExecutionFlow(tStruct).process();
