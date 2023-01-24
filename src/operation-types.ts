import {
  DialogList,
  LaunchDialogFunction,
  LaunchNotificationFunction,
  NotificationList,
} from "./input-management-types";

export type ContextType<
  DIALOGS extends DialogList,
  NOTIFICATIONS extends NotificationList
> = {
  launchDialog: LaunchDialogFunction<DIALOGS>;
  launchNotification: LaunchNotificationFunction<NOTIFICATIONS>;
};

export type ProviderStateType<
  DIALOGS extends DialogList,
  NOTIFICATIONS extends NotificationList
> = {
  dialog: {
    key: keyof DIALOGS;
    params: Record<string, unknown>;
  } | null;

  notifications: {
    id: number;
    key: keyof NOTIFICATIONS;
    params: Record<string, unknown>;
  }[];
};
