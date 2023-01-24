import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import {
  DialogList,
  LaunchDialogFunction,
  LaunchNotificationFunction,
  NotificationList,
} from "./input-management-types";
import { ContextType, ProviderStateType } from "./operation-types";

const INITIAL_STATE = { dialog: null, notifications: [] };

const MS_PER_SECOND = 1000;

export interface ReactLauncherOptions<
  DIALOGS extends DialogList,
  NOTIFICATIONS extends NotificationList
> {
  dialogs?: DIALOGS;
  notifications?: NOTIFICATIONS;

  notificationsWrapper?: FC<PropsWithChildren>;
}

export function createReactLauncher<
  DIALOGS extends DialogList,
  NOTIFICATIONS extends NotificationList
>({
  dialogs,
  notifications,
  notificationsWrapper: NotificationsWrapper = ({ children }) => (
    <>{children}</>
  ),
}: ReactLauncherOptions<DIALOGS, NOTIFICATIONS>) {
  const context = createContext<ContextType<DIALOGS, NOTIFICATIONS>>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    launchDialog: () => {},

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    launchNotification: () => {},
  });

  const ReactLauncherProvider = ({ children }: PropsWithChildren) => {
    const [launchState, setLaunchState] =
      useState<ProviderStateType<DIALOGS, NOTIFICATIONS>>(INITIAL_STATE);

    const dialog =
      launchState.dialog !== null
        ? dialogs?.[launchState.dialog.key]
        : undefined;

    const dialogProps = {
      ...launchState.dialog?.params,
      onClose: () =>
        setLaunchState((current) => ({ ...current, dialog: null })),
    };

    const launchDialog: LaunchDialogFunction<DIALOGS> = (key, params) => {
      setLaunchState((current) => ({ ...current, dialog: { key, params } }));
    };

    const launchNotification: LaunchNotificationFunction<NOTIFICATIONS> = (
      key,
      timeout,
      params
    ) => {
      const instanceId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      setLaunchState((current) => ({
        ...current,
        notifications: [
          ...current.notifications,
          {
            id: instanceId,
            key,
            params,
          },
        ],
      }));

      setTimeout(() => {
        setLaunchState((current) => ({
          ...current,
          notifications: current.notifications.filter(
            ({ id }) => id !== instanceId
          ),
        }));
      }, timeout * MS_PER_SECOND);
    };

    return (
      <>
        {dialog !== undefined && dialog(dialogProps)}
        <NotificationsWrapper>
          {launchState.notifications.map(({ id, key, params }) => {
            const Component = notifications?.[key];

            if (Component === undefined) {
              return;
            }

            //@ts-expect-error Complaining about the key
            return <Component key={id} {...params} />;
          })}
        </NotificationsWrapper>

        <context.Provider value={{ launchDialog, launchNotification }}>
          {children}
        </context.Provider>
      </>
    );
  };

  const useDialog = () => {
    const { launchDialog } = useContext(context);
    return launchDialog;
  };

  const useNotification = () => {
    const { launchNotification } = useContext(context);
    return launchNotification;
  };

  return {
    ReactLauncherProvider,
    useDialog,
    useNotification,
  };
}
