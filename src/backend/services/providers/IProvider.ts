export interface INotificationProvider {
  send(payload: any): Promise<void>;
}
