import { ReactNode } from "react";

//***** Dialogs *****//
type BaseDialogParams = {
  onClose: () => void;
};

// Cannot work out how to force an onClose function here
type Dialog = (p: BaseDialogParams & any) => ReactNode;

export type DialogList = {
  [a: string]: Dialog;
};

export type LaunchDialogFunction<DIALOGS extends DialogList> = <
  KEY extends keyof DIALOGS
>(
  k: KEY,
  params: Omit<Parameters<DIALOGS[KEY]>[0], "onClose">
) => void;

//***** Notifications *****//
type Notification = (p: any) => ReactNode;

export type NotificationList = {
  [a: string]: Notification;
};

export type LaunchNotificationFunction<NOTIFICATIONS extends NotificationList> =
  <KEY extends keyof NOTIFICATIONS>(
    k: KEY,
    seconds: number,
    params: Parameters<NOTIFICATIONS[KEY]>[0]
  ) => void;
