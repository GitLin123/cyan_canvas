export class Monitor {
  public static isMonitoring: boolean = false
  // 帧率
  public FPS: number = 0
  // 内存使用
  public memoryUsage: number = 0
  // CPU使用
  public cpuUsage: number = 0

  public getFps(): number {
    return this.FPS
  }
}
