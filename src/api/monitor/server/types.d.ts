/**
 * CPU相关信息
 */
export type CpuInfoVo = {
  /**
   * 核心数
   */
  cpuNum: number;
  /**
   * CPU总的使用率
   */
  total: number;
  /**
   * CPU系统使用率
   */
  sys: number;
  /**
   * CPU用户使用率
   */
  used: number;
  /**
   * CPU当前等待率
   */
  wait: number;
  /**
   * CPU当前空闲率
   */
  free: number;
};

/**
 * 内存相关信息
 */
export type MemInfoVo = {
  /**
   * 内存总量
   */
  total: number;
  /**
   * 已用内存
   */
  used: number;
  /**
   * 剩余内存
   */
  free: number;
  /**
   * 内存使用率
   */
  usage: number;
};

/**
 * JVM相关信息
 */
export type JVMInfoVo = {
  /**
   * 当前JVM占用的内存总数（M）
   */
  total: number;
  /**
   * JVM最大可用内存总数（M）
   */
  max: number;
  /**
   * JVM空闲内存（M）
   */
  free: number;
  /**
   * JDK版本
   */
  version: string;
  /**
   * JDK路径
   */
  home: string;
  /**
   * 启动时间
   */
  startTime: string;
  /**
   * 使用率
   */
  usage: number;
  /**
   * JVM使用
   */
  used: number;
  /**
   * Java名称
   */
  name: string;
  /**
   * 运行时间
   */
  runTime: string;
  /**
   * 运行参数
   */
  inputArgs: string;
};

export type SysInfoVo = {
  /**
   * 服务器名称
   */
  computerName:string;
  /**
   * 服务器IP
   */
  computerIp:string;
  /**
   * 项目路径
   */
  userDir:string;
  /**
   * 操作系统
   */
  osName:string;
  /**
   * 系统架构
   */
  osArch:string;
}

export type SysFileVo = {
  /**
   * 盘符路径
   */
  dirName:string;
  /**
   * 盘符类型
   */
  sysTypeName:string;
  /**
   * 文件类型
   */
  typeName:string;
  /**
   * 总大小
   */
  total:string;
  /**
   * 剩余大小
   */
  free:string;
  /**
   * 已使用
   */
  used:string;
  /**
   * 资源的使用率
   */
  usage:number;
}

export type ServerInfoVo = {
  cpu: CpuInfoVo;
  mem: MemInfoVo;
  jvm: JVMInfoVo;
  sys: SysInfoVo;
  sysFiles: SysFileVo[];
};
