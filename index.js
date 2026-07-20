/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import notifee from '@notifee/react-native';

export async function displayNotificationBackgroundTask(event) {
    const taskID = event.taskId;
    console.log("displayNotificationBackgroundTask()");

    if (event.timeout) {
        BackgroundFetch.finish(taskID);
        return;
    }

    const settings = await notifee.getNotificationSettings();

    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permissions has been authorized');
    } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
        console.log('Notification permissions has been denied');
        BackgroundFetch.finish(taskID);
        return;
    }

    // Create a channel
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
            channelId,
            smallIcon: 'ic_launcher',
            pressAction: {
                id: 'default',
            },
        },
    });
    BackgroundFetch.finish(taskID);
}



BackgroundFetch.registerHeadlessTask(displayNotificationBackgroundTask);
// BackgroundFetch.registerHeadlessTask(async (event) => {
//     console.log("HEADLESS START");
//     console.log(JSON.stringify(event));

//     BackgroundFetch.finish(event.taskId);
// });

AppRegistry.registerComponent(appName, () => App);
