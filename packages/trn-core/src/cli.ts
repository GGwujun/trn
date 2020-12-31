import minimist from "minimist";
import { CommandHookCore } from "./core";
import { PluginManager } from "./pluginManager";

export class BaseCLI {
  argv: any;
  core: any;
  spec: any;
  commands: string[];
  cwd = process.cwd();
  cli: any;

  constructor(argv: string | any[]) {
    if (Array.isArray(argv)) {
      this.argv = minimist(argv.slice(2));
    } else {
      this.argv = argv;
    }
    // 命令参数执行的命令
    this.commands = [].concat(this.argv._.slice(1));
    // cli的核心实例
    this.core = new CommandHookCore({
      commands: this.commands,
      options: this.argv,
      log: this.loadLog(),
      displayUsage: this.displayUsage.bind(this),
    });
  }

  async loadPlugins() {
    // 加载core内部核心插件
    this.loadCorePlugin();
    // 加载默认插件
    this.loadDefaultPlugin();
  }

  loadCorePlugin() {
    //加载plugin/plugin
    this.core.addPlugin(PluginManager);
  }

  // 加载默认插件
  loadDefaultPlugin() {}

  // 加载命令行输出及报错
  loadLog() {
    return { ...console, error: this.error };
  }

  // 展示帮助信息
  displayUsage(commandsArray: any[], coreInstance: { commands: any }) {
    if (commandsArray && commandsArray.length) {
      commandsArray.forEach((command) => {
        coreInstance.commands[command].outputHelp();
      });
    } else {
      Object.keys(coreInstance.commands).forEach((command) => {
        coreInstance.commands[command].outputHelp();
      });
    }
  }

  error(err: { message: any }) {
    console.error((err && err.message) || err);
    process.exit(1);
  }

  async start() {
    await this.loadPlugins();
    await this.core.ready();
    await this.core.invoke();
  }
}
