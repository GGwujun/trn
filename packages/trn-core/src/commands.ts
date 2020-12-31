import {
  removeBrackets,
  findAllBrackets,
  findLongest,
  padRight,
  CACError,
} from "./utils/index";

import Option from "./option";
import { ICommandInstance } from "./interface/plugin";

interface CommandArg {
  required: boolean;
  value: string;
  variadic: boolean;
}

interface HelpSection {
  title?: string;
  body: string;
}

interface CommandConfig {
  allowUnknownOptions?: boolean;
  ignoreOptionDefaultValue?: boolean;
}

interface CommandConsArgu {
  rawName: string;
  description: string | undefined;
  type?: string;
  lifecycleEvents?: string[];
  usage?: string;
  config:
    | {
        [key: string]: string | boolean;
      }
    | undefined;
  rank?: number;
  options?: {
    [option: string]: {
      usage: string;
      shortcut?: string;
    };
  }[];
  origin: any[];
  commands?: {
    [command: string]: ICommandInstance;
  };
}

type HelpCallback = (sections: HelpSection[]) => void | HelpSection[];

type CommandExample = ((bin: string) => string) | string;

class Command {
  rawName!: string;
  options: any[];
  aliasNames: string[];
  /* Parsed command name */
  name: string;
  args: CommandArg[];
  config: {
    [key: string]: string | boolean;
  };
  rank: number;
  origin: any[];
  lifecycleEvents: string[];
  commandAction?: (...args: any[]) => any;
  usageText?: string;
  versionNumber?: string;
  examples: CommandExample[];
  helpCallback?: HelpCallback;
  globalCommand?: GlobalCommand;

  constructor(argument: CommandConsArgu) {
    const {
      config = {},
      description,
      rawName,
      origin = [],
      lifecycleEvents = [],
      rank = -1,
    } = argument;
    this.options = [];
    this.config = config;
    this.origin = origin;
    this.rank = rank;
    this.lifecycleEvents = lifecycleEvents;
    this.aliasNames = [];
    this.usageText = description;
    this.name = removeBrackets(rawName);
    this.args = findAllBrackets(rawName);
    this.examples = [];
  }

  usage(text: string) {
    this.usageText = text;
    return this;
  }

  SetRank(rank: number) {
    this.rank = rank;
    return this;
  }

  SetLifecycleEvents(lifecycleEvents: any) {
    this.lifecycleEvents = lifecycleEvents;
    return this;
  }

  addOrigin(commandInstance: any) {
    this.origin.push(commandInstance);
  }

  allowUnknownOptions() {
    this.config.allowUnknownOptions = true;
    return this;
  }

  ignoreOptionDefaultValue() {
    this.config.ignoreOptionDefaultValue = true;
    return this;
  }

  version(version: string, customFlags = "-v, --version") {
    this.versionNumber = version;
    this.option(customFlags, "Display version number");
    return this;
  }

  example(example: CommandExample) {
    this.examples.push(example);
    return this;
  }

  /**
   * Add a option for this command
   * @param rawName Raw option name(s)
   * @param description Option description
   * @param config Option config
   */
  option(rawName: string, description: string, config?: any) {
    const option = new Option(rawName, description, config);
    this.options.push(option);
    return this;
  }

  alias(name: string) {
    this.aliasNames.push(name);
    return this;
  }

  action(callback: (...args: any[]) => any) {
    this.commandAction = callback;
    return this;
  }

  /**
   * Check if a command name is matched by this command
   * @param name Command name
   */
  isMatched(name: string) {
    return this.name === name || this.aliasNames.includes(name);
  }

  get isDefaultCommand() {
    return this.name === "" || this.aliasNames.includes("!");
  }

  get isGlobalCommand(): boolean {
    return this instanceof GlobalCommand;
  }

  /**
   * Check if an option is registered in this command
   * @param name Option name
   */
  hasOption(name: string) {
    name = name.split(".")[0];
    return this.options.find((option) => {
      return option.names.includes(name);
    });
  }

  outputHelp() {
    const { name } = this;
    let sections: HelpSection[] = [];

    sections.push({
      title: "\n\nCommand",
      body: `  $ ${name}     ${this.usageText || this.rawName}`,
    });

    const options = this.options;
    if (options.length > 0) {
      const longestOptionName = findLongest(
        options.map((option) => option.rawName)
      );
      sections.push({
        title: "Options",
        body: options
          .map((option) => {
            return `  ${padRight(option.rawName, longestOptionName.length)}  ${
              option.description
            } ${
              option.config.default === undefined
                ? ""
                : `(default: ${option.config.default})`
            }`;
          })
          .join("\n"),
      });
    }

    console.log(
      sections
        .map((section) => {
          return section.title
            ? `${section.title}:\n${section.body}`
            : section.body;
        })
        .join("\n\n")
    );
  }

  checkRequiredArgs() {
    // const minimalArgsCount = this.args.filter((arg) => arg.required).length;
    // if (this.cli.args.length < minimalArgsCount) {
    //   throw new CACError(
    //     `missing required args for command \`${this.rawName}\``
    //   );
    // }
  }

  /**
   * Check if the parsed options contain any unknown options
   *
   * Exit and output error when true
   */
  checkUnknownOptions() {
    const { options } = this;

    if (!this.config.allowUnknownOptions) {
      for (const name of Object.keys(options)) {
        if (name !== "--" && !this.hasOption(name)) {
          throw new CACError(
            `Unknown option \`${name.length > 1 ? `--${name}` : `-${name}`}\``
          );
        }
      }
    }
  }

  /**
   * Check if the required string-type options exist
   */
  checkOptionValue() {
    const { options: parsedOptions } = this;
    const options = [...this.options];
    for (const option of options) {
      const value = parsedOptions[option.name.split(".")[0]];
      // Check required option value
      if (option.required) {
        const hasNegated = options.some(
          (o) => o.negated && o.names.includes(option.name)
        );
        if (value === true || (value === false && !hasNegated)) {
          throw new CACError(`option \`${option.rawName}\` value is missing`);
        }
      }
    }
  }
}

class GlobalCommand extends Command {
  constructor() {
    super({
      rawName: "@@global@@",
      description: "",
      type: "command",
      lifecycleEvents: [],
      rank: -1,
      options: [],
      origin: [],
      commands: {},
      config: {},
    });
  }
}

export { HelpCallback, CommandExample, CommandConfig, GlobalCommand };

export default Command;
